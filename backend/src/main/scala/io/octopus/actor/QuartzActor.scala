package io.octopus.actor

import scala.annotation.meta.setter

import akka.actor.Actor
import akka.routing.Router
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component
import scala.concurrent.duration.Duration
import scala.concurrent.duration.FiniteDuration
import java.util.concurrent.TimeUnit
import scala.collection.JavaConversions._

import org.quartz.CronScheduleBuilder
import org.quartz.JobBuilder
import org.quartz.JobDetail
import org.quartz.Scheduler
import org.quartz.Trigger
import org.quartz.TriggerKey
import org.quartz.TriggerBuilder
import org.quartz.JobDataMap
import org.quartz.impl.StdSchedulerFactory
import org.quartz.CronExpression
import org.quartz.impl.triggers.CronTriggerImpl
import org.quartz.JobKey
import org.springframework.scheduling.quartz.SchedulerFactoryBean

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles


import io.octopus.ext.SpringExtension
import io.octopus.actor.message._
import io.octopus.service.PlanService
import io.octopus.job.SessionMaker
import io.octopus.model.Plan


@Component(value="quartz")
@Scope("prototype")
class QuartzActor extends Actor {

  @Autowired
  private var schedulerFactory: SchedulerFactoryBean = _

  private var scheduler: Scheduler = _

  @(Autowired @setter)
  private var planService: PlanService = _

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  override def preStart = {
    scheduler = schedulerFactory.getScheduler
    scheduler.start
  }
  override def postStop = {
  }

  def receive = {
    case StartQuartz => startScheduler
    case SchedulePlan(plan:Plan) => schedulePlan(plan)
    case UpdatePlanTrigger(plan:Plan) => updatePlanTrigger(plan)
    case RemovePlanTrigger(plan:Plan) => removePlanTrigger(plan)
    case InvalidCronExpression(exp:String) => context.parent ! InvalidCronExpression(exp)
  }

  private def removePlanTrigger(plan: Plan) = {
    scheduler.deleteJob(JobKey.jobKey(s"plan.${plan.id}", "plan"));
    sender ! RemovedPlanTrigger(plan)
    log.debug(s"Remove plan trigger plan.${plan.id}")
  }

  private def updatePlanTrigger(plan: Plan) = {
    log.debug(s"Re-Scheduling plan ${plan.name}")

    val key = TriggerKey.triggerKey(s"plan.${plan.id}", "plan")
    var trigger = scheduler.getTrigger(key).asInstanceOf[CronTriggerImpl]
    if(trigger != null){
      trigger.setCronExpression(plan.schedule.trim)
      scheduler.rescheduleJob(key, trigger)
    }else{
      schedulePlan(plan,true)
    }
    sender ! UpdatedPlanTrigger(plan)
  }

  private def startScheduler = {
    schedulePlans
  }

  private def schedulePlan(planId: Int): Unit = {
    schedulePlan(planService.findOne(planId))
  }

  private def schedulePlan(plan: Plan, silent:Boolean = false): Unit = {

    log.debug(s"Scheduling plan ${plan.name}")

    if(!CronExpression.isValidExpression(plan.schedule)){
      sender ! InvalidCronExpression(plan.schedule)
    }

    val cron = CronScheduleBuilder.cronSchedule(plan.schedule)
    val trigger =
      TriggerBuilder.newTrigger()
      .withIdentity(s"plan.${plan.id}", "plan")
      .withSchedule(cron)
      .build();
    val job =
      JobBuilder.newJob(classOf[SessionMaker])
        .withIdentity(s"plan.${plan.id}", "plan")
        .build()
    var data : JobDataMap = job.getJobDataMap
    data.put("PLAN_ID", plan.id)

    scheduler.scheduleJob(job, trigger)
    if(!silent) {
      sender ! ScheduledPlan(plan)
    }
  }


  private def schedulePlans = {
    for (plan <- planService.findActive) {
      self ! SchedulePlan(plan)
    }
  }




}