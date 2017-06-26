package io.octopus.search

import scala.collection.JavaConversions._

object SearchOperation {

  val EQUALITY     = ":"
  val EQUALITY_ID  = ":#"
  val NEGATION     = "!"
  val GREATER_THAN = ">"
  val LESS_THAN    = "<"
  val LIKE         = "~"
  val IN           = ":~"
  val NOT_IN       = ""    
  val CONTAINS     = "::"

  val SIMPLE_OPERATION_SET: Array[String] = Array(
    EQUALITY,
    NEGATION,
    GREATER_THAN,
    LESS_THAN,
    LIKE,
    IN,
    NOT_IN,
    CONTAINS
  )


  val LOW_PRECEDENCE_INDICATOR: String = "'"

  val ZERO_OR_MORE_REGEX: String = "*"
}
