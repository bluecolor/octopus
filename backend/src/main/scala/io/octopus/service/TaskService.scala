package io.octopus.service

import java.util.Optional
import org.springframework.data.domain.Sort.Direction
import org.springframework.data.domain.Sort.Order
import org.springframework.data.domain.{Sort, Page,Pageable, PageRequest}
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

import org.jgrapht.{Graph}
import org.jgrapht.graph.{DefaultEdge, DefaultDirectedGraph}
import org.jgrapht.alg.CycleDetector

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

  def findAll(plan: java.lang.Long, bookmark: Boolean, search: String, sortBy: String, order: String, page: Int, pageSize: Int) = {
    val me = userService.findMe
    val p = taskQuery.findAll(page, pageSize, bookmark, plan, -1, -1, search, sortBy, order)
    p.content = p.content.map(t=>{
      t.bookmarked = t.bookmarkers.map(_.id).contains(me.id)
      t
    })
    p
  }

  def findAll(
    plan: java.lang.Long  = -1,
    group: java.lang.Long = -1,
    owner: java.lang.Long = -1,
    bookmark: Boolean,
    search: String,
    sortBy: String,
    order: String,
    page: Int,
    pageSize: Int
  ) = {
    val me = userService.findMe
    val p = taskQuery.findAll(page,pageSize, bookmark, plan, group, owner, search, sortBy, order)
    p.content = p.content.map(t=>{
      t.bookmarked = t.bookmarkers.map(_.id).contains(me.id)
      t
    })
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

    var user:User = userService.findByUsername(username)

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

  def hasCycle(tasks: List[Task]) = {
    var directedGraph: Graph[Long, DefaultEdge] =
      new DefaultDirectedGraph(classOf[DefaultEdge])

    def addDependecies(task: Task) {
      if(!directedGraph.containsVertex(task.id)) {
        directedGraph.addVertex(task.id)
      }
      task.dependencies.foreach{ d =>
        addDependecies(d)
        if(!directedGraph.containsEdge(task.id, d.id)){
          directedGraph.addEdge(task.id, d.id)
        }
      }
    }
    tasks.foreach(addDependecies(_))

    val cycleDetector = new CycleDetector[Long, DefaultEdge](directedGraph)
    cycleDetector.detectCycles
  }

  def create(task: Task): Task = {
    taskRepository.save(task)
  }

  def update(id: Long, task: Task): Task = {
    var t = findOne(id)
    t.name = task.name
    t.retry = task.retry
    t.priority = task.priority
    t.connection = task.connection
    t.plan = task.plan
    t.active = task.active
    t.description = task.description
    t.script = task.script
    t.technology = task.technology
    t.dependencies = task.dependencies
    t.owners = task.owners
    t.primaryOwner = task.primaryOwner
    t.groups = task.groups
    t.primaryGroup = task.primaryGroup

    var tasks = findAll.filter(_.id != id)
    tasks += t
    if(hasCycle(tasks.toList)) {
      throw new RuntimeException("Update creates cycle.")
    }

    taskRepository.save(t)
  }

  def delete(id: Long): Task = {
    val task = taskRepository.findOne(id)

    taskRepository.delete(id)
    task
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