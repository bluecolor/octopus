package io.octopus.controller 

import java.io.ByteArrayInputStream

import org.springframework.web.multipart.MultipartFile
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException
import org.apache.commons.io.IOUtils
import com.fasterxml.jackson.databind.ObjectMapper

import io.octopus.model.Scheduler
import io.octopus.service.SchedulerService

@RestController
@RequestMapping(Array("/api/v1/scheduler"))
class SchedulerController @Autowired()(private val schedulerService: SchedulerService) {

  @RequestMapping(value = Array("/import"), method = Array(RequestMethod.POST))
  def importScheduler(@RequestParam("file") file: MultipartFile) = {
    
    val stream: ByteArrayInputStream = new   ByteArrayInputStream(file.getBytes())
    val json : String = IOUtils.toString(stream, "UTF-8")
    val scheduler = new ObjectMapper().readValue(json, classOf[Scheduler])

    schedulerService.importScheduler(scheduler)
  }

  @RequestMapping(value = Array("/version"), method = Array(RequestMethod.GET) )
  def planStats = schedulerService.version



}