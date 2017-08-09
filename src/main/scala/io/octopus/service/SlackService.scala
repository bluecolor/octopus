package io.octopus.service

import scala.beans.BeanProperty
import scala.collection.JavaConversions._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import io.octopus.model._
import in.ashwanthkumar.slack.webhook._

@Service
class SlackService {

  def taskInstanceError(instance: TaskInstance) = {
    val url = "https://hooks.slack.com/services/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"
    new Slack(url)
    .icon(":smiling_imp:") // Ref - http://www.emoji-cheat-sheet.com/
    .sendToUser("general")
    .displayName("slack-java-client")
    .push(new SlackMessage("Text from my ").bold("Slack-Java-Client"));
  }
}