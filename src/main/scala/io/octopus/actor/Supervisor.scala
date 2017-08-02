package io.octopus.actor

import scala.concurrent.ExecutionContext.Implicits.global
import akka.actor.Actor
import akka.routing.Router
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component
import scala.concurrent.duration._
import java.util.concurrent.TimeUnit
import scala.collection.JavaConversions._
import akka.actor.{Props, ActorRef}

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles

import io.octopus.ext.SpringExtension
import io.octopus.actor.message._
import io.octopus.model._

@Component(value="supervisor")
@Scope("prototype")
class Supervisor extends Actor {

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  @Autowired
  private var springExtension: SpringExtension = _

  private var statsActor: ActorRef = _
  private var sessionActor: ActorRef = _
  private var quartzActor:  ActorRef = _
  private var mailActor:  ActorRef = _ 

  override def preStart: Unit = {
    statsActor  = context.system.actorOf(springExtension.props("stats"),"stats")
    sessionActor= context.system.actorOf(springExtension.props("session"),"session")
    quartzActor = context.system.actorOf(springExtension.props("quartz"),"quartz")
    mailActor   = context.system.actorOf(springExtension.props("mail"),"mail")
    quartzActor ! StartQuartz
    hearthBeat
  }

  override def postStop: Unit = {
  }

  def receive = {
    case Tick => tick
    case SchedulePlan(plan: Plan) => quartzActor.forward(SchedulePlan(plan))
    case UpdatePlanTrigger(plan:Plan)=> quartzActor.forward(UpdatePlanTrigger(plan))
    case RunSession(session:Session) => sessionActor.forward(RunSession(session))
    case RemovePlanTrigger(plan: Plan) => quartzActor.forward(RemovePlanTrigger(plan))
    case SendTaskInstanceMail(instance:TaskInstance) => mailActor.forward(SendTaskInstanceMail(instance))
    case StopTask(id: Long) => sessionActor.forward(StopTask(id))
    case StopSession(id:Long, status: String) => sessionActor.forward(StopSession(id,status))
    case _ => println("Opps ?")
  }

  def tick = {
    log.info("Received Tick")
    sessionActor ! CheckNewSessions   
  }


  def hearthBeat = {
    log.info("Start hearth beat")
    val cancellable = 
      context.system.scheduler.schedule(0 milliseconds, 15000 milliseconds,self,Tick)      
  }

}