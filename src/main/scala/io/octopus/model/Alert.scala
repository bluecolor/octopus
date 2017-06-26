package io.octopus.model

import com.fasterxml.jackson.annotation._
import scala.beans.BeanProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize


object AlertType {
  val TASK_INSTANCE_ERROR = "TASK_INSTANCE_ERROR"
}


class Alert {
  @BeanProperty 
  var tp : String = _
  
  @BeanProperty 
  var msg: String = _
  
  @BeanProperty 
  var obj: AnyRef = _

  @JsonProperty("objtp")
  @JsonSerialize
  def objtp: String = {
    obj match {
      case x:TaskInstance => ObjectType.TASK_INSTANCE
      case _ => ObjectType.OTHER     
    }
  } 

}