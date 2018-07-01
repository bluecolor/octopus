package io.octopus.model


import scala.beans.BeanProperty


case class PlanStats(
  @BeanProperty taskCount: Long,
  @BeanProperty groupCount: Long,
  @BeanProperty avgDuration: Long = 0,
  @BeanProperty maxDuration: Long = 0, 
  @BeanProperty minDuration: Long = 0
)