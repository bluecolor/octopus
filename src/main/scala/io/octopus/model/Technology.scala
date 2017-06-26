package io.octopus.model

import java.util.Date
import javax.persistence._
import javax.validation.constraints.{NotNull}

import scala.beans.BeanProperty

object Technology {
  val Database = "Database"
  val ShellScript = "Shell Script" 
}

@Entity(name="technology")
class Technology {

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
  var name: String = _

  @BeanProperty
  var description: String = _

}
