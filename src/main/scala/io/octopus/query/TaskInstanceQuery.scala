package io.octopus.query

import java.util.regex.{Pattern,Matcher}
import org.springframework.stereotype.Component
import org.hibernate._
import org.hibernate.criterion._ 
import javax.persistence.EntityManagerFactory
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._
import org.springframework.beans.factory.annotation.Autowired
import scala.annotation.meta.setter
import scala.collection.mutable.ListBuffer

import io.octopus.model._
import io.octopus.service.UserService

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles




@Component
class TaskInstanceQuery extends Query {

  @(Autowired @setter)
  private var entityManagerFactory: EntityManagerFactory = _

  @(Autowired @setter)
  private var userService: UserService = _

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  def findBySession(id: Long, page: Int, pageSize: Int, search:String, sortBy:String, order:String) = {
    val em = entityManagerFactory.createEntityManager
    val session = em.unwrap(classOf[org.hibernate.Session])
    var p = new io.octopus.model.Page[TaskInstance]
    var (filter,_) = parseSearchPattern(search) 
    var sort = orderBy(sortBy, order)
    val q = s"""
      select instance
      from 
        task_instance instance
        join fetch instance.task    task 
        join fetch instance.session session
        left join fetch task.stats  stats
        left join fetch task.primaryGroup primaryGroup
        left join fetch task.primaryOwner primaryOwner
        left join fetch task.bookmarkers  bookmarkers
      where 
        instance.session.id = ${id} and
        ${filter} 
      ${sort}
    """
    log.debug(q)
    var query = session.createQuery(q)
    p.count = query.list.length
    if(page == 0) {
      p.totalPages = 
      if(p.count % pageSize == 0) 
        p.count / pageSize 
      else 
        p.count / pageSize +1
    }
    p.page = page
    p.pageSize = page

    val instances = query.setFirstResult(page*pageSize).setMaxResults(pageSize).list.map(_.asInstanceOf[TaskInstance])
    p.content = instances
    p
  }

  
  override def buildFilter(m: Matcher) = {
    var filters = new ListBuffer[String]

    while(m.find) {
      var w = m.group(1)
      var p = m.group(2)
      var o = m.group(3)
      var v = m.group(4)
      
      if(w != null && !w.trim.isEmpty) {
        filters += s"""lower(task.name) like lower('%${w.trim.replace("*", "%")}%')"""
      }
      if(p!=null && o!= null && v!= null) {
        p=p.trim;o=o.trim;v=v.trim;
        var op = new Operation
        
        op.o = SearchOperation.operator(o)
        p.toLowerCase match {
          case "group" => 
            val parameter = if(o == SearchOperation.EQUAL_ID) "primaryGroup.id" else "primaryGroup.name"
            filters += build(parameter, o, v)
          case "owner" => 
            val parameter = if(o == SearchOperation.EQUAL_ID) "primaryOwner.id" else "primaryOwner.name"
            filters += build(parameter, o, v)
          case "plan" => 
            val parameter = if(o == SearchOperation.EQUAL_ID) "plan.id" else "plan.name"
            filters += build(parameter, o, v)
          case "is" =>
            v.toLowerCase.stripPrefix("[").stripSuffix("]") match {
              case "bookmarked" =>
                filters += s"bookmarkers.id = ${userService.findMe.id.toString}"
              case "active" => 
                filters += s"task.active = true"
              case "mine" =>
                filters += s"primaryOwner.id = ${userService.findMe.id.toString}"
            }
          case _ =>
        }
      }
    }
    (filters.toList, null)
  }


  override protected def orderBy(sortBy: String, order: String) = {
    val s = if(sortBy==null) "name" else sortBy.toLowerCase
    val o = if(order ==null) "asc" else order.toLowerCase
    val x = if(Array("asc","desc") contains o) o else "asc"
    val q = sortBy match {
      case "name" => "task.name"
      case "status" => "instance.status"
      case "duration" => """
        case 
          when instance.startDate is null then 1
          when instance.endDate is null then (current_date()-instance.startDate)
          else (instance.endDate - instance.startDate)
        end
      """
      case _ => "task.name"
    }  
    
    s"order by $q $x"
  }


}