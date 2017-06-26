package io.octopus.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Page

import io.octopus.model.Group

@Repository
trait GroupRepository extends JpaRepository[Group, java.lang.Long] {
  def findAllByOrderByNameAsc(pageable: Pageable) : Page[Group]
  def findByNameIgnoreCase(name: String): Group
  def findByNameContainingIgnoreCase(q: String): java.util.List[Group]
}