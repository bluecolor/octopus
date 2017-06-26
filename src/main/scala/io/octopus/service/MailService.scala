package io.octopus.service


import java.util.Properties;

import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import io.octopus.exception._
import io.octopus.model._
import io.octopus.exception.SystemUserNotAllowedException
import com.fasterxml.jackson.databind.ObjectMapper
import javax.mail.Session
import javax.mail.{Address,Message,MessagingException,PasswordAuthentication,Transport}
import javax.mail.internet.{InternetAddress,MimeMessage}

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles

import org.apache.commons.lang3.exception.ExceptionUtils


@Service
class MailService {

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  @(Autowired @setter)
  private var settingService: SettingService = _

  def test = {
    var mail = new Mail
    val s = settingService.findMailSettings
    if(s != None){
      mail.to = s.get.sendFrom 
      mail.from = s.get.sendFrom
      mail.subject= "Test mail from octopus"    
      mail.body = "If you see this then the mail service works."
      log.debug(s"""
        mail.to: ${mail.to}
        mail.from: ${mail.from}
      """)
      sendMail(mail)
    }
  }


  @throws(classOf[MessagingException])
  def sendTaskInstanceMail(instance: TaskInstance) = {
    var mail = new Mail
    val s = settingService.findMailSettings
    if(s != None){
      mail.to = s.get.sendTo match {
        case "o" => instance.task.owners.map(_.email).mkString(",") 
        case "p" => instance.task.primaryOwner.email
        case _ => ""
      }
      if(mail.to != null && !mail.to.isEmpty){
        mail.subject= s"${instance.name} , ${instance.status}"    
        mail.body = "Mail sent from scheduler"
        sendMail(mail)
      }
    }
  }

  def sendUserPasswordMail(user: User, password: String) = {
    var mail = new Mail
    val s = settingService.findMailSettings
    if(s != None){
      if(user.email != null){
        mail.to = user.email 
        mail.subject= s"${user.name} welcome to Octopus scheduler"    
        mail.body = s"username: ${user.name} password: ${password}"
        sendMail(mail)
      }
    }
  }

  def sendNewPasswordMail(user: User, password: String) = {
    var mail = new Mail
    val s = settingService.findMailSettings
    if(s != None){
      if(user.email != null){
        mail.to = user.email 
        mail.subject= s"New password - Octopus"    
        mail.body = s"username: ${user.name} new-password: ${password}"
        sendMail(mail)
      }
    }
  }


  def sendMail(mail: Mail) {
    val settings = settingService.findMailSettings
    if(settings != None){
      val s = settings.get
      var p = new Properties
      p.put("mail.smtp.auth", "true")
      p.put("mail.smtp.host", s"${s.host}")
      p.put("mail.smtp.port", s"${s.port}")
      
      s.connectionSecurity.toLowerCase match {
        case "ssl" => p.put("mail.smtp.ssl.enable", "true")
        case "tls" => p.put("mail.smtp.starttls.enable", "true")
        case _ => 
      }

      val session = Session.getInstance(p,
        new javax.mail.Authenticator() {
          override protected def getPasswordAuthentication : PasswordAuthentication =
            new PasswordAuthentication(s.username, s.password)
        }
      )
      log.debug("Auth. mail server OK")
      try{
        val message = new MimeMessage(session)
        message.setFrom(new InternetAddress(if(mail.from!=null) mail.from else s.sendFrom))        
        
        mail.to.split(",").foreach{m =>
          message.addRecipient(Message.RecipientType.TO,new InternetAddress(m))
        }
        message.setSubject(mail.subject)
        message.setText(mail.body)
        Transport.send(message)
      }catch {
        case e:Exception => 
          val msg = ExceptionUtils.getStackTrace(e)
          log.error(s"Unable to send mail! \n ${msg}")
      }
    }
  }


}