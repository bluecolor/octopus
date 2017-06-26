package io.octopus.query

import java.util.regex.{Pattern,Matcher}
import org.springframework.stereotype.Component
import org.hibernate.{Session=>HibernateSession,_}
import org.hibernate.criterion._ 
import javax.persistence.EntityManagerFactory
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._
import org.springframework.beans.factory.annotation.Autowired
import scala.annotation.meta.setter
import io.octopus.model._

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles


@Component
class SessionQuery extends Query{

  @(Autowired @setter)
  private var entityManagerFactory: EntityManagerFactory = _

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)

  def findAll(pageNo: Int, pageSize: Int, search:String, sortBy:String = "name" , order:String = "asc") = {
    
    val em = entityManagerFactory.createEntityManager
    val session = em.unwrap(classOf[HibernateSession])
    var page = new io.octopus.model.Page[Session]
    var (filter,ops) = parseSearchPattern(search) 
    var sort = orderBy(sortBy, order)
    val q = s"""
      select s 
      from 
        session s 
        left join fetch s.plan p 
      where 
        ${filter} 
      ${sort}
    """
    log.debug(q)
    var query = session.createQuery(q)
    
    if(ops != null){
      ops.filter(_.p != null).foreach{o=>
        log.debug(o.r)
        query.setParameter(o.r.stripPrefix(":"),o.p)
      }
    }
    
    
    page.count = query.list.length
    if(pageNo == 0) {
      page.totalPages = 
      if(page.count % pageSize == 0) 
        page.count / pageSize 
      else 
        page.count / pageSize +1
    }
    page.page = pageNo
    page.pageSize = pageSize

    val sessions = query.setFirstResult(pageNo*pageSize).setMaxResults(pageSize).list.map(_.asInstanceOf[Session])
    page.content = sessions
    page
  }

  override def orderBy(sortBy: String, order: String) = {
    val s = if(sortBy==null) "name" else sortBy.toLowerCase
    val o = if(order ==null) "asc" else order.toLowerCase
    val x = if(Array("asc","desc") contains o) o else "asc"
    val q = s.toLowerCase match {
      case "name" => "p.name"
      case "scheduledate" => "s.scheduleDate"
      case "startdate"=> "s.startDate"
      case "status" => "s.status"
      case _ => "s.scheduleDate"
    }  
    s"order by $q $x"
  }

  override def buildFilter(m: Matcher) = {
    import scala.collection.mutable.ListBuffer
    def isNumber(s: String) = s forall Character.isDigit
    var ops = new ListBuffer[Operation]
    while(m.find) {
      var w = m.group(1)
      var p = m.group(2)
      var o = m.group(3)
      var v = m.group(4)
      
      if(w != null && !w.trim.isEmpty) {
        ops += new Operation("lower(p.name)", "like", s"""lower('%${w.trim.replace("*", "%")}%')""")
      }
      if(p!=null && o!= null && v!= null) {
        p=p.trim;o=o.trim;v=v.trim;
        var op = new Operation
        op.o = SearchOperation.operator(o)
        p.toLowerCase match {
          case "startdatebegin"=> 
            op.l="s.startDate" 
            op.r=":startDateBegin"
            op.p = new java.util.Date(v.toLong*1000)
            ops += op
          case "startdateend" => 
            op.l="s.startDate" 
            op.r=":startDateEnd"
            op.p = new java.util.Date(v.toLong*1000) 
            ops += op
          case "plan" => 
            if(o == SearchOperation.EQUAL_ID && isNumber(v)){
              op.l = "p.id"
              op.r = v
            }
            else{
              op.l = "lower(p.name)"
              op.r = s"""lower('%${v.replace("*", "%")}%')"""
            }
            ops += op
          case "status" =>
            op.l = "s.status"
            op.r = s"'${v}'"
            ops += op
        }
      }
    }
    ops.toList
  }


}