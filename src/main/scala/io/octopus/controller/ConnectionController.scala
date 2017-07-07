package io.octopus.controller 

import java.util.Date
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletResponse

import org.springframework.security.access.annotation.Secured 
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException

import io.octopus.model.Connection
import io.octopus.service.ConnectionService
import io.octopus.exception.UniqueConstraintViolationException

@RestController
@RequestMapping(Array("/api/v1/connections"))
class ConnectionController  @Autowired()(private val connectionService: ConnectionService) {


  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll = connectionService.findAll


  @Secured(Array("OPERATOR"))
  @RequestMapping(method = Array(RequestMethod.POST))
  def create(@RequestBody connection: Connection) = {
    var con:Connection = null; 
    try{
      con = connectionService.create(connection)
    }catch{
      case integrityViolation:DataIntegrityViolationException => 
        throw new UniqueConstraintViolationException("Connection name already exists!")  
    }
    con
  }


  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.PUT))
  @Secured(Array("OPERATOR"))
  def update(@PathVariable("id") id: Long, @RequestBody connection: Connection) = 
    connectionService.update(connection)


  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.DELETE))
  @Secured(Array("OPERATOR"))
  def delete(@PathVariable("id") id: Long) =
    connectionService.delete(id)


  @RequestMapping(value = Array("/test"), method = Array(RequestMethod.POST))
  def test(@RequestBody connection: Connection): Boolean = 
    connectionService.test(connection)


  @RequestMapping(value=Array("/export/{id}"), method=Array(RequestMethod.GET))
  def export(@PathVariable("id") id: java.lang.Long, response: HttpServletResponse): Unit = {
    val now = new Date
    val df = new SimpleDateFormat("yyyyMMddHHmmss")
    val date = df.format(now)
    val connection = connectionService.findOne(id)
    
    response.setContentType("application/octet-stream; charset=utf-8")
    response.setHeader("Content-Disposition", s"attachment; filename='connection.${connection.name}.$date.json'")
    response.getWriter().print(connectionService.export(id))
  }

}