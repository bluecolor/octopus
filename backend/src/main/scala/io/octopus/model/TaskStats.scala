package io.octopus.model

import scala.collection.JavaConversions._
import java.util.Objects
import java.util.Date
import java.text.SimpleDateFormat
import javax.persistence._
import com.fasterxml.jackson.annotation._
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import org.hibernate.annotations.{GenericGenerator,Formula}
import org.hibernate.annotations.{Parameter => HibernateParameter}
import javax.validation.constraints.{NotNull}
import scala.beans.BeanProperty

@Entity(name="task_stats")
class TaskStats {

  def this(id: Long) {
    this()
    this.id = id
  }

  @Id
  @BeanProperty
  @GeneratedValue
  var id: Long = _

  @BeanProperty
  @OneToOne
  @JoinColumn(name="task")
  @JsonIgnore
  var task: Task = _

  @BeanProperty
  var success: Long = 0

  @BeanProperty
  var done: Long = 0

  @BeanProperty
  var killed: Long = 0

  @BeanProperty
  var error: Long = 0

  @BeanProperty
  var duration: Long = 0

  @BeanProperty
  var minDuration: Long = 0

  @BeanProperty
  var maxDuration: Long = 0

  @BeanProperty
  var analyzedAt: Date = _

  @JsonProperty("avgDuration")
  @JsonSerialize
  @BeanProperty
  @Formula("case when success != 0 then duration/success else 0 end")
  var avgDuration: Long = _

  @JsonProperty("total")
  @JsonSerialize
  @BeanProperty
  def total = {
    success + done + killed + error
  }

}