package io.octopus.actor

import akka.actor.{Actor}
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component
import scala.concurrent.duration.Duration
import scala.concurrent.duration.FiniteDuration
import java.util.concurrent.TimeUnit
import scala.collection.JavaConversions._
import java.lang.InterruptedException
import java.util.concurrent.Future
import org.springframework.scheduling.annotation.Async
import org.springframework.scheduling.annotation.AsyncResult

import net.schmizz.sshj.{SSHClient}
import net.schmizz.sshj.connection.channel.direct.Session.Command
import net.schmizz.sshj.connection.channel.direct.{Session => SSHSession}


import io.octopus.ext.SpringExtension
import io.octopus.actor.message._
import io.octopus.model._
import io.octopus.executer._
import io.octopus.connector._

import org.apache.commons.lang3.exception.ExceptionUtils


class SshActor(private var instance:TaskInstance) extends TaskActor(instance) {

  private var session: SSHSession = null 
  private var ssh: SSHClient = null

  @Async
  @throws(classOf[InterruptedException])
  override def asyncExec:Future[TaskInstance] = {
    try {
      val connector = new SshConnector(instance.getConnection)
      connector.connect match {
        case (a:SSHSession,b:SSHClient) => session = a; ssh = b
        case _ =>
      }
      val e = new ShellExecuter(session)
      e.run(instance.script, instance.technology.name) match {
        case Left(error)    => onError(error)
        case Right(success) => onSuccess
      }
    }catch {
      case e:Exception =>
        onError(ExceptionUtils.getStackTrace(e)) 
    }finally{
      if(session!=null && ssh != null) {
        session.close
        ssh.disconnect
      }
    }
    onDone
    return new AsyncResult[TaskInstance](instance)
  }

}