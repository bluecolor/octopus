package io.octopus.controller 

import java.util.Optional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException

import io.octopus.model.Session
import io.octopus.service.SessionService

@RestController
@RequestMapping(Array("/api/v1/sessions"))
class SessionController  @Autowired()(private val sessionService: SessionService) {

  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll(
    @RequestParam(value="search",required=false) search: Optional[String],
    @RequestParam(value="status",required=false) status: Optional[String],
    @RequestParam(value="plan",required=false) plan: Optional[java.lang.Long],
    @RequestParam(value="sortBy",required=false) sortBy: Optional[String],
    @RequestParam(value="order", required=false) order : Optional[String],
    @RequestParam(value="page",  required=false) page: Optional[Int], 
    @RequestParam(value="pageSize", required=false) pageSize: Optional[Int]
  ) = 
    sessionService.findAll(
      plan.orElse(null),
      status.orElse(null),
      search.orElse(""), 
      sortBy.orElse("name"), 
      order.orElse("asc"), 
      page.orElse(0), 
      pageSize.orElse(15))
  
  @RequestMapping(value = Array("/{id}/runnable"), method = Array(RequestMethod.GET))
  def findRunnable(@PathVariable("id") id: Long) =
    sessionService.findRunnable(id)

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.GET))
  def findOne(@PathVariable("id") id: Long) = 
    sessionService.findOne(id)

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.PUT))
  def update(@PathVariable("id") id: Long, @RequestBody session: Session) = 
    sessionService.update(session)

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.DELETE))
  def delete(@PathVariable("id") id: Long) =
    sessionService.delete(id)
  
  @RequestMapping(value = Array("/{id}/stop"), method = Array(RequestMethod.PUT))
  def stop(@PathVariable("id") id: Long) = 
    sessionService.stop(id)

  @RequestMapping(value = Array("/{id}/start"), method = Array(RequestMethod.PUT))
  def start(@PathVariable("id") id: Long) = 
    sessionService.start(id)

}