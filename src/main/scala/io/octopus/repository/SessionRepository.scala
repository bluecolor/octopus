package io.octopus.repository

import scala.collection.JavaConversions._
import org.springframework.data.domain.{Pageable, Page}
import org.springframework.data.jpa.repository.{JpaRepository,JpaSpecificationExecutor}
import org.springframework.stereotype.Repository

import io.octopus.model.Session

@Repository
trait SessionRepository extends JpaRepository[Session, java.lang.Long] with JpaSpecificationExecutor[SessionRepository] {
  def findByStatusNotInAndPlanId(status: Array[String], planId: Long): java.util.List[Session]
  def countByStatusNotInAndPlanId(status: Array[String], planId: Long): Long
  def findByStatusIn(statuses: Array[String]): java.util.List[Session]
  def findByStatus(status: String): java.util.List[Session]
  def deleteByPlanId(id: Long)
}