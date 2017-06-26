package io.octopus.repository

import org.springframework.data.domain.{Pageable, Page}
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

import io.octopus.model.Technology

@Repository
trait TechnologyRepository extends JpaRepository[Technology, java.lang.Long] {
}