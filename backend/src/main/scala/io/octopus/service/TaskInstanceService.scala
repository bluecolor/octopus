package io.octopus.service

import java.util.Date
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import org.springframework.data.jpa.domain.Specification
import org.springframework.data.domain.Sort.Direction
import org.springframework.data.domain.Sort.Order
import org.springframework.data.domain.{Sort, Page,Pageable,PageRequest}
import org.springframework.core.convert.converter.Converter
import org.springframework.messaging.simp.SimpMessagingTemplate

import io.octopus.search._
import io.octopus.repository.TaskInstanceRepository
import io.octopus.model._
import io.octopus.actor.message.{IncTaskStatsStatus,SendTaskInstanceMail, StopTask}
import io.octopus.AppInit
import io.octopus.exception._

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles
import io.octopus.query.TaskInstanceQuery

@Service
@Transactional
class TaskInstanceService @Autowired()(val taskInstanceRepository: TaskInstanceRepository) {

  @(Autowired @setter)
  private var slackService: SlackService = _

  @(Autowired @setter)
  private var taskService: TaskService = _

  @(Autowired @setter)
  private var userService: UserService = _

  @(Autowired @setter)
  private var taskInstanceSearch: TaskInstanceSearch = _ 

  @(Autowired @setter)
  private var taskInstanceLogService: TaskInstanceLogService = _

  @(Autowired @setter)
  private var appInit: AppInit = _

  @(Autowired @setter)
  private var taskInstanceQuery: TaskInstanceQuery = _

  @(Autowired @setter)
  private var mt: SimpMessagingTemplate = _

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  def findAll(page: Int, pageSize: Int) = {
    val pageable = new PageRequest(page, pageSize)
    var instances= taskInstanceRepository.findAll(pageable)
    instances.map(new Converter[TaskInstance, TaskInstance]() {
      override def convert(instance: TaskInstance): TaskInstance = {
        instance.dependencies = findDependencies(instance)
        instance
      }
    })  
  }

  def findBySessionIdAndStatusIn(sessionId: Long, statuses: Array[String]) = 
    taskInstanceRepository.findBySessionIdAndStatusIn(sessionId,statuses)

  def findByStatus(status: String) = 
    taskInstanceRepository.findByStatus(status)

  def findBySessionAndStatus(id: Long, status: String) = 
    taskInstanceRepository.findBySessionIdAndStatus(id, status)

  def countByStatus(status: String) = 
    taskInstanceRepository.countByStatus(status)

  def findOne(id: Long): TaskInstance =
    taskInstanceRepository.findOne(id)

  def findBySession(id: Long, page: Int, pageSize: Int, search:String,sortBy:String, order:String) = {
    // val me = userService.findMe     
    var p = taskInstanceQuery.findBySession(id, page, pageSize, search,sortBy, order) 
    p.content = p.content.map{ instance =>
      instance.dependencies = findDependencies(instance)
      instance
    }.asJava
    p  
  } 

  def withDependencies(instance: TaskInstance) = {
    instance.dependencies = findDependencies(instance)
    instance
  }

  def findDependencies(instance: TaskInstance): List[TaskInstance] = {
    taskInstanceRepository
      .findByTaskIdIn(instance.task.dependencies.map(_.id).asJava)
      .groupBy(_.task.id)
      .values
      .map(_.maxBy(_.session.scheduleDate))
      .toList
  }


  def create(taskInstance: TaskInstance): TaskInstance = {
    taskInstanceRepository.save(taskInstance)
  }

  def createBySessionIdAndPlanId(sessionId: Long, planId: Long) = {
    var instances = taskService.findByPlan(planId).toList.map(task=>{
      var instance = new TaskInstance
      instance.task = task 
      instance.session = new Session(sessionId)
      instance
    })
    taskInstanceRepository.save(instances)
  }

  def createByTask(session: Session, tasks: java.util.List[Task]) = {
    val instances = tasks.map(task => {
      var instance = new TaskInstance
      instance.task = task
      instance.session = session
      instance
    })
    taskInstanceRepository.save(instances)
  }

  def update(i: TaskInstance): TaskInstance = {
    var instance = findOne(i.id)
    instance.priority = i.priority
    instance.technology= i.technology
    instance.status = i.status
    instance.script = i.script
    taskInstanceRepository.save(instance)
  }

  def delete(id: Long): TaskInstance = {
    val taskInstance = taskInstanceRepository.findOne(id)
    taskInstanceRepository.delete(id)
    taskInstance
  }

  def delete(ids: java.util.List[java.lang.Long]) = {
    val instances = taskInstanceRepository.findByIdIn(ids)
    taskInstanceRepository.delete(instances)
    instances
  }

  @throws(classOf[InvalidStatusTransitionException])
  def setSuccess(id: Long) = {
    var instance = findOne(id)
    if(!Status.isValid(instance.status,Status.SUCCESS)){
      val msg = s"Status change from ${instance.status} to ${Status.SUCCESS} is not allowed!"
      log.error(s"TaskInstance(${instance.id}): ${msg}")
      throw InvalidStatusTransitionException(msg)
    }
    instance.status = Status.SUCCESS
    instance.endDate= new Date
    taskInstanceRepository.save(instance)
    setStats(instance)
  }

