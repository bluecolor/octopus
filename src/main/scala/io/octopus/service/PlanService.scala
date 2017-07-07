package io.octopus.service


import scala.collection.JavaConverters._
import scala.collection.JavaConversions._
import akka.util.Timeout
import scala.concurrent.Await
import scala.concurrent.duration._
import java.util.concurrent.TimeUnit
import akka.pattern.{Patterns,ask}
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import org.quartz.CronExpression

import io.octopus.AppInit
import io.octopus.repository.PlanRepository
import io.octopus.model._
import io.octopus.exception._
import io.octopus.actor.message._

import com.fasterxml.jackson.databind.ObjectMapper

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles


@Service
@Transactional
class PlanService @Autowired()(val planRepository: PlanRepository) {

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  @(Autowired @setter)
  private var appInit: AppInit = _

  @(Autowired @setter)
  private var sessionService: SessionService = _

  @(Autowired @setter)
  private var taskService: TaskService = _


  def findAll = planRepository.findAll
  
  def findActive = planRepository.findByActiveTrue

  def findOne(id: Long): Plan = planRepository.findOne(id)

  def findByNameContainingIgnoreCase(q: String) = 
    planRepository.findByNameContainingIgnoreCase(q)

  def isHaveActiveSession(id: Long): Boolean =
    sessionService.isActiveSessionOfPlanExist(id)

  def askToSupervisor[T](message: AnyRef, resp: Class[T]):T = {
    val supervisor = appInit.system.actorSelection("/user/supervisor")
    implicit val timeout: Timeout = 5 seconds 
    val future  = supervisor ? message 
    Await.result(future, timeout.duration).asInstanceOf[T]
  }  

  @throws(classOf[InvalidCronExpressionException])
  def create(plan: Plan): Plan = {
    val p = planRepository.findByNameIgnoreCase(plan.name)
    if(p != null && p.name.toLowerCase == plan.name.toLowerCase){
      throw new PlanExistException(plan.name)
    }
    plan.schedule = plan.schedule.trim
    if(!CronExpression.isValidExpression(plan.schedule)){
      throw InvalidCronExpressionException(plan.schedule)
    }
    planRepository.save(plan)
    if(plan.active == true){
      askToSupervisor(SchedulePlan(plan), classOf[ScheduledPlan]).plan
    }
    plan
  }

  def update(plan: Plan): Plan = {
    var p = planRepository.findOne(plan.id)
    p.schedule = plan.schedule.trim
    if(!CronExpression.isValidExpression(p.schedule)){
      throw InvalidCronExpressionException(plan.schedule)
    }

    if(p.tasks.isEmpty && plan.active){
      throw new RuntimeException("Can not activate plan with no tasks!");
    }

    p.connection = plan.connection
    p.priority = plan.priority
    p.active = plan.active
    p.protect = plan.protect
    p.description = plan.description
    planRepository.save(p)
    if(plan.active){
      askToSupervisor(UpdatePlanTrigger(plan), classOf[UpdatedPlanTrigger]).plan
    }else {
      askToSupervisor(RemovePlanTrigger(plan), classOf[RemovedPlanTrigger]).plan
    }
  }

  def delete(id: Long): Plan = {
    val plan = planRepository.findOne(id)
    planRepository.delete(id)
    askToSupervisor(RemovePlanTrigger(plan), classOf[RemovedPlanTrigger]).plan
  }

  def deleteAll() = {
    val plans = planRepository.findAll
    for(p <- plans) {
      planRepository.delete(p.id)
      askToSupervisor(RemovePlanTrigger(p), classOf[RemovedPlanTrigger])
    }
    plans
  }

  def createSession(planId: Long, force: Boolean = false): Session = {
    val plan = findOne(planId)
    
    if(!plan.active){
      log.debug(s"Plan(plan.name) is not active!")
      return null
    }
    if(force){
      return sessionService.createByPlan(plan)
    } 
    if(!plan.protect){
      return sessionService.createByPlan(plan)
    }
    if(isHaveActiveSession(planId)) {
      log.info(s"Can not create session for plan(${planId}). Has active sessions")
      return null
    }
    sessionService.createByPlan(plan)
  }

  def export(id: Long) = {
    var scheduler = new Scheduler
    val mapper = new ObjectMapper
    scheduler.plans = scala.List(planRepository.findOne(id))
    mapper.writeValueAsString(scheduler)
  }

  def exportTasks(id: Long) = {
    val mapper = new ObjectMapper
    var scheduler = new Scheduler
    val plan = planRepository.findOne(id)
    scheduler.plans = scala.List(plan)
    scheduler.tasks= plan.tasks.toList 
    mapper.writeValueAsString(scheduler)    
  }

  def importPlans(plans: java.util.List[Plan]) = {

    plans.foreach{plan =>
      var p = planRepository.findByNameIgnoreCase(plan.name)
      if(p == null) {
        p = new Plan
        p.name = plan.name
      }      
      p.protect = plan.protect
      p.schedule= plan.schedule
      p.description = plan.description
      p.connection  = plan.connection
      p.parallel = plan.parallel
      p.priority = plan.priority
      p.active = plan.active

      planRepository.save(p)
    }
    plans
  }


  private def protect(id: Long, b: Boolean): Plan = {
    var p = planRepository.findOne(id)
    if(p == null){
      throw new RuntimeException(s"Unable to find plan(${id})")
    }
    p.protect = b
    planRepository.save(p)
  }
  def protect(id: Long):Plan   = protect(id, true)
  def unProtect(id: Long):Plan = protect(id, false)

}