package io.octopus.repository

import org.springframework.data.jpa.repository._
import org.springframework.stereotype.Repository
import org.springframework.data.repository.query.Param

import io.octopus.model.TaskInstanceLog

@Repository
trait TaskInstanceLogRepository extends JpaRepository[TaskInstanceLog, java.lang.Long] {
  
}