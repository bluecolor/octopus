package io.octopus.model

import java.util.Date
import javax.persistence._
import org.hibernate.annotations.{Fetch,FetchMode}
import javax.validation.constraints.{NotNull}
import com.fasterxml.jackson.annotation._

import scala.beans.BeanProperty


@Entity(name="task_instance_log")
class TaskInstanceLog {

  def this(id: Long) {
    this()
    this.id = id
  }

  def this(instance: TaskInstance, log: String){
    this()
    this.taskInstance = instance
    this.log = log
    this.status = instance.status
  }

  @Id
  @GeneratedValue
  @BeanProperty
  var id: Long = _

  @BeanProperty
  @Fetch(value= FetchMode.SELECT)
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JsonIgnore
  var taskInstance: TaskInstance = _

  @BeanProperty
  var status: String = _

  @BeanProperty
  var date: Date = new Date

  @BeanProperty
  @Column(columnDefinition = "varchar(max)")
  var log: String = _

}