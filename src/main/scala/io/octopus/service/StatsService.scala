package io.octopus.service

import scala.annotation.meta.setter
import java.util.Date
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import io.octopus.repository.TaskStatsRepository
import io.octopus.model._
import scala.language.postfixOps

@Service
@Transactional
class StatsService @Autowired()(
  val taskStatsRepository: TaskStatsRepository
){

  @(Autowired @setter)
  private var taskService: TaskService = _

  def findTasksStats = taskStatsRepository.findAll

  def findTaskStats(id: Long) = taskStatsRepository.findByTaskId(id)

  def incTaskStatus(status: String, id: Long): TaskStats = {
    val task = taskService.findOne(id)
    incTaskStatus(task, status)
  }

  def incTaskStatus(task: Task, status: String): TaskStats = {
    var stats: TaskStats = new TaskStats    
    
    if(!Array(Status.SUCCESS,Status.DONE, Status.KILLED,Status.ERROR).contains(status.toUpperCase))
      return stats
    
    implicit def reflector(ref: AnyRef) = new {
      def getv(name: String): Any = ref.getClass.getMethods.find(_.getName == name).get.invoke(ref)
      def setv(name: String, value: Any): Unit = ref.getClass.getMethods.find(_.getName == name + "_$eq").get.invoke(ref, value.asInstanceOf[AnyRef])
    }
    var s = findTaskStats(task.id)
    if(s!=null) stats = s

    var v = stats.getv(status toLowerCase).asInstanceOf[Long]
    stats.setv(status toLowerCase, v+1)
    stats
  }


}