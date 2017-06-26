package io.octopus.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
case class UserNotFoundException(u: String) extends 
  RuntimeException(s"""User with "${u}" username or email not found""") {
}