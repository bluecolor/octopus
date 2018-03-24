package io.octopus.model

import scala.collection.JavaConversions._
import java.util.Objects
import java.util.Date
import javax.persistence._
import com.fasterxml.jackson.annotation._
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import javax.validation.constraints.{NotNull}
import scala.beans.BeanProperty

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity(name="plan")
class Plan {

  def this(id: Long) {
    this()
    this.id = id
  }

  def this(id: Int) {
    this()
    this.id = id
    this.active = false
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
  @NotNull
  var protect: Boolean = true

  @BeanProperty
  @NotNull(message="error.scheduleExpression.notNull")
  var schedule: String = _

  @BeanProperty
  var description: String = _

  @BeanProperty
  @NotNull(message="error.connection.notNull")
  @Fetch(value= FetchMode.SELECT)
  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  var connection: Connection = _

  @BeanProperty
  var parallel: Int = _

  @BeanProperty
  var priority: Int = _

  @BeanProperty
  var active: Boolean = false

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "plan", cascade=Array(CascadeType.REMOVE))
  @JsonIgnore
  var tasks: java.util.Set[Task] = new java.util.HashSet[Task]

  @BeanProperty
  @Fetch(value= FetchMode.SELECT)
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "plan", cascade=Array(CascadeType.REMOVE))
  @JsonIgnore
  var sessions: java.util.Set[Session] = new java.util.HashSet[Session]

  @JsonProperty("stats")
  @JsonSerialize
  @BeanProperty
  def stats:PlanStats = {
    val s = sessions.filter(_.status == Status.SUCCESS)
    val taskCount = tasks.size
    val groupCount= tasks.map(_.groups).flatten.toList.distinct.length
    if(s.size == 0)
      return PlanStats(taskCount,groupCount)
    val avgDuration = s.map(_.duration).sum / s.size
    val maxDuration = s.map(_.duration).max
    val minDuration = s.map(_.duration).filter(_!=0).min

    PlanStats(taskCount,groupCount, avgDuration, maxDuration, minDuration)
  }



}