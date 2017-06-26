package io.octopus.model

object Status {
  val IDLE    = "IDLE" 
  val RUNNING = "RUNNING" 
  val SUCCESS = "SUCCESS"
  val ERROR   = "ERROR"
  val KILLED  = "KILLED"
  val PAUSED  = "PAUSED"
  val BLOCKED = "BLOCKED"  
  val DONE    = "DONE"

  val valid = Map( 
    IDLE -> List(IDLE,RUNNING,DONE,BLOCKED),
    RUNNING -> List(ERROR, KILLED,SUCCESS),
    SUCCESS -> List(IDLE,RUNNING),
    ERROR -> List(IDLE,RUNNING,DONE),
    KILLED -> List(KILLED,IDLE,RUNNING),
    PAUSED -> List(PAUSED,IDLE,RUNNING),
    BLOCKED -> List(BLOCKED,IDLE),
    DONE -> List(DONE,IDLE,ERROR,BLOCKED,KILLED)
  )  

  def isValid(from: String, to: String): Boolean = valid.get(from).get.contains(to)

}
