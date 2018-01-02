package io.octopus.controller 

import java.util.Date
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletResponse

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._

import io.octopus.model.Setting
import io.octopus.service.SettingService
import io.octopus.exception.UniqueConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException

@RestController
@RequestMapping(Array("/api/v1/settings"))
class SettingController  @Autowired()(private val settingService: SettingService) {

  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll = settingService.findAll

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.GET))
  def findOne(@PathVariable("id") id: Long) = settingService.findOne(id)

  @RequestMapping(value = Array("/active-mail-service"), method = Array(RequestMethod.GET))
  def activeMailService: Boolean = settingService.activeMailService
 

  @RequestMapping(method = Array(RequestMethod.POST))
  def create(@RequestBody setting: Setting) = {
    var s:Setting = null; 
    try{
      s = settingService.create(setting)
    }catch{
      case integrityViolation:DataIntegrityViolationException => 
        throw new UniqueConstraintViolationException("Setting already exists!")  
    }
    s
  }

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.PUT))
  def update(@PathVariable("id") id: Long, @RequestBody setting: Setting) = 
    settingService.update(setting)

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.DELETE))
  def delete(@PathVariable("id") id: Long) = settingService.delete(id)

}