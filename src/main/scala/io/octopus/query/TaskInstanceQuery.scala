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
    var ops = new ListBuffer[Operation]
    
    while(m.find) {
      var w = m.group(1)
      var p = m.group(2)
      var o = m.group(3)
      var v = m.group(4)
      
      if(w != null && !w.trim.isEmpty) {
        ops += new Operation("lower(task.name)", "like", s"""lower('%${w.trim.replace("*", "%")}%')""")
      }
      if(p!=null && o!= null && v!= null) {
        p=p.trim;o=o.trim;v=v.trim;
        var op = new Operation
        op.r = v
        op.o = SearchOperation.operator(o)
        p.toLowerCase match {
          case "status"=>
            op.l = "instance.status"
            op.r = s"'${v.toUpperCase}'"
            ops += op
          case "group" => 
            op.l = "lower(primaryGroup.name)"
            op.r = s"""lower('%${v.replace("*", "%")}%')"""
            op.o = SearchOperation.LIKE
            ops += op
          case "groupid" => 
            op.l = "primaryGroup.id"
            ops += op
          case "owner" => 
            op.l = "lower(primaryOwner.name)"
            op.r = s"""lower('%${v.replace("*", "%")}%')"""
            op.o = SearchOperation.LIKE
            ops += op
          case "ownerid" => 
            op.l = "primaryOwner.id"
            ops += op
          case "sessionid" => 
            op.l = "session.id"
            ops += op
          case "is" =>
            v.toLowerCase.split(",").foreach{ i => 
              i match {
                case "bookmarked" => 
                  op.l = "task.bookmarkers.id"
                  op.r = userService.findMe.id.toString
                  ops += op
                case "active" => 
                  op.l = "task.active"
                  op.r = "true"
                  ops += op  
                case "mine" => 
                  op.l = "primaryOwner.id"
                  op.r = userService.findMe.id.toString
                  ops += op
                case _ =>
              }
            }
          case _ =>
        }
      }
    }
    ops.toList
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