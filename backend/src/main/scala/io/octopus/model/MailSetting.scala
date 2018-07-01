package io.octopus.model

import scala.beans.BeanProperty

class MailSetting {

  @BeanProperty
  var active: Int = _

  @BeanProperty
  var host: String = _

  @BeanProperty
  var port: Int = _

  @BeanProperty
  var username: String = _

  @BeanProperty
  var password: String = _

  @BeanProperty
  var sendFrom: String = _

  @BeanProperty
  var sendTo: String = "o"

  @BeanProperty
  var connectionSecurity: String = "ssl"

  def isActive = active == 1

}