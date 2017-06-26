package io.octopus.controller 

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.validation.annotation._

import io.octopus.model.User
import io.octopus.service.UserService
import io.octopus.exception.UniqueConstraintViolationException

@RestController
@RequestMapping(Array("/api/v1/users"))
class UserController  @Autowired()(private val userService: UserService) {

  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll = userService.findAll

  @RequestMapping(value = Array("/me"), method = Array(RequestMethod.GET) )
  def findMe = userService.findMe


  @RequestMapping(value = Array("/count"), method = Array(RequestMethod.GET) )
  def count = userService.count

  @RequestMapping(method = Array(RequestMethod.POST))
  def create(@Validated @RequestBody user: User) = {
    var u: User = null 
    try{
      u = userService.create(user)
    }catch{
      case integrityViolation:DataIntegrityViolationException => 
        throw new UniqueConstraintViolationException("Username already exists!")  
    }
    u
  }

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.PUT))
  def update(@PathVariable("id") id: Long, @RequestBody user: User) = {
    userService.update(user)
  }

  @RequestMapping(value = Array("/profile"), method = Array(RequestMethod.PUT))
  def updateProfile(@RequestBody user: User) = {
    userService.updateProfile(user)
  }

  @RequestMapping(value = Array("/password"), method = Array(RequestMethod.PUT))
  def changePassword(@RequestBody pass: Map[String,String]) = {
    userService.changePassword(pass.get("currentPassword").get,pass.get("newPassword").get)
  }

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.DELETE))
  def delete(@PathVariable("id") id: Long) = {
    userService.delete(id)
  }

  @RequestMapping(value = Array("/forgot-password"), method = Array(RequestMethod.POST))
  def forgotPassword(@RequestBody str: String) = {
    userService.forgotPassword(str)
  }

}