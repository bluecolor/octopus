package io.octopus.controller 

import java.util.Date
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletResponse


import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation._

import io.octopus.model.Group
import io.octopus.service.GroupService
import io.octopus.exception.UniqueConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException

@RestController
@RequestMapping(Array("/api/v1/scheduler/groups"))
class GroupController  @Autowired()(private val groupService: GroupService) {

  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll = groupService.findAll
  

  @RequestMapping(method = Array(RequestMethod.POST))
  def create(@RequestBody group: Group) = {
    var g:Group = null; 
    try{
      g = groupService.create(group)
    }catch{
      case integrityViolation:DataIntegrityViolationException => 
        throw new UniqueConstraintViolationException("Group name already exists!")  
    }
    g
  }

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.PUT))
  def update(@PathVariable("id") id: Long,@RequestBody group: Group) = {
    groupService.update(group)
  }

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.DELETE))
  def delete(@PathVariable("id") id: Long) = {
    groupService.delete(id)
  }

  @RequestMapping(value=Array("/export/{id}"), method=Array(RequestMethod.GET))
  def export(@PathVariable("id") id: java.lang.Long, response: HttpServletResponse): Unit = {
    val now = new Date
    val df = new SimpleDateFormat("yyyyMMddHHmmss")
    val date = df.format(now)
    
    response.setContentType("application/octet-stream; charset=utf-8")
    response.setHeader("Content-Disposition", s"attachment; filename='sch.parameters.$date.json'")
    response.getWriter().print(groupService.export(id))
  }


}