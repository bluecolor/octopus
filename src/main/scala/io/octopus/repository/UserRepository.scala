package io.octopus.repository


import org.springframework.data.jpa.repository._
import org.springframework.stereotype.Repository
import org.springframework.data.repository.query.Param

import io.octopus.model.User

@Repository
trait UserRepository extends JpaRepository[User, java.lang.Long] {
  def findByUsername(username: String) : User
  def findByUsernameIgnoreCase(username: String): User
  def findByEmailIgnoreCase(email: String): List[User]
  def findByNameContainingIgnoreCase(str: String): List[User]
  @Query("select u from users u where lower(u.name) like concat('%',lower(:exp),'%') or lower(u.username) like concat('%',lower(:exp),'%')")
  def search(@Param("exp") exp: String): java.util.List[User]
}