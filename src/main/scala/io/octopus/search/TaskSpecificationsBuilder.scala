package io.octopus.search

import java.util.ArrayList
import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import org.springframework.data.jpa.domain.{Specification,Specifications}
import javax.persistence.criteria.{Root,CriteriaQuery,CriteriaBuilder,Predicate}

import io.octopus.model._

class TaskSpecificationsBuilder {

  private val params: java.util.List[SearchCriteria] = new ArrayList[SearchCriteria]()

  def _with(key: String,operation: String,value: AnyRef): TaskSpecificationsBuilder = {
    params.add(new SearchCriteria(key, operation, value))
    this
  }

  def build(): Specification[Task] = {
    if (params.size == 0) {
      return null
    }
    val specs: java.util.List[Specification[Task]] = new ArrayList[Specification[Task]]()
    for (param <- params) {
      specs.add(new TaskSpec(param))
    }
    var result: Specification[Task] = specs.get(0)
    for (i <- 1 until specs.size) {
      result = Specifications.where(result).and(specs.get(i))
    }
    result
  }
}
