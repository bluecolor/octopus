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

  val SQL_EQUAL:String    = "="
  val SQL_LIKE:String     = "like"
  val SQL_IN:String       = "IN"
  val SQL_NOT_IN:String   = "NOT IN"
  val SQL_NOT_EQUAL:String= "NOT_EQUAL"
  val SQL_GREATER_THAN    = ">"
  val SQL_LESS_THAN       = "<" 

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