  @throws(classOf[InvalidStatusTransitionException])
  def setError(id: Long, error: String) = {
    var instance = findOne(id)
    if(!Status.isValid(instance.status,Status.ERROR)){
      val msg = s"Status change from ${instance.status} to ${Status.ERROR} is not allowed!"
      log.error(s"TaskInstance(${instance.id}): ${msg}")
      throw InvalidStatusTransitionException(msg)
    }
    instance.status = Status.ERROR
    instance.endDate= new Date
    log.info(s"TaskInstance(${instance.id}): Set Error status - ${Status.ERROR}")
    taskInstanceRepository.save(instance)
    setStats(instance)
    logInstance(instance,error)
    sendTaskInstanceMail(instance)
    mt.convertAndSend(s"/topic/${SocketTopic.TASK_INSTANCE_ERROR}", instance);
    slackService.taskInstanceError(instance, error)
    instance
  }

  @throws(classOf[InvalidStatusTransitionException])
  def setRunning(id: Long) = {
    var instance = findOne(id)
    if(!Status.isValid(instance.status,Status.RUNNING)){
      val msg = s"Status change from ${instance.status} to ${Status.RUNNING} is not allowed!"
      log.error(s"TaskInstance(${instance.id}): ${msg}")
      throw InvalidStatusTransitionException(msg)
    }
    instance.status = Status.RUNNING
    instance.startDate= new Date
    taskInstanceRepository.save(instance)
  }

  @throws(classOf[InvalidStatusTransitionException])
  def block(id: Long) = {
    var instance = findOne(id)
    if(!Status.isValid(instance.status,Status.BLOCKED)){
      val msg = s"Status change from ${instance.status} to ${Status.BLOCKED} is not allowed!"
      log.error(s"TaskInstance(${instance.id}): ${msg}")
      throw InvalidStatusTransitionException(msg)
    }
    instance.status = Status.BLOCKED
    update(instance)
    val me = userService.findMe
    val message = s"Issued ${Status.BLOCKED} request by user ${me.name}"
    mt.convertAndSend(s"/topic/${SocketTopic.TASK_INSTANCE_BLOCKED}", (instance,me) );
    slackService.taskInstanceBlocked(instance,me)
    logInstance(instance,message)
    instance.dependencies = findDependencies(instance)
    instance
  }

  @throws(classOf[InvalidStatusTransitionException])
  def stop(id: Long) = {
    var instance = findOne(id)
    if(!Status.isValid(instance.status,Status.KILLED)){
      val msg = s"Status change from ${instance.status} to ${Status.KILLED} is not allowed!"
      log.error(s"TaskInstance(${instance.id}): ${msg}")
      throw InvalidStatusTransitionException(msg)
    }
    instance.status = Status.KILLED
    update(instance)
    setStats(instance)
    val supervisor = appInit.system.actorSelection("/user/supervisor")
    supervisor ! StopTask(instance.id)
    val me = userService.findMe
    val message = s"Issued ${Status.KILLED} request by user ${me.name}"
    mt.convertAndSend(s"/topic/${SocketTopic.TASK_INSTANCE_KILLED}", (instance,me) );
    slackService.taskInstanceKilled(instance,me)
    logInstance(instance,message)
    sendTaskInstanceMail(instance)
    instance
  }

  @throws(classOf[InvalidStatusTransitionException])
  def done(id: Long) = {
    case class DoneMessage(instance: TaskInstance, user: User)
    var instance = findOne(id)
    if(!Status.isValid(instance.status,Status.DONE)){
      val msg = s"Status change from ${instance.status} to ${Status.DONE} is not allowed!"
      log.error(s"TaskInstance(${instance.id}): ${msg}")
      throw InvalidStatusTransitionException(msg)
    }
    instance.status = Status.DONE
    update(instance)
    setStats(instance)
    val me = userService.findMe
    val message = s"Issued ${Status.DONE} request by user ${me.name}"
    mt.convertAndSend(s"/topic/${SocketTopic.TASK_INSTANCE_DONE}", (instance,me) );
    slackService.taskInstanceDone(instance,me)
    logInstance(instance,message)
    instance.dependencies = findDependencies(instance)
    instance
  }

  @throws(classOf[InvalidStatusTransitionException])
  def start(id: Long) = {
    var instance = findOne(id)
    if(!Status.isValid(instance.status,Status.IDLE)){
      val msg = s"Status change from ${instance.status} to ${Status.IDLE} is not allowed!"
      log.error(s"TaskInstance(${instance.id}): ${msg}")
      throw InvalidStatusTransitionException(msg)
    }
    instance.endDate= null
    instance.status = Status.IDLE
    update(instance)
    instance.dependencies = findDependencies(instance)
    instance
  }
  
  def sendTaskInstanceMail(instance: TaskInstance) = {
    appInit.system.actorSelection("/user/mail") ! SendTaskInstanceMail(instance)
    instance
  }
  
  private def logInstance(instance: TaskInstance, message: String = null) = {
    taskInstanceLogService.create(instance, message)
  }

  private def setStats(instance: TaskInstance) = {
    appInit.system.actorSelection("/user/stats") ! IncTaskStatsStatus(instance.task, instance.status)
    instance
  }

  def recover = {
    findByStatus(Status.RUNNING).foreach{i=>
      i.status = Status.ERROR
      taskInstanceRepository.save(i)
    }
  }  

}