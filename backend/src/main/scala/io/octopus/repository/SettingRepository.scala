package io.octopus.repository

import org.springframework.data.jpa.repository._
import org.springframework.stereotype.Repository
import org.springframework.data.repository.query.Param

import io.octopus.model.Setting

@Repository
trait SettingRepository extends JpaRepository[Setting, java.lang.Long] {
  def findByNameIgnoreCase(name: String) : Setting
}