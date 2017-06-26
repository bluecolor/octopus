package io.octopus.service

import scala.collection.JavaConversions._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import io.octopus.model._



@Service
@Transactional
class SchedulerService {

  @(Autowired @setter)
  private var parameterService: ParameterService = _

  @(Autowired @setter)
  private var groupService: GroupService = _

  @(Autowired @setter)
  private var connectionService: ConnectionService = _

  @(Autowired @setter)
  private var planService: PlanService = _

  
  def importScheduler(scheduler: Scheduler) = {
    if(scheduler.parameters != null) {
      parameterService.importParameters(scheduler.parameters)  
    }
    if(scheduler.groups != null) {
      groupService.importGroups(scheduler.groups)
    }
    if(scheduler.connections != null){
      connectionService.importConnections(scheduler.connections)
    }
    if(scheduler.plans != null) {
      planService.importPlans(scheduler.plans)
    }

  }

}