package io.octopus.model

import java.util.Date
import java.util.Objects
import javax.persistence._
import com.fasterxml.jackson.annotation._
import org.hibernate.annotations.{Fetch,FetchMode, Formula}
import javax.validation.constraints.{NotNull}
import scala.beans.BeanProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize


import Priority._

@Entity(name="task_instance")
class TaskInstance {

  def this(id: Long) {
    this()
    this.id = id
  }

  @BeanProperty
  @Id
  @GeneratedValue
  var id: Long = _

  @JsonProperty("name")
  @JsonSerialize
  @BeanProperty
  def name: String = task.name

  @Transient
  @BeanProperty
  var bookmarked: Boolean = false

  @BeanProperty
  var status: String = Status.IDLE

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  var task: Task = _

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  var session: Session = _
  
  @BeanProperty
  @Fetch(value= FetchMode.SELECT)
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  var technology: Technology = _

  @BeanProperty
  var script: String = _

  @BeanProperty
  var priority: Int = Priority.MEDIUM.id

  @BeanProperty
  @Column(nullable=true)
  var disabled: Boolean = false

  @BeanProperty
  var retry: Int = 1

  @BeanProperty
  var startDate: Date = _

  @BeanProperty
  var endDate: Date = _

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @OneToMany(fetch = FetchType.EAGER, mappedBy = "taskInstance", cascade=Array(CascadeType.REMOVE))  
  var logs: java.util.Set[TaskInstanceLog] = new java.util.HashSet[TaskInstanceLog]


  @JsonProperty("duration")
  @JsonSerialize
  @BeanProperty
  def duration: Long = {
    if(status == Status.SUCCESS){
      if(startDate != null && endDate != null)
        return (endDate.getTime-startDate.getTime)/1000
    }
    if(status == Status.RUNNING){
      if(startDate != null)
        return ((new Date).getTime-startDate.getTime)/1000
    }
    0
  }


  def getConnection: Connection = {
    if(task.connection != null) 
      return task.connection
    if(task.plan!= null && task.plan.connection != null) 
      return task.plan.connection
    if(session.plan != null && session.plan.connection != null)
      return session.plan.connection
    null
  }

  @JsonProperty("dependencies")
  @JsonSerialize
  @Transient
  @BeanProperty
  var dependencies: List[TaskInstance] = _

  @PrePersist
  @BeanProperty
  def prePersist = {
    technology = task.technology
    priority = task.priority
    script = task.script
  }

}