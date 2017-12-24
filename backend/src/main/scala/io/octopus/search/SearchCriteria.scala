package io.octopus.search

import scala.collection.JavaConversions._

class SearchCriteria {
  var key: String = _
  var operation: String = _
  var value: AnyRef = _

  def this(key: String, operation: String, value: AnyRef) = {
    this()
    this.key = key
    this.value = value
    this.operation = operation
  }

}
