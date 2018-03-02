package io.octopus.controller 

import java.util.Date
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletResponse

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation._

import io.octopus.service.AlertService

@RestController
@RequestMapping(Array("/api/v1/alerts"))
class AlertController  @Autowired()(private val alertService: AlertService) {

  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll = {
    alertService.findAll
  }


}