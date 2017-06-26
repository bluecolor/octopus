package io.octopus.repository

import scala.collection.JavaConverters._

import org.springframework.data.domain.{Pageable, Page}
import org.springframework.data.jpa.repository.{JpaRepository,JpaSpecificationExecutor}
import org.springframework.stereotype.Repository

import io.octopus.model.Task
import io.octopus.model.User


@Repository
trait TaskRepository extends JpaRepository[Task, java.lang.Long] with JpaSpecificationExecutor[Task] {
  def findByIdIn(tasks: java.util.List[java.lang.Long]): List[Task]
  def findByPlanId(id: Long): java.util.List[Task]
  def findByNameContainingIgnoreCase(q: String): List[Task]
  def findByPrimaryOwnerId(id: java.lang.Long): java.util.List[Task]
  def findByBookmarkersContaining(user: User): java.util.List[Task]
}