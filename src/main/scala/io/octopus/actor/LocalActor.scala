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


import io.octopus.ext.SpringExtension
import io.octopus.actor.message._
import io.octopus.model._
import io.octopus.executer._
import io.octopus.connector._

import org.apache.commons.lang3.exception.ExceptionUtils

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles


class LocalActor(private var instance: TaskInstance) extends TaskActor(instance) {

  val rt = java.lang.Runtime.getRuntime
  var p: java.lang.Process = _

  override def stop ={
    p.destroy
    terminate
  }

  @Async
  @throws(classOf[InterruptedException])
  override def asyncExec:Future[TaskInstance] = {
    try {
      p = rt.exec(instance.script)
      p.waitFor

      val is = p.getInputStream
      val reader = new java.io.BufferedReader(new java.io.InputStreamReader(is))
      var s: String = null
      var buffer: String = null
      do {
        s = reader.readLine
        buffer += s
      }while(s != null)
      is.close

      log.debug("Task: ${instance.name} exit code: ${p.exitValue}")

      if(p.exitValue != 0){
        onError(buffer)
      }

    }catch {
      case e:Exception =>
        onError(ExceptionUtils.getStackTrace(e)) 
    }
    onSuccess
    return new AsyncResult[TaskInstance](instance)
  }

}