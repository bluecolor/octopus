package io.octopus.executer

import net.schmizz.sshj.common.IOUtils
import net.schmizz.sshj.connection.channel.direct.{Session => SSHSession}
import net.schmizz.sshj.connection.channel.direct.Session.Command


import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles
import io.octopus.query.TaskInstanceQuery


class ShellExecuter(private val session: SSHSession) {

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)
  
  
  def run(script: String, technology: String = null): Either[String, String] = {
    val s = getScript(script, technology)
    log.debug(s"Executing script: \n ${s}")
    val cmd = session.exec(s)   
    val err = IOUtils.readFully(cmd.getErrorStream).toString
    val out = IOUtils.readFully(cmd.getInputStream).toString
    cmd.join
    val es = cmd.getExitStatus
    
    if(es != 0){
      Left(s"Process exist status: ${es} \n ${err} ${out}")
    }else {
      Right(s"Process exist status: ${es} \n ${err} ${out}")
    }
  }

  private def getScript(script: String, technology: String) = {
    script
  }
  
}