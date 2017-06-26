package io.octopus.repository

import org.springframework.data.domain.{Pageable, Page}
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

import io.octopus.model.Plan

@Repository
trait PlanRepository extends JpaRepository[Plan, java.lang.Long] {
  def findByNameContainingIgnoreCase(q: String): java.util.List[Plan]
  def findByNameIgnoreCase(name: String): Plan
  def findByActiveTrue: java.util.List[Plan]
}