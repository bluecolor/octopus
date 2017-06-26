package io.octopus.model

import scala.beans.BeanProperty
import scala.collection.JavaConverters._

class Scheduler {
  
  @BeanProperty
  var connections: java.util.List[Connection] = _

  @BeanProperty
  var tasks: java.util.List[Task] = _
  
  @BeanProperty
  var plans: java.util.List[Plan] = _

  @BeanProperty
  var groups: java.util.List[Group] = _

  @BeanProperty
  var parameters: java.util.List[Parameter] = _
  
}