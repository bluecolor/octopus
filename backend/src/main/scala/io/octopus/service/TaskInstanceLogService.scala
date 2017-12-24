package io.octopus.service

import scala.annotation.meta.setter
import java.util.Date
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import io.octopus.repository.TaskStatsRepository
import io.octopus.model._
import io.octopus.repository.TaskInstanceLogRepository
import scala.language.postfixOps

@Service
@Transactional
class TaskInstanceLogService @Autowired()(val taskInstanceLogRepository: TaskInstanceLogRepository){

  def findAll = taskInstanceLogRepository.findAll
  
  def create(instance: TaskInstance, message: String = null) = {
    var model = new TaskInstanceLog(instance, message)
    taskInstanceLogRepository.save(model)
  }



}