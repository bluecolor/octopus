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
    log.debug(filter)
    log.debug(q)
    var query = session.createQuery(q)
    p.count = query.list.length
    if(page == 0) {
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
    var filters = new ListBuffer[String]

    while(m.find) {
      var w = m.group(1)
      var p = m.group(2)
      var o = m.group(3)
      var v = m.group(4)
      
      log.debug(w,p,o,v);

      if(w != null && !w.trim.isEmpty) {
        filters += s"""lower(t.name) like lower('%${w.trim.replace("*", "%")}%')"""
      }
      if(p!=null && o!= null && v!= null) {
        p=p.trim;o=o.trim;v=v.trim;
        p.toLowerCase match {
          case "group" => 
            val parameter = if(o == SearchOperation.EQUAL_ID) "g.id" else "g.name"
            filters += build(parameter, o, v)
          case "owner" => 
            val parameter = if(o == SearchOperation.EQUAL_ID) "o.id" else "o.name"
            filters += build(parameter, o, v)
          case "plan" => 
            val parameter = if(o == SearchOperation.EQUAL_ID) "p.id" else "p.name"
            filters += build(parameter, o, v)
          case "is" =>
            v.toLowerCase.stripPrefix("[").stripSuffix("]") match {
              case "bookmarked" =>
                filters += s"b.id = ${userService.findMe.id.toString}"
              case "active" => 
                filters += s"t.active = true"
              case "mine" =>
                filters += s"o.id = ${userService.findMe.id.toString}"
            }
          case _ =>
        }
      }
    }
    (filters.toList,null)
  }


}