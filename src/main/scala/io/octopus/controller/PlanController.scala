package io.octopus.controller 

import java.util.Date
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletResponse

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException

import io.octopus.model.Plan
import io.octopus.service.PlanService
import io.octopus.exception.UniqueConstraintViolationException

@RestController
@RequestMapping(Array("/api/v1/scheduler/plans"))
class PlanController  @Autowired()(private val planService: PlanService) {

  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll() = planService.findAll

  @RequestMapping(value = Array("/active"), method = Array(RequestMethod.GET))
  def findActive() = {
    planService.findActive
  }  


  @RequestMapping(method = Array(RequestMethod.POST))
  def create(@RequestBody plan: Plan) = {
    var p:Plan = null; 
    try{
      p = planService.create(plan)
    }catch{
      case integrityViolation:DataIntegrityViolationException => 
        throw new UniqueConstraintViolationException("Plan name already exists!")  
    }
    p
  }

  @RequestMapping(value = Array("/{id}/create-session"), method = Array(RequestMethod.POST))
  def createSession(@PathVariable("id") id: Long) = {
    planService.createSession(id)
  }

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.PUT))
  def update(@PathVariable("id") id: Long, @RequestBody plan: Plan) = 
    planService.update(plan)
  

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.DELETE))
  def delete(@PathVariable("id") id: Long) = {
    planService.delete(id)
  }

  @RequestMapping(method=Array(RequestMethod.DELETE))
  def deleteAll() = {
    planService.deleteAll()
  }

  @RequestMapping(value=Array("/export/{id}"), method=Array(RequestMethod.GET))
  def export(@PathVariable("id") id: java.lang.Long, response: HttpServletResponse): Unit = {
    val now = new Date
    val df = new SimpleDateFormat("yyyyMMddHHmmss")
    val date = df.format(now)
    
    response.setContentType("application/octet-stream; charset=utf-8")
    response.setHeader("Content-Disposition", s"attachment; filename='sch.plan.$id.$date.json'")
    response.getWriter().print(planService.export(id))
  }

  @RequestMapping(value=Array("/export-tasks/{id}"), method=Array(RequestMethod.GET))
  def exportTasks(@PathVariable("id") id: java.lang.Long, response: HttpServletResponse): Unit = {
    val now = new Date
    val df = new SimpleDateFormat("yyyyMMddHHmmss")
    val date = df.format(now)
    
    response.setContentType("application/octet-stream; charset=utf-8")
    response.setHeader("Content-Disposition", s"attachment; filename='sch.plan-tasks.$id.$date.json'")
    response.getWriter().print(planService.exportTasks(id))
  }

  @RequestMapping(value = Array("/protect/{id}"), method = Array(RequestMethod.PUT))
  def protect(@PathVariable("id") id: Long) = planService.protect(id)

  @RequestMapping(value = Array("/un-protect/{id}"), method = Array(RequestMethod.PUT))
  def unProtect(@PathVariable("id") id: Long) = planService.unProtect(id)
  

}