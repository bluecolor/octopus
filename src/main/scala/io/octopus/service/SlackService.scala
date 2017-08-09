package io.octopus.service

import scala.beans.BeanProperty
import scala.collection.JavaConversions._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import io.octopus.model.{TaskInstance, Slack=>SlackOptions}
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


  def taskInstanceError(instance: TaskInstance, error: String) = {
    
    val s = settingService.findSlackSettings
    def send(options: SlackOptions) = {      

      if(options.isActive && options.notifications.taskErrorEnabled){
        val payload = Payload.builder()
          .channel(options.channel)
          .username("octopus")
          .text(s""":worried: Task error *${instance.name}*   
            ```${error}```""")
          .build();

        val slack = Slack.getInstance
        val response = slack.send(options.url, payload)
      }
      
    }

    s match {
      case None => throw new RuntimeException("Slack settings undefined")
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