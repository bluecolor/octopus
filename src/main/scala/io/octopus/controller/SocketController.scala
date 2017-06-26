package io.octopus.controller

import org.springframework.messaging.handler.annotation.{MessageMapping,SendTo}
import org.springframework.stereotype.Controller

@Controller
class SocketController {

  @MessageMapping(Array("/socket") )
  @SendTo(Array("/topic/messages"))
  def greeting(message: String) = {
    null
  }

}