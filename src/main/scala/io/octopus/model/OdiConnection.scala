package io.octopus.model

import java.util.Date
import javax.persistence._
import javax.validation.constraints.{NotNull}
import org.hibernate.annotations.Type
import org.springframework.data.jpa.repository.Temporal
import scala.beans.BeanProperty
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode


@Entity(name="odi_connections")
class OdiConnection {

  def this(id: Long) {
    this()
    this.id = id
  }

  @Id
  @GeneratedValue
  @BeanProperty
  var id: Long = _
  
  @BeanProperty
  var master: String = _

  @BeanProperty
  var work: String = _

  @BeanProperty
  @NotNull
  @Type(`type`="yes_no")
  var localInstallation: Boolean = _

  @BeanProperty
  var sshHost: String = _
  
  @BeanProperty
  var sshPort: Int = _

  @BeanProperty
  var sshUsername: String = _

  @BeanProperty
  var sshPassword: String = _  

}
