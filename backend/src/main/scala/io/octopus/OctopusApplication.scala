
package io.octopus


import akka.actor.ActorRef
import akka.actor.ActorSystem
import io.octopus.ext.SpringExtension

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.Configuration
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.ComponentScan

@SpringBootApplication
class AppConfig

object OctopusApplication extends App {
  SpringApplication.run(classOf[AppConfig])
}


