package io.octopus.repository

import org.springframework.data.domain.{Pageable, Page}
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

import io.octopus.model._

@Repository
trait TaskStatsRepository extends JpaRepository[TaskStats, java.lang.Long] {
  def findByTask(task: Task): TaskStats
  def findByTaskId(id: Long): TaskStats
  
}