package io.octopus.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
case class GroupExistException(name: String) extends 
  RuntimeException(s"""Group "${name}" already exist""") {
}