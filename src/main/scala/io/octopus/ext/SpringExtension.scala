package io.octopus.ext

import akka.actor.Extension
import akka.actor.Props
import org.springframework.context.ApplicationContext
import org.springframework.stereotype.Component
import scala.collection.JavaConversions._

@Component
class SpringExtension extends Extension {

  private var applicationContext: ApplicationContext = _

  def initialize(applicationContext: ApplicationContext): Unit = {
    this.applicationContext = applicationContext
  }

  def props(actorBeanName: String): Props =
    Props.create(classOf[SpringActorProducer],applicationContext,actorBeanName)
}
