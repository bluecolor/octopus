package io.octopus.connector

import io.octopus.model.{Connection}

import net.schmizz.keepalive.KeepAliveProvider
import net.schmizz.sshj.DefaultConfig
import net.schmizz.sshj.SSHClient
import net.schmizz.sshj.connection.channel.direct.Session
import net.schmizz.sshj.transport.verification.PromiscuousVerifier


import io.octopus.exception.UnSupportedConnectionUrlException


class SshConnector(private val connection: Connection) extends Connector {
  
  @throws(classOf[Exception])
  def test: Boolean = {
    val (session, ssh) = connect
    session.close
    ssh.disconnect
    true 
  }

  @throws(classOf[Exception])
  def connect = { 
    val conf = new DefaultConfig
    conf.setKeepAliveProvider(KeepAliveProvider.KEEP_ALIVE)
    val ssh = new SSHClient(conf)
    ssh.addHostKeyVerifier(new PromiscuousVerifier)
    ssh.connect(connection.host)
    ssh.getConnection.getKeepAlive.setKeepAliveInterval(5)
    ssh.authPassword(connection.username, connection.password)
    val session = ssh.startSession
    session.allocateDefaultPTY
    (session,ssh)        
  } 


}