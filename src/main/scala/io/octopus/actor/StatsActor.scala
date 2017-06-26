package io.octopus.actor

import scala.annotation.meta.setter
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
import io.octopus.service._


@Component(value="stats")
@Scope("prototype")
class StatsActor extends Actor {

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  @Autowired
  private var springExtension: SpringExtension = _

  @(Autowired @setter)
  private var statsService: StatsService = _


  override def preStart: Unit = {
    hearthBeat
  }

  override def postStop: Unit = {
  }

  def receive = {
    case Tick => tick
    case IncTaskStatsStatus(task:Task,status: String) => incTaskStatsStatus(task, status)
    case _ => println("Opps ?")
  }

  def incTaskStatsStatus(task: Task, status: String) =
    statsService.incTaskStatus(task, status)
  def tick = {
  }


  def hearthBeat = {
    log.info("Start hearth beat")
    val cancellable = 
      context.system.scheduler.schedule(0 milliseconds, 30000 milliseconds,self,Tick)      
  }

}