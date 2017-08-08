package io.octopus.service

import scala.beans.BeanProperty
import scala.collection.JavaConversions._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import io.octopus.model._

@Service
class ReportService {

  @(Autowired @setter)
  private var planService: PlanService = _

  @(Autowired @setter)
  private var taskService: TaskService = _


  def ownerTaskStats = {
    @BeanProperty case class OwnerTaskStats(owner: User, taskCount: Long)
    var map: Map[User, Long] = Map() 

    taskService.findAll.foreach { t => 
      val c: Long = map getOrElse(t.primaryOwner, 0)
      map +=  (t.primaryOwner -> (c+1))
    }
    map.keys.map(k=>OwnerTaskStats(k, map.get(k).get))
  }


}