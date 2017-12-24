package io.octopus.controller 

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException

import io.octopus.model.Session
import io.octopus.service.SessionService

@RestController
@RequestMapping(Array("/api/v1/scheduler/sessions"))
class SessionController  @Autowired()(private val sessionService: SessionService) {

  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll(
    @RequestParam(value="search",required=false) search: String,
    @RequestParam(value="sortBy",required=false) sortBy: String,
    @RequestParam(value="order", required=false) order : String,
    @RequestParam("page") page: Int, 
    @RequestParam("pageSize") pageSize: Int
  ) = 
    sessionService.findAll(search, sortBy, order, page, pageSize)

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