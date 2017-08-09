package io.octopus.controller 

import java.util.Date
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletResponse

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._
import io.octopus.model._
import io.octopus.service.SlackService

@RestController
@RequestMapping(Array("/api/v1/slack"))
class SlackController  @Autowired()(private val slackService: SlackService) {

  @RequestMapping(value = Array("/test"), method = Array(RequestMethod.POST))
  def test(@RequestBody slack: Slack): Boolean = 
    slackService.test(slack)

  
}