package io.octopus.query

import scala.collection.JavaConversions._

object SearchOperation {

  val LIKE         = "~"
  val EQUAL        = ":"
  val EQUAL_ID     = ":#"
  val NOT_EQUAL    = "!:"
  val NEGATION     = "!"
  val GREATER_THAN = ">"
  val LESS_THAN    = "<" 
  val IN           = "~:"    
  val CONTAINS     = "::"

  val operator = Map(
    LIKE          -> "like",
    EQUAL         -> "=",
    NOT_EQUAL     -> "!=",
    EQUAL_ID      -> "=",
    GREATER_THAN  -> ">",
    LESS_THAN     -> "<",
    IN            -> "in",
    CONTAINS      -> "in"
  )

}
