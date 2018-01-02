package io.octopus.config

import akka.actor.ActorSystem
import com.typesafe.config.{Config,ConfigFactory}
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.{Bean,Configuration}
import scala.collection.JavaConversions._

import io.octopus.ext.SpringExtension


@Configuration
class ApplicationConfiguration {

  @Autowired
  private var applicationContext: ApplicationContext = _

  @Autowired
  private var springExtension: SpringExtension = _

  @Bean
  def actorSystem(): ActorSystem = {
    val actorSystem: ActorSystem =
      ActorSystem.create("actor-system", akkaConfiguration())
    springExtension.initialize(applicationContext)
    actorSystem
  }

  @Bean
  def akkaConfiguration(): Config = ConfigFactory.load()

}
