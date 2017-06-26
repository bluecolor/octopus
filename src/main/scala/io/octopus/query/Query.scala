package io.octopus.query

import java.util.regex.{Pattern,Matcher}
import org.springframework.stereotype.Component
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles
import scala.collection.mutable.ListBuffer

class Query {

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)
  protected val searchPattern = "(\\w+\\s+)|(\\s*\\w+\\s*)(:#|:|~|<|>|!:)(\\s*\\w+\\s*)"
  protected val pattern = Pattern.compile(searchPattern)
  
  protected def parseSearchPattern(str: String):(String, List[Operation]) = {
    val search = if(str == null) "" else str.trim
    if(search.isEmpty) return (" (1=1) ",null)
    log.debug(search)
    val ops = buildFilter(pattern.matcher(search))
    val f = ops.map(o => s"${o.l} ${o.o} ${o.r}").mkString(" and ")
    (if(f == null) "(1=1)" else f,ops)
  }

  protected def buildFilter(m: Matcher) = {
    def isNumber(s: String) = s forall Character.isDigit
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
            if(o == SearchOperation.EQUAL_ID && isNumber(v)){
              op.l = "t.primaryGroup.id"
              op.r = v
            }
            else{
              op.l = "lower(t.primaryGroup.name)"
              op.r = s"""lower('%${v.replace("*", "%")}%')"""
            }
            ops += op
          case "owner" => 
            if(o == SearchOperation.EQUAL_ID && isNumber(v)){
              op.l = "t.primaryOwner.id"
              op.r = v
            }
            else{
              op.l = "lower(t.primaryOwner.name)"
              op.r = s"""lower('%${v.replace("*", "%")}%')"""
            }
            ops += op
          case "plan" => 
            if(o == SearchOperation.EQUAL_ID && isNumber(v)){
              op.l = "t.plan.id"
              op.r = v
            }
            else{
              op.l = "lower(t.plan.name)"
              op.r = s"""lower('%${v.replace("*", "%")}%')"""
            }
            ops += op
        }
      }
    }
    ops.toList
  }

  protected def orderBy(sortBy: String, order: String) = {
    val s = if(sortBy==null) "name" else sortBy.toLowerCase
    val o = if(order ==null) "asc" else order.toLowerCase
    val x = if(Array("asc","desc") contains o) o else "asc"
    val q = sortBy match {
      case "name" => "t.name"
      case "avgd" => "s.avgDuration"
      case "error"=> "s.error"
      case _ => "t.name"
    }  
    
    s"order by $q $x"
  }

}