package io.octopus.service

import scala.beans.BeanProperty
import scala.collection.JavaConversions._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import io.octopus.model.{TaskInstance, Slack=>SlackOptions}
import in.ashwanthkumar.slack.webhook._

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles

// Ref - http://www.emoji-cheat-sheet.com/

@Service
class SlackService {

  @(Autowired @setter)
  private var settingService: SettingService = _

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)


  def taskInstanceError(instance: TaskInstance) = {
    
    val s = settingService.findSlackSettings
    def send(options: SlackOptions) = {      
      new Slack(options.url)
        .icon(":worried:") 
        .sendToUser(options.channel)
        .displayName("slack-octopus")
        .push(new SlackMessage("Task error ").bold(instance.name));
    }

    s match {
      case None => throw new RuntimeException("Slack settings undefined")
      case Some(options) => send(options)
    }
    
  }

  def test(options: SlackOptions): Boolean = {
    new Slack(options.url)
    .icon(":smiling_imp:")
    .sendToUser(options.channel)
    .displayName("slack-octopus")
    .push(new SlackMessage("Testing slack integration"));

    return true
  }

}