package io.octopus.actor

import akka.actor.{Actor}
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component
import scala.concurrent.duration.Duration
import scala.concurrent.duration.FiniteDuration
import java.util.concurrent.TimeUnit
import scala.collection.JavaConversions._

import java.sql.{Connection=>JdbcConnection}
import java.lang.InterruptedException
import java.util.concurrent.Future
import org.springframework.scheduling.annotation.Async
import org.springframework.scheduling.annotation.AsyncResult

import io.octopus.ext.SpringExtension
import io.octopus.actor.message._
import io.octopus.model._
import io.octopus.executer._
import io.octopus.connector._

import org.apache.commons.lang3.exception.ExceptionUtils


class JdbcActor(private var instance:TaskInstance) extends TaskActor(instance) {

  private var connection: JdbcConnection = null

  @Async
  @throws(classOf[InterruptedException])
  override def asyncExec:Future[TaskInstance] = {
    try {
      val connector = new JdbcConnector(instance.getConnection)
      connection = connector.connect
      val e = new JdbcExecuter(connection)
      e.run(instance.script)
      onSuccess
    }catch {
      case e:Exception =>
        onError(ExceptionUtils.getStackTrace(e)) 
    }finally{
      if(connection!=null) connection.close
    }
    onDone
    return new AsyncResult[TaskInstance](instance)
  }

}