package io.octopus.job

import org.springframework.stereotype.Component
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.quartz.Job
       
import org.quartz.JobExecutionContext
import org.quartz.JobExecutionException
import org.quartz.JobDataMap
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles

import io.octopus.model.Plan
import io.octopus.service.PlanService

@Component
class SessionMaker extends Job {
	
  @(Autowired @setter)
  private var planService: PlanService = _

  private val log:Logger = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  override def execute(context: JobExecutionContext) {
		var dm:JobDataMap = context.getJobDetail().getJobDataMap
    var planId = dm.getLongValue("PLAN_ID")     
    log.debug(s"Creating session for plan($planId)")
    planService.createSession(planId)
  }
	
}