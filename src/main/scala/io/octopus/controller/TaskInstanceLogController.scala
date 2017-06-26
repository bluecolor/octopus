package io.octopus.controller 

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation._
import org.springframework.dao.DataIntegrityViolationException

import io.octopus.model.TaskInstanceLog
import io.octopus.service.TaskInstanceLogService

@RestController
@RequestMapping(Array("/api/v1/scheduler/task-instance-logs"))
class TaskInstanceLogController  @Autowired()(private val taskInstanceLogService: TaskInstanceLogService) {

  @RequestMapping(method = Array(RequestMethod.GET))
  def findAll = taskInstanceLogService.findAll

}