package io.octopus.model

import scala.beans.BeanProperty


class Notifications{

  @BeanProperty
  var taskError: String = _

  @BeanProperty
  var taskBlocked: String = _

  @BeanProperty
  var taskDone: String = _
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

}