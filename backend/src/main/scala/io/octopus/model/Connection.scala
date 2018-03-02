package io.octopus.model

import java.util.Date
import javax.persistence._
import javax.validation.constraints.{NotNull}
import org.hibernate.annotations.Type
import org.springframework.data.jpa.repository.Temporal
import scala.beans.BeanProperty
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode


@Entity(name="connections")
class Connection {

  def this(id: Long) {
    this()
    this.id = id
  }

  @Id
  @GeneratedValue
  @BeanProperty
  var id: Long = _

  @BeanProperty
  @NotNull
  @Column(unique = true)
  var name: String = _
  
  @BeanProperty
  @NotNull
  @Type(`type`="yes_no")
  var disabled: Boolean = _

  @BeanProperty
  @NotNull
  var connectionType: String = _

  @BeanProperty
  var host: String = "localhost"

  @BeanProperty
  var port: Int = _

  @BeanProperty
  var jdbcUrl: String = _

  @BeanProperty
  var username: String = _

  @BeanProperty
  var password: String = _
  
  @BeanProperty
  var status: Int = _

  @BeanProperty
  var lastChecked: Date = _


}
