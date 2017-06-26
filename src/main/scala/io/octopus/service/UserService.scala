package io.octopus.service

import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.core.context.SecurityContextHolder


import io.octopus.AppInit
import io.octopus.repository.UserRepository
import io.octopus.model.User
import io.octopus.exception._
import io.octopus.actor.message.{SendUserPasswordMail,SendNewPasswordMail}
import org.apache.commons.lang3.RandomStringUtils

@Service
@Transactional
class UserService @Autowired()(val userRepository: UserRepository) extends UserDetailsService {

  @(Autowired @setter)
  private var appInit: AppInit = _
  
	override def loadUserByUsername(username: String): UserDetails = {
		
    val user = userRepository.findByUsername(username);
    val auth = AuthorityUtils.createAuthorityList( user.getRole().toString() )
    
		new org.springframework.security.core.userdetails.User(
      user.username, 
      user.password,
			auth)
	}

  def findAll = userRepository.findAll

  def findOne(id: Long) = userRepository.findOne(id)

  def findMe  = {
    val username: String = SecurityContextHolder
    .getContext()
    .getAuthentication()
    .getPrincipal().asInstanceOf[org.springframework.security.core.userdetails.User].getUsername()
    
    userRepository.findByUsername(username)
  } 

  def findByNameContainingIgnoreCase(name:String) =
    userRepository.findByNameContainingIgnoreCase(name)


  def count = userRepository.count

  def findByUsername(username: String) = userRepository.findByUsername(username)
  

  def create(user: User) = {
    val password = RandomStringUtils.random(8,true,true)
    user.password = new BCryptPasswordEncoder().encode(password)
    val u = userRepository.save(user)
    sendMail(SendUserPasswordMail(u, password))
    u
  }

  def sendMail(message: AnyRef) = {
    appInit.system.actorSelection("/user/mail") ! message
  }


  def update(user: User) = {
    var u = userRepository.findOne(user.id)
    u.name = user.name
    u.username = user.username
    u.role = user.role
    u.locked = user.locked
    u.email = user.email
    u.bookmarks = user.bookmarks
    userRepository.save(u)
  }

  @throws(classOf[UsernameAlreadyExistException])
  def updateProfile(user: User) = {
    var u = userRepository.findByUsernameIgnoreCase(user.username)
    var me = findMe
    if(u.id != me.id && u.username.toLowerCase == me.username.toLowerCase){
      throw UsernameAlreadyExistException(user.username)
    }
    me.name = user.name
    me.username = user.username
    me.email = user.email
    userRepository.save(me)
  }

  @throws(classOf[RuntimeException])
  def changePassword(oldp: String, newp: String) = {
    var me = findMe
    if(newp == null || newp.isEmpty){
      throw new RuntimeException("Password can not be empty!")
    }

    val o = new BCryptPasswordEncoder().encode(oldp)

    if(o != oldp){
      throw new RuntimeException("Wrong old password!")
    }
    me.username = new BCryptPasswordEncoder().encode(newp)
    userRepository.save(me)
  }



  def delete(id: Long): User = {
    val user = userRepository.findOne(id);
    if(user.system){
      throw(new SystemUserNotAllowedException("Can not delete system user."))
    }else{
      userRepository.delete(id);
      user;
    }
  }

  def search(exp: String) = {
    userRepository.search(exp)
  }

  def forgotPassword(str: String) = {
    var user: User = userRepository.findByUsernameIgnoreCase(str.trim)
    if(user == null){
      val users = userRepository.findByEmailIgnoreCase(str.trim)
      if(users != null && users.length > 0){
        user = users(0)
      }
    }
    if(user == null) {
      throw new UserNotFoundException(str)
    }
    val password = RandomStringUtils.random(8,true,true)
    user.password = new BCryptPasswordEncoder().encode(password)
    val u = userRepository.save(user)
    sendMail(SendNewPasswordMail(u, password))
    u
  }

}