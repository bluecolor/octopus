package io.octopus.model

object SearchResultType {
  val TASK = "Task"
  val GROUP = "Group"
  val TASK_INSTANCE = "Session task"
  val PLAN = "Plan"
  val PARAMETER = "Parameter"
  val USER = "User"
  val CONNECTION = "Connection"
  val OTHER = "Other" 
}

class SearchResponse {
  var name: String = _
  var resultType: String = SearchResultType.OTHER
  var result: AnyRef = _
}