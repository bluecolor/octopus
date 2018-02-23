package io.octopus.model

import scala.beans.BeanProperty


class Notifications{

  @BeanProperty
  var taskError: Int = _

  @BeanProperty
  var taskBlocked: Int = _

  @BeanProperty
  var taskDone: Int = _

  @BeanProperty
  var taskKilled: Int = _

  def notifyTaskError = taskError == 1
  def notifyTaskBlocked = taskBlocked == 1
  def notifyTaskKilled = taskKilled == 1
  def notifyTaskDone = taskDone == 1
}

class Slack {

  @BeanProperty
  var active: Int = _

  @BeanProperty
  var notifications: Notifications = _
  
  @BeanProperty
  var channel: String = _
  
  @BeanProperty
  var url: String = _

   def isActive = active == 1

}