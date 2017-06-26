package io.octopus.model

import scala.beans.BeanProperty

class Page[A] {

  @BeanProperty
  var content: java.util.List[A]  = _

  @BeanProperty
  var page: Int = _

  @BeanProperty
  var pageSize: Int = _
  
  @BeanProperty
  var first: Boolean = _

  @BeanProperty
  var last: Boolean = _

  @BeanProperty
  var count: Int = _

  @BeanProperty
  var totalPages: Int = _

} 
  