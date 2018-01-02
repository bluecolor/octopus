package io.octopus.model

import javax.persistence._
import javax.validation.constraints.{NotNull}

import scala.beans.BeanProperty

@Entity(name="parameter")
class Parameter {

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
  @Column(unique=true)
  var name: String = _

  @BeanProperty
  @NotNull
  @Column(columnDefinition = "varchar(max)")
  var value: String = _

  @BeanProperty
  @Column(columnDefinition = "varchar(max)")
  var description: String = _

}