package io.octopus.search

import scala.beans.BeanProperty
import scala.collection.JavaConversions._
import org.springframework.data.jpa.domain.Specification
import javax.persistence.criteria.{Root,CriteriaQuery,CriteriaBuilder,Predicate}


import io.octopus.model._

class TaskSpec(@BeanProperty var criteria: SearchCriteria) extends Specification[Task] {
  
  override def toPredicate(root: Root[Task], query: CriteriaQuery[_], builder: CriteriaBuilder): Predicate = {
    
    criteria.operation match {
      case SearchOperation.IN => 
        root.get(criteria.key).in(criteria.value.asInstanceOf[java.util.List[AnyRef]])
      case SearchOperation.CONTAINS => 
        builder.isMember(criteria.value,root.get(criteria.key))
      case SearchOperation.EQUALITY =>
        builder.equal(root.get(criteria.key), criteria.value)
      case SearchOperation.NEGATION =>
        builder.notEqual(root.get(criteria.key), criteria.value)
      case SearchOperation.GREATER_THAN =>
        builder.greaterThan(root.get[String](criteria.key),criteria.value.toString)
      case SearchOperation.LESS_THAN =>
        builder.lessThan(root.get[String](criteria.key),criteria.value.toString)
      case SearchOperation.LIKE =>
        builder.like(builder.upper(root.get[String](criteria.key)),
          s"%${criteria.value.toString.toUpperCase}%")
      case _ => null
    }
  }

}