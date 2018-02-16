package io.octopus.model

import java.util.Objects
import javax.persistence._
import com.fasterxml.jackson.annotation._
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import javax.validation.constraints.{NotNull}
import scala.beans.BeanProperty


import Priority._

@JsonIgnoreProperties(ignoreUnknown=true)
@Entity(name="task")
class Task{

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
  @Fetch(value= FetchMode.JOIN)
  @ManyToOne(optional = true, fetch = FetchType.EAGER)
  var connection: Connection = _

  @BeanProperty
  var priority: Int = Priority.MEDIUM.id

  @BeanProperty
  var active: Boolean = true

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToMany(fetch = FetchType.EAGER, cascade = Array(CascadeType.REMOVE))
  @JoinTable(name = "task_group", 
    joinColumns = Array(new JoinColumn(name = "task_id", nullable = false, updatable = false)),
    inverseJoinColumns = Array(new JoinColumn(name = "group_id",nullable = false, updatable = false)) 
  )
  var groups: java.util.Set[Group] = _

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToMany(fetch = FetchType.LAZY, cascade = Array(CascadeType.REMOVE))
  @JoinTable(name="parent_child_task",
    joinColumns = Array(new JoinColumn(name = "parent_id", referencedColumnName= "id", nullable = false, updatable = false)),
    inverseJoinColumns = Array(new JoinColumn(name = "child_id", referencedColumnName="id", nullable = false, updatable = false))
  ) 
  var dependencies: java.util.Set[Task] = _

  @JsonIgnore
  @ManyToMany(mappedBy = "dependencies")
  var childs: java.util.Set[Task] = _

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToOne(fetch = FetchType.EAGER)
  var primaryGroup: Group = _
  
  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToOne(optional=false, fetch = FetchType.EAGER)
  var plan: Plan = _

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToOne(optional = false)
  var technology: Technology = _

  @BeanProperty
  var script: String = _

  @BeanProperty
  var retry: Int = 1

  @BeanProperty
  @Column(nullable=true)
  var description: String = _

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToMany(fetch = FetchType.LAZY, cascade = Array(CascadeType.REMOVE))
  @JoinTable(name = "task_user", 
    joinColumns = Array(new JoinColumn(name = "task_id", nullable = false, updatable = false)),
    inverseJoinColumns = Array(new JoinColumn(name = "user_id",nullable = false, updatable = false)) 
  )
  var owners: java.util.Set[User] = _

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToOne(fetch = FetchType.LAZY)
  var primaryOwner: User = _

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @ManyToMany(fetch = FetchType.LAZY, cascade = Array(CascadeType.REMOVE))
  @JoinTable(name = "task_bookmark", 
    joinColumns = Array(new JoinColumn(name = "task_id", nullable = false, updatable = false)),
    inverseJoinColumns = Array(new JoinColumn(name = "user_id",nullable = false, updatable = false)) 
  )
  @JsonIgnore
  var bookmarkers: java.util.Set[User] = _

  @Transient
  @BeanProperty
  var bookmarked: Boolean = false

  @BeanProperty
  @Fetch(value= FetchMode.SELECT)
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "task", cascade=Array(CascadeType.REMOVE))  
  @JsonIgnore
  var instances: java.util.Set[TaskInstance] = _

  @BeanProperty
  @Fetch(value= FetchMode.JOIN)
  @OneToOne(optional = true, fetch = FetchType.EAGER, mappedBy = "task", cascade=Array(CascadeType.REMOVE))
  var stats: TaskStats = _

}