package io.octopus.actor

import scala.concurrent.ExecutionContext.Implicits.global
import akka.actor.{Actor,ActorRef,UntypedActor,Props,PoisonPill}
import akka.routing.Router
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component
import scala.concurrent.duration.Duration
import scala.concurrent.duration._
import java.util.concurrent.TimeUnit
import scala.collection.JavaConversions._

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles

import java.lang.InterruptedException
import java.util.concurrent.Future
import org.springframework.scheduling.annotation.Async
import org.springframework.scheduling.annotation.AsyncResult


import io.octopus.ext.SpringExtension
import io.octopus.actor.message._
import io.octopus.model._
import io.octopus.executer._
import io.octopus.connector._

object TaskActor {
  def props(instance: TaskInstance): Props = {
    instance.getConnection.connectionType match  {
      case ConnectionType.JDBC => Props(new JdbcActor(instance))
      case ConnectionType.SSH  => Props(new SshActor(instance))
      case ConnectionType.LOCAL=> Props(new LocalActor(instance))
    }
  }
}


abstract class TaskActor(private var instance:TaskInstance) extends Actor {

  protected val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)
  protected var result: Future[TaskInstance] = _

  override def preStart = {
  }

  override def postStop = {
  }

  def receive = {
    case Tick => tick
    case StartTask => run
    case StopTask  => stop
  }

  def tick= {
    if(result.isDone) null//terminate
  }

  def terminate = {
    self ! PoisonPill
  }

  protected def stop

  def run = {
    instance.retry += 1
    context.parent ! StartedTask(instance.id)
    result = asyncExec
  }

  def onError(error: String) = {
    log.error(s"TaskInstance(${instance.id}) failed")
    log.error(error)

    if(instance.retry < instance.task.retry)
      self ! StartTask
    else
      context.parent ! TaskError(instance, error)
  }

  def onSuccess = context.parent ! TaskSuccess(instance)

  def onDone = {
  }

  @Async
  @throws(classOf[InterruptedException])
  protected def asyncExec:Future[TaskInstance]

  protected def hearthBeat = {
    val cancellable =
      context.system.scheduler.schedule(0 milliseconds, 2000 milliseconds,self,Tick)
  }

}