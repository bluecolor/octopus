package io.octopus.controller 

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException

import io.octopus.model.Technology
import io.octopus.service.StatsService
import io.octopus.exception.UniqueConstraintViolationException

@RestController
@RequestMapping(Array("/api/v1/stats"))
class StatsController @Autowired()(private val statsService: StatsService) {

  
  @RequestMapping(value = Array("/tasks/{id}"), method = Array(RequestMethod.GET) )
  def findTaskStats(@PathVariable("id") id: Long) = statsService.findTaskStats(id)

  @RequestMapping(value = Array("/tasks"), method = Array(RequestMethod.GET) )
  def findTasksStats = statsService.findTasksStats
    

}