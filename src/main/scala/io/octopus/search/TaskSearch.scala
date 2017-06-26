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
class TaskSearch {

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  @(Autowired @setter)
  private var userService: UserService = _

  @(Autowired @setter)
  private var planService: PlanService = _

  @(Autowired @setter)
  private var groupService: GroupService = _

  private var builder:TaskSpecificationsBuilder = _

  private def findByPlan[A](s: A) = {
    var q: java.util.List[Plan] = s match {
      case s:Long => List(planService.findOne(s)).asJava 
      case s:String => planService.findByNameContainingIgnoreCase(s) 
    }
    builder._with("plan", SearchOperation.IN, q)
  }

  private def findByOwner[A](s: A) = {
    var q: java.util.List[User] = s match {
      case s:Long => List(userService.findOne(s)).asJava 
      case s:String => userService.findByNameContainingIgnoreCase(s) 
    }
    builder._with("primaryOwner", SearchOperation.IN, q)
  }

  private def findByGroup[A](s: A) = {
    var q: java.util.List[Group] = s match {
      case s:Long => List(groupService.findOne(s)).asJava 
      case s:String => groupService.findByNameContainingIgnoreCase(s) 
    }
    builder._with("primaryGroup", SearchOperation.IN, q)
  }

  private def findByName(s: String) = {
    builder._with("name", SearchOperation.LIKE, s)
  }

  private def findBookmarkedByMe = {
    builder._with("bookmarkers", SearchOperation.CONTAINS, userService.findMe)
  }

  def search(s: String) : Specification[Task] = {
    
    this.builder =  new TaskSpecificationsBuilder
    
    def isNumber(s: String) = s forall Character.isDigit

    if(s == null || s.isEmpty) return null
    val searchPattern = "(\\w+?)(!|::|:|<|>|~)(\\w+?)|(^[^:<>~]+$)"
    val pattern = Pattern.compile(searchPattern)
    val matcher = pattern.matcher(s)

    log.debug(s)

    def go:Unit = {
      if(matcher.find) {
        var s = matcher.group(3)
        var q = matcher.group(1)
        if(q != null && s !=null && !s.isEmpty)
          matcher.group(1).toLowerCase match {
            case "plan" => findByPlan(if(isNumber(s)) s.toLong else s)
            case "group"=> findByGroup(if(isNumber(s)) s.toLong else s)
            case "owner"=> findByOwner(if(isNumber(s)) s.toLong else s)
            case "is" => 
              s match {
                case "bookmarked" => findBookmarkedByMe
              }
          }
        q = matcher.group(4)
        if(q != null && !q.isEmpty) findByName(q.trim)  
        go
      }
    }
    go
    builder.build
  }

}