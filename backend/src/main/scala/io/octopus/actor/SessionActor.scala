package io.octopus.actor

import scala.annotation.meta.setter

import akka.util.Timeout
import scala.concurrent.Await
import akka.pattern.{Patterns,ask}
import scala.concurrent.ExecutionContext.Implicits.global
import akka.actor.{Actor,ActorRef,UntypedActor,Cancellable,ActorIdentity,Identify}
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component
import scala.concurrent.duration.Duration
import scala.concurrent.duration.FiniteDuration
import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import scala.util.{Failure, Success}

import scala.concurrent.duration._
import java.util.concurrent.TimeUnit

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles

import io.octopus.ext.SpringExtension
import io.octopus.actor.message._
import io.octopus.model._
import io.octopus.service._

@Component(value="session")
@Scope("prototype")
class SessionActor extends Actor {

  @(Autowired @setter)
  private var sessionService: SessionService = _

  private var sessions: Map[Long,Session] = Map()
  private var taskActors: Map[Long,ActorRef] = Map()

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  override def preStart = {
    recover
    hearthBeat
  }

  override def postStop = {
  }

  def receive = {
    case Tick => tick
    case SessionAlreadyRunning(session:Session) => log.debug(s"Received SessionAlreadyRunning(${session.id})")
    case CheckNewSessions => checkNewSessions
    case CheckSession(id: Long) => checkSession(id)
    case IsSessionDone(id: Long) => isSessionDone(id)
    case IsSessionSuccess(id: Long) => isSessionSuccess(id)
    case RunTasks(sessionId: Long) => runTasks(sessionId)
    case RunSession(session: Session) => runSession(session)
    case StopSession(id: Long, status: String) => stopSession(id,status)
    case SessionDone(id: Long) => sessionDone(id)
    case SessionSuccess(id: Long) => sessionSuccess(id)
    case TaskSuccess(instance: TaskInstance) => taskInstanceSuccess(instance)
    case TaskError(instance: TaskInstance, error: String) => taskInstanceError(instance,error)
    case StartedTask(id: Long) => setTaskRunning(id)
    case StopTask(id: Long) => stopTask(id)
    case message:String => println(message)
    case _  => log.debug("huh?")
  }

  def stopTask(id: Long) = {
    taskActors get id match {
      case Some(actor) =>
        actor.forward(StopTask(id))
      case _ =>
    }
  }

  def setTaskRunning(id: Long) =
    sessionService.setTaskInstanceRunning(id)

  def taskInstanceSuccess(instance: TaskInstance) = {
    log.info("Received TaskSuccess message")
    taskActors -= instance.id
    sessionService.setTaskInstanceSuccess(instance.id)
    tick
  }

  def taskInstanceError(instance: TaskInstance, error: String) = {
    log.info("Received TaskError message")
    taskActors -= instance.id
    sessionService.setTaskInstanceError(instance.id, error)
    tick
  }

  def checkNewSessions = {
    val statuses = Array(Status.IDLE, Status.ERROR)
    sessionService.findByStatusIn(statuses).foreach(self ! RunSession(_))
  }

  def isSessionSuccess(id: Long): Boolean =
    sessionService.isSessionSuccess(id)

  def sessionSuccess(id: Long) = {
    log.debug(s"Session(${id}) success")
    sessionService.setSuccess(id)
    sessions -= id
  }

  def isSessionDone(sessionId: Long): Boolean =
    sessionService.findOne(sessionId).status == Status.DONE

  def sessionDone(id: Long) = {
    log.debug(s"Session(${id}) done")
    sessionService.setDone(id)
    sessions -= id
  }

  def runSession(session: Session) = {
    log.debug(s"Run session(${session.id})")
    sessionService.setRunning(session.id)
    if (!sessions.contains(session.id) ) {
      sessions += (session.id -> session)
    }else {
      log.debug(s"Session(${session.id}) already running!")
      sender ! SessionAlreadyRunning(session)
    }
  }

  def stopSession(sessionId: Long, status: String) = {
    if (sessions.contains(sessionId) ) {
      sessions.remove(sessionId)
    }else{
      sender ! SessionIsNotRunning(sessionId)
    }
  }

  def runTasks(sessionId: Long) = {
    log.debug(s"Run tasks of session(${sessionId})")
    val runnableTasks = sessionService.findRunnable(sessionId)
    runnableTasks.foreach{ instance =>
      if(!taskActors.contains(instance.id)){
        val actor = context.actorOf(TaskActor.props(instance), name=s"taskinstance.${instance.id}")
        actor ! StartTask
        taskActors += (instance.id -> actor)
      }
    }
  }

  def runSessions = {
    sessions.keys.foreach{ k=>
      self ! (
        if(isSessionSuccess(k))
          SessionSuccess(k)
        else if(isSessionDone(k))
          SessionDone(k)
        else
          RunTasks(k)
      )
    }
  }

  def checkSession(id: Long) = {
    log.debug(s"Check session(${id})")
  }

  def checkRunningSessions = {
    log.debug("Check running sessions")
    sessions.keys.foreach(self ! CheckSession(_))
  }

  def tick = {
    runSessions
    checkRunningSessions
  }

  private def hearthBeat = {
    log.info("Start hearth beat")
    val cancellable =
      context.system.scheduler.schedule(0 milliseconds, 15000 milliseconds,self,Tick)
  }

  private def recover = {
    sessionService.recover
  }

}