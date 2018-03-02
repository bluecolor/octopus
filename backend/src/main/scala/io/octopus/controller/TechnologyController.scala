package io.octopus.controller 

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException

import io.octopus.model.Technology
import io.octopus.service.TechnologyService
import io.octopus.exception.UniqueConstraintViolationException

@RestController
@RequestMapping(Array("/api/v1/technology"))
class TechnologyController  @Autowired()(private val technologyService: TechnologyService) {


  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll() = {
    technologyService.findAll()
  }
}