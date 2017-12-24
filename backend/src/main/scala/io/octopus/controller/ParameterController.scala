package io.octopus.controller 

import java.util.Date
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletResponse

import org.springframework.security.access.annotation.Secured 
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._

import io.octopus.model.Parameter
import io.octopus.service.ParameterService
import io.octopus.exception.UniqueConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException

@RestController
@RequestMapping(Array("/api/v1/scheduler/parameters"))
class ParameterController  @Autowired()(private val parameterService: ParameterService) {

  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll = parameterService.findAll

  
  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.GET))
  def findOne(@PathVariable("id") id: Long) = parameterService.findOne(id)
  

  @RequestMapping(method = Array(RequestMethod.POST))
  @Secured(Array("ROLE_MASTER","ROLE_OPERATOR"))
  def create(@RequestBody parameter: Parameter) = {
    var p:Parameter = null; 
    try{
      p = parameterService.create(parameter)
    }catch{
      case integrityViolation:DataIntegrityViolationException => 
        throw new UniqueConstraintViolationException("Parameter name already exists!")  
    }
    p
  }


  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.PUT))
  @Secured(Array("ROLE_MASTER","ROLE_OPERATOR"))
  def update(@PathVariable("id") id: Long, @RequestBody parameter: Parameter) = 
    parameterService.update(parameter)
  

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.DELETE))
  @Secured(Array("ROLE_MASTER","ROLE_OPERATOR"))
  def delete(@PathVariable("id") id: Long) = parameterService.delete(id)


  @RequestMapping(value=Array("/export/{ids}"), method=Array(RequestMethod.GET))
  def export(@PathVariable("ids") ids: java.util.List[java.lang.Long], response: HttpServletResponse): Unit = {
    val now = new Date
    val df = new SimpleDateFormat("yyyyMMddHHmmss")
    val date = df.format(now)
    
    response.setContentType("application/octet-stream; charset=utf-8")
    response.setHeader("Content-Disposition", s"attachment; filename='sch.parameters.$date.json'")
    response.getWriter().print(parameterService.export(ids))
  }

}