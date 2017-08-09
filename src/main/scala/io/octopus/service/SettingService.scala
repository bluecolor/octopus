package io.octopus.service


import scala.reflect.ClassTag
import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import io.octopus.exception._
import io.octopus.repository.SettingRepository
import io.octopus.model._
import io.octopus.exception.SystemUserNotAllowedException
import com.fasterxml.jackson.databind.ObjectMapper

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles

import org.apache.commons.lang3.exception.ExceptionUtils


@Service
@Transactional
class SettingService @Autowired()(val settingRepository: SettingRepository){

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)


  @(Autowired @setter)
  private var userService: UserService = _

  def findByName(name: String) = settingRepository.findByNameIgnoreCase(name)  
  
  def findAll = settingRepository.findAll

  def findOne(id: Long) = settingRepository.findOne(id)

  @throws(classOf[SettingAlreadyExistException])
  def create(setting: Setting) = {
    setting.name = setting.name.trim
    val s = findByName(setting.name)
    if(s != null && !s.isEmpty)
      throw new SettingAlreadyExistException(s"""Setting "${setting.name}" already exists!""")
    
    settingRepository.save(setting)
  }

  def update(setting: Setting) = {
    var s = settingRepository.findOne(setting.id);
    s.user = userService.findMe
    s.value = setting.value
    settingRepository.save(s)
  }

  def delete(id: Long) = {
    val s = settingRepository.findOne(id)
    settingRepository.delete(id)
    s
  }

  // @Deprecated
  // use findSettingsByName
  def findMailSettings : Option[MailSetting] = {
    val setting = settingRepository.findByNameIgnoreCase("mail")
    if(!setting.isEmpty) {
      val mapper = new ObjectMapper
      val m = mapper.readValue(setting(0).value, classOf[MailSetting]);
      return Some(m)
    }
    return None
  }

  // @Deprecated
  // use findSettingsByName
  def findSlackSettings: Option[Slack] = {
    val setting = settingRepository.findByNameIgnoreCase("slack")
    if(!setting.isEmpty) {
      val mapper = new ObjectMapper
      val m = mapper.readValue(setting(0).value, classOf[Slack]);
      return Some(m)
    }
    return None
  }

  def findSettingsByName[T](c: T, name: String)(implicit tag: ClassTag[T]): Option[T] = {
    val setting = settingRepository.findByNameIgnoreCase(name)
    if(!setting.isEmpty) {
      val mapper = new ObjectMapper
      val m = mapper.readValue(setting(0).value, tag.runtimeClass);
      return Some(m.asInstanceOf[T])
    }
    return None
  } 



  def activeMailService: Boolean = {
    val s = settingRepository.findByNameIgnoreCase("mail")
    if(!s.isEmpty) {
      val mapper = new ObjectMapper
      val m = mapper.readValue(s(0).value, classOf[MailSetting])
      return m.active.toLowerCase == "yes"
    }else{
      return false
    }  
  }



}