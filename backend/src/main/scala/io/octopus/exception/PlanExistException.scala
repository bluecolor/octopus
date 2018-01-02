package io.octopus.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
case class PlanExistException(name: String) extends 
  RuntimeException(s"""Plan "${name}" already exist""") {
}