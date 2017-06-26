package io.octopus.search


import java.util.ArrayList
import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import scala.annotation.meta.setter
import org.springframework.data.jpa.domain.{Specification,Specifications}
import org.springframework.stereotype.Component
import java.util.regex.{Pattern,Matcher}
import org.springframework.beans.factory.annotation.Autowired
import scala.annotation.meta.setter

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles


import io.octopus.model._
import io.octopus.service._

@Component
class TaskInstanceSearch {

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  @(Autowired @setter)
  private var userService: UserService = _

  @(Autowired @setter)
  private var sessionService: SessionService = _

  @(Autowired @setter)
  private var groupService: GroupService = _

  private var builder:TaskInstanceSpecificationsBuilder = _

  // private def findByOwner[A](s: A) = {
  //   var q: java.util.List[User] = s match {
  //     case s:Long => List(userService.findOne(s)).asJava 
  //     case s:String => userService.findByNameContainingIgnoreCase(s) 
  //   }
  //   builder._with("task.primaryOwner", SearchOperation.IN, q)
  // }

  // private def findByGroup[A](s: A) = {
  //   var q: java.util.List[Group] = s match {
  //     case s:Long => List(groupService.findOne(s)).asJava 
  //     case s:String => groupService.findByNameContainingIgnoreCase(s) 
  //   }
  //   builder._with("task.primaryGroup", SearchOperation.IN, q)
  // }

  // private def findByName(s: String) = {
  //   builder._with("name", SearchOperation.LIKE, s)
  // }

  // private def findBookmarkedByMe = {
  //   builder._with("task.bookmarkers", SearchOperation.CONTAINS, userService.findMe)
  // }

  private def findBySessionId(id: Long) = {
    builder._with("session", SearchOperation.EQUALITY, sessionService.findOne(id))
  }

  def search(s: String, id: Long) : Specification[TaskInstance] = {
    builder =  new TaskInstanceSpecificationsBuilder
    findBySessionId(id)
    builder.build

    // def isNumber(s: String) = s forall Character.isDigit

    // if(s == null || s.isEmpty) return builder.build

    // val searchPattern = "(\\w+?)(!|::|:|<|>|~)(\\w+?)|(^[^:<>~]+$)"
    // val pattern = Pattern.compile(searchPattern)
    // val matcher = pattern.matcher(s)

    // def go:Unit = {
    //   if(matcher.find) {
    //     var s = matcher.group(3)
    //     var q = matcher.group(1)
    //     if(q != null && s !=null && !s.isEmpty)
    //       matcher.group(1).toLowerCase match {
    //         case "group"=> findByGroup(if(isNumber(s)) s.toLong else s)
    //         case "owner"=> findByOwner(if(isNumber(s)) s.toLong else s)
    //         case "is" => 
    //           s match {
    //             case "bookmarked" => findBookmarkedByMe
    //           }
    //       }
    //     q = matcher.group(4)
    //     log.debug(q)
    //     if(q != null && !q.isEmpty) findByName(q.trim)  
    //     go
    //   }
    // }
    // go
    // builder.build
  }

}