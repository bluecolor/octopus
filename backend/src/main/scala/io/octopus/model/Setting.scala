package io.octopus.model

import java.util.Date
import javax.persistence._
import javax.validation.constraints.{NotNull}
import org.hibernate.annotations.Type
import org.springframework.data.jpa.repository.Temporal
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import scala.beans.BeanProperty

@Entity(name="settings")
class Setting {

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
  @Column(columnDefinition = "varchar(max)")
  var value: String = _

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToOne(optional = true, fetch = FetchType.EAGER)
  var user: User = _

  @BeanProperty
  var updated: Date = new Date

  @PrePersist
  @BeanProperty
  def prePersist = {
    updated = new Date
  }

}
