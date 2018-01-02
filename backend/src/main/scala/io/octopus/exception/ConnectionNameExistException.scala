package io.octopus.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
case class ConnectionNameExistException(name: String) extends 
  RuntimeException(s"""Connection name "${name}" already exist""") {
}