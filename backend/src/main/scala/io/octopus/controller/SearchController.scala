package io.octopus.controller 


import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException

import io.octopus.model._
import io.octopus.service.SearchService
import io.octopus.exception.UniqueConstraintViolationException

@RestController
@RequestMapping(Array("/api/v1/search"))
class SearchController @Autowired()(private val searchService: SearchService) {

  @RequestMapping(method = Array(RequestMethod.GET))
  def search(@RequestParam("q") q: String) = {
    searchService.search(q)
  }

}