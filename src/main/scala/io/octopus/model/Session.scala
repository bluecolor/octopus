package io.octopus.model

import scala.collection.JavaConversions._
import java.util.Objects
import java.util.Date
import java.text.SimpleDateFormat
import javax.persistence._
import com.fasterxml.jackson.annotation._
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import javax.validation.constraints.{NotNull}

import scala.beans.BeanProperty


case class SessionStats(
  @BeanProperty total: Int, 
  @BeanProperty success: Int,
  @BeanProperty done: Int, 
  @BeanProperty error: Int
)



@Entity(name="session")
class Session {

  def this(id: Long) {
    this()
    this.id = id
  }

  @BeanProperty
  @Id
  @GeneratedValue
  var id: Long = _

  @BeanProperty
  var status: String = Status.IDLE

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToOne(optional = true, fetch = FetchType.EAGER)
  var plan: Plan = _
  
  @BeanProperty
  var parallel: Int = _

  @BeanProperty
  var priority: Int = _

  @BeanProperty
  @Fetch(value= FetchMode.SELECT)
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "session", cascade=Array(CascadeType.REMOVE))  
  @JsonIgnore
  var taskInstances: java.util.List[TaskInstance] = _

  @BeanProperty
  var startDate: Date = _

  @BeanProperty
  var endDate: Date = _

  @BeanProperty
  var scheduleDate: Date = new Date

  @PrePersist
  @BeanProperty
  def prePersist = {
    if(plan!=null){
      parallel = plan.parallel
      priority = plan.priority
    } 
  }

  @BeanProperty
  var name: String = _

  @JsonProperty("duration")
  @JsonSerialize
  @BeanProperty
  def duration: Long = {
    if(status == Status.SUCCESS){
      if(startDate != null && endDate != null)
        return (endDate.getTime-startDate.getTime)/1000
    }
    0
  }

  @JsonProperty("stats")
  @JsonSerialize
  @BeanProperty
  def stats:SessionStats = {

    if(taskInstances == null){
      return SessionStats(0,0,0,0)
    }

    val total:Int = taskInstances.size 
    val success:Int = taskInstances.filter(Array("SUCCESS") contains _.status).size
    val error:Int = taskInstances.filter(Array("ERROR", "KILLED") contains _.status).size
    val done:Int = taskInstances.filter(Array("DONE") contains _.status).size

    return SessionStats(total, success, done, error)
  }

}