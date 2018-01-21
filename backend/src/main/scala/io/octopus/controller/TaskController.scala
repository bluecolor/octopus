package io.octopus.controller 

import java.util.{Date, Optional}
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation._

import io.octopus.model.Task
import io.octopus.service.TaskService
import io.octopus.exception.UniqueConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException


@RestController
@RequestMapping(Array("/api/v1/tasks"))
class TaskController  @Autowired()(private val taskService: TaskService) {

  @RequestMapping(method = Array(RequestMethod.GET) )
  def findAll(
    @RequestParam(value="plan",required=false) plan: Long,
    @RequestParam(value="search",required=false) search: Optional[String],
    @RequestParam(value="sortBy",required=false) sortBy: Optional[String],
    @RequestParam(value="order", required=false) order : Optional[String],
    @RequestParam("page") page: Optional[Int], 
    @RequestParam("pageSize") pageSize: Optional[Int]
  ) = {
    taskService.findAll(
      plan,
      search.orElse(""),
      sortBy.orElse("name"),
      order.orElse("asc"),
      page.orElse(0), 
      pageSize.orElse(15)
    )
  }

  @RequestMapping(value = Array("/plan/{id}"), method = Array(RequestMethod.GET))
  def findByPlan(@PathVariable("id") id: Long) = taskService.findByPlan(id)

  @RequestMapping(value = Array("/primary-group/{id}"), method = Array(RequestMethod.GET))
  def findByPrimaryGroup(@PathVariable("id") id: Long) = taskService.findByPrimaryGroup(id)

  @RequestMapping(value = Array("/primary-owner/{id}"), method = Array(RequestMethod.GET))
  def findByPrimaryOwner(@PathVariable("id") id: Long) = taskService.findByPrimaryOwner(id)

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.GET))
  def findOne(@PathVariable("id") id: Long) = taskService.findOne(id)

  @RequestMapping(value = Array("/search"), method = Array(RequestMethod.GET))
  def search(@RequestParam("q") q: String) = taskService.search(q)

  @RequestMapping(value = Array("/my-tasks"), method = Array(RequestMethod.GET))
  def myTasks = taskService.myTasks

  @RequestMapping(value = Array("/bookmarked"), method = Array(RequestMethod.GET))
  def findBookmarked = taskService.findBookmarked

  @RequestMapping(method = Array(RequestMethod.POST))
  def create(@RequestBody task: Task) = {
    var t:Task = null; 
    try{
      t = taskService.create(task)
    }catch{
      case integrityViolation:DataIntegrityViolationException => 
        throw new UniqueConstraintViolationException("Task name already exists!")  
    }
    t
  }

  @RequestMapping(value = Array("/run/{ids}"), method = Array(RequestMethod.GET))
  def run(@PathVariable("ids") ids: java.util.List[java.lang.Long]) =
    taskService.run(ids)

  @RequestMapping(value=Array("/export/{tasks}"), method=Array(RequestMethod.GET))
  def export(@PathVariable("tasks") tasks: java.util.List[java.lang.Long], response: HttpServletResponse): Unit = {
    val now = new Date
    val df = new SimpleDateFormat("yyyyMMddHHmmss")
    val date = df.format(now)
    
    response.setContentType("application/octet-stream; charset=utf-8")
    response.setHeader("Content-Disposition", s"attachment; filename='sch.tasks.$date.json'")
    response.getWriter().print(taskService.export(tasks))
  }

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.PUT))
  def update(@PathVariable("id") id: Long, @RequestBody task: Task) = {
    taskService.update(task)
  }

  @RequestMapping(value = Array("/{id}"), method = Array(RequestMethod.DELETE))
  def delete(@PathVariable("id") id: Long) =
    taskService.delete(id)

  @RequestMapping(value = Array("/bookmark/{id}"), method = Array(RequestMethod.PUT))
  def bookmark(@PathVariable("id") id: Long) =
    taskService.bookmark(id)

  @RequestMapping(value = Array("/un-bookmark/{id}"), method = Array(RequestMethod.PUT))
  def unBookmark(@PathVariable("id") id: Long) = 
    taskService.unBookmark(id)

  @RequestMapping(value = Array("/disable/{id}"), method = Array(RequestMethod.PUT))
  def disable(@PathVariable("id") id: Long) = {
    taskService.disable(id)
  }

  @RequestMapping(value = Array("/enable/{id}"), method = Array(RequestMethod.PUT))
  def enable(@PathVariable("id") id: Long) = 
    taskService.enable(id)

  @RequestMapping(value = Array("/enable"), method = Array(RequestMethod.PUT))
  def enable(@RequestBody tasks: java.util.List[java.lang.Long]) = 
    taskService.enable(tasks)

  @RequestMapping(value = Array("/disable"), method = Array(RequestMethod.PUT))
  def disable(@RequestBody tasks: java.util.List[java.lang.Long]) = 
    taskService.disable(tasks)

}