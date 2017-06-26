package io.octopus.controller 

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException

import io.octopus.model._
import io.octopus.service.ReportService
import io.octopus.exception.UniqueConstraintViolationException

@RestController
@RequestMapping(Array("/api/v1/reports"))
class ReportController  @Autowired()(private val reportService: ReportService) {

  // @RequestMapping(value = Array("/plan-stats"), method = Array(RequestMethod.GET) )
  // def planStats = reportService.planStats

}