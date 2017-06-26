package io.octopus.model

import javax.persistence._
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import javax.validation.constraints.{NotNull}
import scala.beans.BeanProperty
import com.fasterxml.jackson.annotation._
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility
import com.fasterxml.jackson.databind.annotation.JsonSerialize


import Priority._

case class GroupStats(
  @BeanProperty taskCount: Long, 
  @BeanProperty error: Long,
  @BeanProperty success: Long
)

@Entity(name="groups")
class Group {

  def this(id: Long) {
    this()
    this.id = id
  }

  @BeanProperty
  @Id
  @GeneratedValue
  var id: Long = _

  @BeanProperty
  @NotNull
  @Column(unique = true)
  var name: String = _

  @BeanProperty
  @ManyToOne(optional = true, fetch = FetchType.LAZY)
  var connection: Connection = _

  @BeanProperty
  var parallel: Int = _

  @BeanProperty
  @NotNull
  var priority: Int = Priority.MEDIUM.id

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "task_group", 
    joinColumns = Array(new JoinColumn(name = "group_id", nullable = false, updatable = false)),
    inverseJoinColumns = Array(new JoinColumn(name = "task_id",nullable = false, updatable = false)) 
  )
  @JsonIgnore
  var tasks: java.util.List[Task] = new java.util.ArrayList[Task]

  @BeanProperty
  @Fetch(value= FetchMode.SELECT)
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "primaryGroup")
  @JsonIgnore
  var primaryTasks: java.util.Set[Task] = new java.util.HashSet[Task]

  @BeanProperty
  var color: String = _

  @BeanProperty
  var description: String = _

  @JsonProperty("stats")
  @JsonSerialize
  @BeanProperty
  def stats = {
    GroupStats(tasks.size, 0, 0)
  }


}