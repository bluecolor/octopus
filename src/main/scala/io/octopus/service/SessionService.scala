package io.octopus.service

import java.util.Date
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._
import scala.annotation.meta.setter
import akka.util.Timeout
import scala.concurrent.duration.Duration
import java.util.concurrent.TimeUnit
import akka.pattern.Patterns

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.PageRequest

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import io.octopus.AppInit
import io.octopus.repository.SessionRepository
import io.octopus.model._
import io.octopus.query._
import io.octopus.actor.message.RunSession

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles


@Service
@Transactional
class SessionService @Autowired()(val sessionRepository: SessionRepository) {

  @(Autowired @setter)
  private var appInit: AppInit = _

  @(Autowired @setter)
  private var taskInstanceService: TaskInstanceService = _

  @(Autowired @setter)
  private var settingService: SettingService = _

  @(Autowired @setter)
  private var groupService: GroupService = _
  
  @(Autowired @setter)
  private var planService: PlanService = _
  
  @(Autowired @setter)
  private var parameterService: ParameterService = _
  
  @(Autowired @setter)
  private var sessionQuery: SessionQuery = _
  

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)


  def findAll(search: String,sortBy: String,order : String, pageNo: Int, pageSize: Int) = {
    sessionQuery.findAll(pageNo,pageSize,search,sortBy,order)
  }

  def findOne(id: Long): Session = 
    sessionRepository.findOne(id)

  def findActiveByPlan(planId: Long) = 
    sessionRepository.findByStatusNotInAndPlanId(Array(Status.DONE), planId)
  
  def findByStatusIn(statuses: Array[String]) = 
    sessionRepository.findByStatusIn(statuses)
  
  def findByStatus(status: String) = 
    sessionRepository.findByStatus(status)

  def isActiveSessionOfPlanExist(planId: Long) = 
    if (sessionRepository.countByStatusNotInAndPlanId(Array(Status.DONE,Status.SUCCESS), planId) > 0) true else false

  def isSessionSuccess(id: Long) = {
    val blockers = Array(Status.ERROR,Status.KILLED,Status.BLOCKED, Status.IDLE)
    taskInstanceService.findBySessionIdAndStatusIn(id,blockers).length == 0
  }
    
  def create(session: Session): Session = {
    sessionRepository.save(session)
  }

  def createByPlan(plan: Plan): Session = {
    var session = new Session()
    session.plan= plan
    log.debug(s"Calling session create ${plan.active}")
    session = create(session)
    log.debug("session created")
    taskInstanceService.createBySessionIdAndPlanId(session.id, plan.id)
    session
  }

  def createByTask(tasks: java.util.List[Task]) = {
    var session = sessionRepository.save(new Session)
    val instances = taskInstanceService.createByTask(session, tasks)    
    session.taskInstances = instances
    session
  }

  def run(tasks: java.util.List[Task]) = {
    var session = createByTask(tasks)
    val supervisor = appInit.system.actorSelection("/user/supervisor")
    val message = new RunSession(session) 
    val timeout = new Timeout(Duration.create(4*1000, TimeUnit.MILLISECONDS)) 
    val future  = Patterns.ask(supervisor, message, timeout)
    session
  }

  private def findPlanSlots(session: Session, running: java.util.List[TaskInstance], maxParallel:Int): Int = {
    val plan = session.plan
    if(plan == null) return maxParallel
    plan.parallel - running.asScala.filter{ r => 
      r.session.plan != null && r.session.plan.id == plan.id  
    }.length    
  }

  private def findGroupSlotMap(running: java.util.List[TaskInstance]) = {
    var slots:Map[Long, Int] = Map()
    val groups = groupService.findAll

    groups.foreach{g => 
      slots += (g.id -> g.parallel)
    }
    running.foreach{instance =>
      instance.task.groups.foreach{g=>
        var p: Int = slots.get(g.id).get 
        slots += ( g.id -> (p-1) )
      }
    }
    slots
  }

  def findRunnable(id: Long): java.util.List[TaskInstance] = {
    val maxParallel = settingService.findByName("max_parallel")(0).value.toInt
    val session = findOne(id)
    val running = taskInstanceService.findByStatus(Status.RUNNING)
    val idle = taskInstanceService.findByStatus(Status.IDLE)
    
    var runningSlots = running.length
    var groupSlotMap = findGroupSlotMap(running)
    var planSlots = findPlanSlots(session,running, maxParallel) 
    
    if(maxParallel <= runningSlots || planSlots <= 0){
      log.debug(s"""
        No available slots!
        Plan Slots: $planSlots
        Running Slots: $runningSlots
        Maximum Slots: $maxParallel
      """)
      return null
    }

    def isDependenciesOk(dependencies: List[TaskInstance]) = {      
      val blockers = Array(Status.IDLE,Status.ERROR, Status.BLOCKED,Status.KILLED)
      dependencies == null ||
      dependencies
      .filter(d => blockers contains d.status).isEmpty
    }

    def setSlots(instance: TaskInstance) = {
      runningSlots += 1
      planSlots -= 1
      instance.task.groups.foreach{g=>
        var s:Int = groupSlotMap.get(g.id).get
        groupSlotMap += (g.id -> (s-1))
      }
      true
    }
    
    def hasSlot(instance: TaskInstance):Boolean = {
      val groups = instance.task.groups
      for(g <- groups) {
        val gs = groupSlotMap.get(g.id).get
        if(gs <= 0) return false 
      }
      setSlots(instance)
    }
    val runnable = idle.filter(i=> isDependenciesOk(taskInstanceService.findDependencies(i)) && hasSlot(i) ).asJava 
    
    log.debug(s"Found ${runnable.length} instances")    

    val parameters = parameterService.findAll

    def replaceParams(instance:TaskInstance) = {
      parameters.foreach{p=>
        if(instance.script.toLowerCase contains s".{${p.value.toLowerCase}}"){
          instance.script = instance.script.replaceAll("\\.\\{.*?\\}", p.value)
        }
      }
      instance
    }
    runnable.map(replaceParams(_))
  }

  def update(session: Session): Session = {
    sessionRepository.save(session);
  }

  def delete(id: Long): Session = {
    val session = sessionRepository.findOne(id);
    sessionRepository.delete(id);
    session
  }

  def deleteByPlanId(id: Long) = {
    sessionRepository.deleteByPlanId(id)
  }


  def setRunning(id: Long): Session = {
    var session = findOne(id)
    session.status = Status.RUNNING
    session.startDate = new Date 
    session
  } 
  
  def setSuccess(id: Long): Session = {
    var session = findOne(id)
    session.status = Status.SUCCESS
    session.endDate= new Date 
    session
  }

  def setDone(id: Long): Session = {
    var session = findOne(id)
    session.status = Status.DONE
    session.endDate= new Date 
    session
  }


  def setTaskInstanceSuccess(id: Long) = taskInstanceService.setSuccess(id)

  def setTaskInstanceError(id: Long, error: String) = 
    taskInstanceService.setError(id, error)

  def setTaskInstanceRunning(id: Long) = taskInstanceService.setRunning(id)
  

  def recover = {
    findByStatus(Status.RUNNING).foreach{s=>
      s.status = Status.ERROR
      sessionRepository.save(s)
    }
    taskInstanceService.recover
  }


}