package io.octopus.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
case class InvalidCronExpressionException(exp: String) extends 
  RuntimeException(s""""${exp}" is not a valid cron expression""") {
}