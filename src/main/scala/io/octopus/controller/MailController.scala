package io.octopus.controller 

import java.util.Date
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletResponse

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._

import io.octopus.service.MailService

@RestController
@RequestMapping(Array("/api/v1/mail"))
class MailController  @Autowired()(private val mailService: MailService) {

  
  @RequestMapping(value = Array("/test"), method = Array(RequestMethod.GET))
  def test = mailService.test
  
}