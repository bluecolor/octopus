package io.octopus.service

import scala.beans.BeanProperty
import scala.collection.JavaConversions._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import io.octopus.model.{TaskInstance, Slack=>SlackOptions, User}
import com.github.seratch.jslack._
import com.github.seratch.jslack.api.webhook._

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles

// Ref - http://www.emoji-cheat-sheet.com/

@Service
class SlackService {

  @(Autowired @setter)
  private var settingService: SettingService = _

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  def taskInstanceDone(instance: TaskInstance, user: User)= {
    val s = settingService.findSlackSettings
    def send(options: SlackOptions) = {      
      if(options.isActive && options.notifications.notifyTaskDone){
        val payload = Payload.builder()
          .channel(options.channel)
          .username("octopus")
          .text(s"""  
            :white_check_mark: *${instance.name}* made "done" by ${user.name}. @Session: *${instance.session.name}*
          """)
          .build();

        val slack = Slack.getInstance
        val response = slack.send(options.url, payload)
      }
    }

    s match {
      case None => throw new RuntimeException("Slack settings are not defined")
      case Some(options) => send(options)
    }
  }

  def taskInstanceBlocked(instance: TaskInstance, user: User)= {
    val s = settingService.findSlackSettings
    def send(options: SlackOptions) = {      
      if(options.isActive && options.notifications.notifyTaskBlocked){
        val payload = Payload.builder()
          .channel(options.channel)
          .username("octopus")
          .text(s"""  
            :no_entry_sign: *${instance.name}* blocked by ${user.name}. @Session: *${instance.session.name}*
          """)
          .build();

        val slack = Slack.getInstance
        val response = slack.send(options.url, payload)
      }
    }

    s match {
      case None => throw new RuntimeException("Slack settings are not defined")
      case Some(options) => send(options)
    }
  } 

  def taskInstanceKilled(instance: TaskInstance, user: User) = {
    val s = settingService.findSlackSettings
    def send(options: SlackOptions) = {      

      if(options.isActive && options.notifications.notifyTaskKilled){
        val payload = Payload.builder()
          .channel(options.channel)
          .username("octopus")
          .text(s"""  
            :japanese_ogre: *${instance.name}* killed by ${user.name}. @Session: *${instance.session.name}*
          """)
          .build();

        val slack = Slack.getInstance
        val response = slack.send(options.url, payload)
      }
    }

    s match {
      case None => throw new RuntimeException("Slack settings are not defined")
      case Some(options) => send(options)
    }
  }

  def taskInstanceError(instance: TaskInstance, error: String) = {
    
    val s = settingService.findSlackSettings
    def send(options: SlackOptions) = {      

      if(options.isActive && options.notifications.notifyTaskError){
        val payload = Payload.builder()
          .channel(options.channel)
          .username("octopus")
          .text(s""":boom: *${instance.name}* crashed. @Session: *${instance.session.name}*  
            ```${error}```""")
          .build();

        val slack = Slack.getInstance
        val response = slack.send(options.url, payload)
      }
      
    }

    s match {
      case None => throw new RuntimeException("Slack settings are not defined")
      case Some(options) => send(options)
    }
    
  }

  def test(options: SlackOptions): Boolean = {
    
      val payload = Payload.builder()
        .channel(options.channel)
        .username("octopus")
        .text(s":octopus: *Hello from Octopus*")
        .build();

      val slack = Slack.getInstance();
      val response = slack.send(options.url, payload);
      return true
  }

}