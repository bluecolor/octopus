package io.octopus

import scala.annotation.meta.setter

import akka.actor.ActorSystem
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component
import javax.annotation.PostConstruct

import io.octopus.ext.SpringExtension


@Component
@Lazy(value=false)
class AppInit {

  @(Autowired @setter)
  var system: ActorSystem = _

  @(Autowired @setter)
  private var context: ApplicationContext = _

  @PostConstruct
  def init = {
    val ext = context.getBean(classOf[SpringExtension])
    ext.initialize(context)
    system.actorOf(ext.props("supervisor"),"supervisor")
  }


}