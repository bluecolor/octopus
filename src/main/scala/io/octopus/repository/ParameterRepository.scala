package io.octopus.repository

import org.springframework.data.domain.{Pageable, Page}
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import scala.collection.JavaConversions._

import io.octopus.model.Parameter

@Repository
trait ParameterRepository extends JpaRepository[Parameter, java.lang.Long] {
  def findByIdIn(tasks:java.util.List[java.lang.Long]): java.util.List[Parameter]
  def findByNameIgnoreCase(name: String): Parameter
}