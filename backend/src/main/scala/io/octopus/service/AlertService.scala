package io.octopus.service

import scala.annotation.meta.setter
import scala.collection.JavaConversions._
import org.springframework.data.domain.{Page,Pageable,PageRequest}
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import com.fasterxml.jackson.databind.ObjectMapper

import io.octopus.model._


@Service
@Transactional
class AlertService {

  @(Autowired @setter)
  private var taskInstanceService: TaskInstanceService = _

  def findAll = {
    var alerts: List[Alert] = List()
    alerts ++= taskInstanceService.findByStatus(Status.ERROR).map{i=>
      var a = new Alert
      a.tp  = AlertType.TASK_INSTANCE_ERROR
      a.msg = s"${i.name} crashed."
      a.obj = i
      a 
    }
    
    alerts
  }

}