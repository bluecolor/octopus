package io.octopus.model

import scala.beans.BeanProperty


class Notifications{

  @BeanProperty
  var taskError: String = _

  @BeanProperty
  var taskBlocked: String = _

  @BeanProperty
  var taskDone: String = _

  def taskErrorEnabled = taskError == "yes"
  def taskblockedEnabled = taskBlocked == "yes"
  def taskErrorDone = taskDone == "yes"

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