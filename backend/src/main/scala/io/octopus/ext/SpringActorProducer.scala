package io.octopus.ext

import akka.actor.Actor
import akka.actor.IndirectActorProducer
import org.springframework.context.ApplicationContext
import scala.collection.JavaConversions._

class SpringActorProducer(private val applicationContext: ApplicationContext,
                          private val actorBeanName: String)
    extends IndirectActorProducer {

  override def produce(): Actor =
    applicationContext.getBean(actorBeanName).asInstanceOf[Actor]

  override def actorClass(): Class[_ <: Actor] =
    applicationContext.getType(actorBeanName).asInstanceOf[Class[_ <: Actor]]

}
