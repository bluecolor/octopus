package io.octopus.controller 

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException

import io.octopus.model.TaskInstance
import io.octopus.service.TaskInstanceService

@RestController
@RequestMapping(Array("/api/v1/scheduler/task-instances"))
class TaskInstanceController  @Autowired()(private val taskInstanceService: TaskInstanceService) {

  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll(
    @RequestParam(value="search",required=false) search: String,
    @RequestParam(value="sortBy",required=false) sortBy: String,
    @RequestParam(value="order", required=false) order : String,
    @RequestParam(value= "session") session: Int,
    @RequestParam("page") page: Int, 
    @RequestParam("pageSize") pageSize: Int
  ) = 
    taskInstanceService.findBySession(session,page, pageSize,search,sortBy, order)
  
  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.GET))
  def findOne(@PathVariable("id") id: Long) =
    taskInstanceService.findOne(id)

  @RequestMapping(value = Array("/status/{status}"), method = Array(RequestMethod.GET))
  def findByStatus(@PathVariable("status") status: String) = 
    taskInstanceService.findByStatus(status.toUpperCase)
  

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.PUT))
  def update(@PathVariable("id") id: Long, @RequestBody taskInstance: TaskInstance) = {
    taskInstanceService.update(taskInstance)
  }

  @RequestMapping(value = Array("/block/{id}"), method = Array(RequestMethod.PUT))
  def block(@PathVariable("id") id: Long) = {
    taskInstanceService.block(id)
  }

  @RequestMapping(value = Array("/stop/{id}"), method = Array(RequestMethod.PUT))
  def stop(@PathVariable("id") id: Long) = {
    taskInstanceService.stop(id)
  }
  
  @RequestMapping(value = Array("/start/{id}"), method = Array(RequestMethod.PUT))
  def start(@PathVariable("id") id: Long) = {
    taskInstanceService.start(id)
  }


  @RequestMapping(value = Array("/done/{id}"), method = Array(RequestMethod.PUT))
  def done(@PathVariable("id") id: Long) = {
    taskInstanceService.done(id)
  }


  @RequestMapping(value = Array("/{ids}"), method = Array(RequestMethod.DELETE))
  def delete(@PathVariable("ids") ids: java.util.List[java.lang.Long]) = {
    taskInstanceService.delete(ids)
  }
}