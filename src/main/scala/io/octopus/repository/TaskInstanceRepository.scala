package io.octopus.repository

import org.springframework.data.jpa.domain.Specification
import org.springframework.data.domain.{Pageable, Page}
import org.springframework.data.jpa.repository.{JpaRepository,JpaSpecificationExecutor}
import org.springframework.stereotype.Repository

import io.octopus.model.TaskInstance
import io.octopus.model.Task

@Repository
trait TaskInstanceRepository extends JpaRepository[TaskInstance, java.lang.Long] with JpaSpecificationExecutor[TaskInstance] {
  def findByIdIn(tasks:java.util.List[java.lang.Long]): java.util.List[TaskInstance]
  def findBySessionId(id: Long, pageable: Pageable): Page[TaskInstance] 
  def findBySessionIdAndStatusIn(id: Long, statuses: Array[String]): java.util.List[TaskInstance] 
  def findByTaskIdIn(tasks:java.util.Set[Long]): java.util.List[TaskInstance]
  def findByStatus(status: String): java.util.List[TaskInstance]
  def countByStatus(status: String): Long
}