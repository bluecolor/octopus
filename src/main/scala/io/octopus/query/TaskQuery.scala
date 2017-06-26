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
class TaskQuery extends Query{

  @(Autowired @setter)
  private var entityManagerFactory: EntityManagerFactory = _

  @(Autowired @setter)
  private var userService: UserService = _
  
  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)


  def findAll(page: Int, pageSize: Int, search:String, sortBy:String, order:String) = {

    val em = entityManagerFactory.createEntityManager
    val session = em.unwrap(classOf[org.hibernate.Session])
    var p = new io.octopus.model.Page[Task]
    var (filter,_) = parseSearchPattern(search) 
    var sort = orderBy(sortBy, order)
    val q = s"""
      select t 
      from 
        task t 
        left join fetch t.stats s
        left join fetch t.plan  p
        left join fetch t.primaryOwner o
        left join fetch t.primaryGroup g
        left join fetch t.bookmarkers  b 
      where 
        ${filter} 
      ${sort}
    """
    log.debug(q)
    var query = session.createQuery(q)
    p.count = query.list.length
    if(page == 1) {
      p.first = true
      p.totalPages = 
      if(p.count % pageSize == 0) 
        p.count / pageSize 
      else 
        p.count / pageSize +1
    }
    p.page = page
    p.pageSize = page

    val tasks = query.setFirstResult(page*pageSize).setMaxResults(pageSize).list.map(_.asInstanceOf[Task])
    p.content = tasks
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
        ops += new Operation("lower(t.name)", "like", s"""lower('%${w.trim.replace("*", "%")}%')""")
      }
      if(p!=null && o!= null && v!= null) {
        p=p.trim;o=o.trim;v=v.trim;
        var op = new Operation
        
        op.o = SearchOperation.operator(o)
        p.toLowerCase match {
          case "group" => 
            op.l = "lower(g.name)"
            op.r = s"""lower('%${v.replace("*", "%")}%')"""
            op.o = SearchOperation.LIKE
            ops += op
          case "groupid" => 
            op.l = "g.id"
            op.r = v
            ops += op
          case "owner" => 
            op.l = "lower(o.name)"
            op.r = s"""lower('%${v.replace("*", "%")}%')"""
            op.o = SearchOperation.LIKE
            ops += op
          case "ownerid" => 
            op.l = "o.id"
            op.r = v
            ops += op
          case "plan" => 
            op.l = "lower(p.name)"
            op.r = s"""lower('%${v.replace("*", "%")}%')"""
            op.o = SearchOperation.LIKE
            ops += op
          case "planid" => 
            op.l = "p.id"
            op.r = v
            ops += op
          case "is" =>
            v.toLowerCase.split(",").foreach{ i => 
              i match {
                case "bookmarked" => 
                  op.l = "b.id"
                  op.r = userService.findMe.id.toString
                  ops += op
                case "active" => 
                  op.l = "t.active"
                  op.r = "true"
                  ops += op  
                case "mine" => 
                  op.l = "o.id"
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


}