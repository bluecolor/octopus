package io.octopus.model

object Status {
  val IDLE    = "IDLE"
  val RUNNING = "RUNNING"
  val SUCCESS = "SUCCESS"
  val ERROR   = "ERROR"
  val KILLED  = "KILLED"
  val PAUSED  = "PAUSED"
  val BLOCKED = "BLOCKED"
  val STOPPED = "STOPPED"
  val DONE    = "DONE"

  val valid = Map(
    IDLE -> List(IDLE,RUNNING,DONE,BLOCKED),
    RUNNING -> List(ERROR, KILLED,SUCCESS),
    SUCCESS -> List(IDLE,RUNNING),
    ERROR -> List(IDLE,RUNNING,DONE),
    KILLED -> List(KILLED,IDLE,RUNNING,DONE),
    PAUSED -> List(PAUSED,IDLE,RUNNING),
    STOPPED-> List(STOPPED,IDLE,RUNNING),
    BLOCKED -> List(BLOCKED,IDLE, DONE),
    DONE -> List(DONE,IDLE,ERROR,BLOCKED,KILLED)
  )

  def isValid(from: String, to: String): Boolean = valid.get(from).get.contains(to)

}
