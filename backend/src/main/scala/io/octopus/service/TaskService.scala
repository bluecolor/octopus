package io.octopus.service

import java.util.Optional
import org.springframework.data.domain.Sort.Direction
import org.springframework.data.domain.Sort.Order
import org.springframework.data.domain.{Sort, Page,Pageable,PageRequest}
import org.springframework.beans.factory.annotation.Autowired
import scala.annotation.meta.setter
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.security.core.context.SecurityContextHolder
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._

import org.springframework.data.jpa.domain.Specification
import com.fasterxml.jackson.databind.ObjectMapper

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles

import io.octopus.repository.TaskRepository
import io.octopus.model.Task
import io.octopus.model.User
import io.octopus.model.Scheduler
import io.octopus.query._


@Service
@Transactional
class TaskService @Autowired()(val taskRepository: TaskRepository) {

  @(Autowired @setter)
  private var userService: UserService = _

  @(Autowired @setter)
  private var planService: PlanService = _

  @(Autowired @setter)
  private var groupService: GroupService = _

  @(Autowired @setter)
  private var sessionService: SessionService = _

  @(Autowired @setter)
  private var taskQuery: TaskQuery = _

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)


  def findAll = taskRepository.findAll

  def findAll(plan: Long, search:String, sortBy:String, order:String, page: Int, pageSize: Int) = {    
    val me = userService.findMe
    val p = taskQuery.findAll(page,pageSize,search,sortBy,order)
    p.content = p.content.map(t=>{
      t.bookmarked = t.bookmarkers.map(_.id).contains(me.id)
      t
    }).filter{t =>
      if ( plan == null || (plan != null && t.plan != null && t.plan.id == plan) ) {
        true
      } else {
        false
      }
    }
    p
  }

  def findOne(id: Long): Task = taskRepository.findOne(id)

  def findByPlan(id: Long) =  taskRepository.findByPlanId(id)
  
  def findByPrimaryGroup(id: Long) = taskRepository.findByPrimaryGroupId(id)

  def findByPrimaryOwner(id: Long) = taskRepository.findByPrimaryOwnerId(id)

  def findByIdIn(tasks: java.util.List[java.lang.Long]) = 
    taskRepository.findByIdIn(tasks)

  def findBookmarked = {
    val username: String = SecurityContextHolder
    .getContext
    .getAuthentication
    .getPrincipal.asInstanceOf[org.springframework.security.core.userdetails.User].getUsername
    
    var user:User = userService.findByUsername(username);
    
    taskRepository.findByBookmarkersContaining(user).asScala.map(t=>{
      t.bookmarked = true
      t
    }).asJava
  }

  def search(q: String) =
    taskRepository.findByNameContainingIgnoreCase(q) 

  def myTasks = {
    val username: String = SecurityContextHolder
    .getContext()
    .getAuthentication()
    .getPrincipal().asInstanceOf[org.springframework.security.core.userdetails.User].getUsername()
    
    var user:User = userService.findByUsername(username);
    taskRepository.findByPrimaryOwnerId(user.id)
  }

  def create(task: Task): Task = {
    taskRepository.save(task)
  }

  def update(task: Task): Task = {
    var t = findOne(task.id);
    task.stats = t.stats
    taskRepository.save(task);
  }

  def delete(id: Long): Task = {
    val task = taskRepository.findOne(id);
    taskRepository.delete(id);
    task;
  }

  def bookmark(id: Long): Task = {
    val username: String = SecurityContextHolder
    .getContext()
    .getAuthentication()
    .getPrincipal().asInstanceOf[org.springframework.security.core.userdetails.User].getUsername()
    
    var task = taskRepository.findOne(id)
    var user:User = userService.findByUsername(username);
    
    if(!user.bookmarks.contains(task)){
      user.bookmarks.add(task)
      userService.update(user)
    }

    task
  }

  def unBookmark(id: Long): Task = {
    val username: String = SecurityContextHolder
    .getContext()
    .getAuthentication()
    .getPrincipal().asInstanceOf[org.springframework.security.core.userdetails.User].getUsername()
    
    var task = taskRepository.findOne(id)
    var user:User = userService.findByUsername(username);
    
    if(user.bookmarks.contains(task)){
      user.bookmarks.remove(task)
      userService.update(user)
    }

    task
  }

  def disable(id: Long): Task = {
    var task = taskRepository.findOne(id)
    task.active = false
    taskRepository.save(task)
  }

  def enable(id: Long): Task = {
    var task = taskRepository.findOne(id)
    task.active = true
    taskRepository.save(task)
  }

  def enable(ids: java.util.List[java.lang.Long]) = {
    var tasks = taskRepository.findByIdIn(ids).map(t => {
      t.active = true
      t
    }).asJava
    taskRepository.save(tasks)
  }

  def disable(ids: java.util.List[java.lang.Long]) = {
    var tasks = taskRepository.findByIdIn(ids).map(t => {
      t.active = false
      t
    }).asJava
    taskRepository.save(tasks)
  }

  def export(ids: java.util.List[java.lang.Long]) = {
    val mapper = new ObjectMapper
    var scheduler = new Scheduler
    scheduler.tasks = taskRepository.findByIdIn(ids) 
    mapper.writeValueAsString(scheduler)
  }

  def run(ids: java.util.List[java.lang.Long]) = {
    var tasks = taskRepository.findByIdIn(ids)
    val session = sessionService.run(tasks)
    session
  }

}