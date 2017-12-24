package io.octopus.model

import scala.beans.BeanProperty


class Notifications{

  @BeanProperty
  var taskError: String = _

  @BeanProperty
  var taskBlocked: String = _

  @BeanProperty
  var taskDone: String = _

  @BeanProperty
  var taskKilled: String = _

  def notifyTaskError = taskError == "yes"
  def notifyTaskBlocked = taskBlocked == "yes"
  def notifyTaskKilled = taskKilled == "yes"
  def notifyTaskDone = taskDone == "yes"




}

class Slack {

  @BeanProperty
  var active: String = _

  @BeanProperty
  var notifications: Notifications = _
  
  @BeanProperty
  var channel: String = _
  
  @BeanProperty
  var url: String = _

   def isActive = active == "yes"

}