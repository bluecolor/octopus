package io.octopus.query

import java.util.regex.{Pattern,Matcher}
import org.springframework.stereotype.Component
import scala.collection.JavaConverters._
import scala.collection.JavaConversions._

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles
import scala.collection.mutable.ListBuffer

trait Query {

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)
  protected val searchPattern = "(\\w+\\s+)|(\\s*\\w+\\s*)(:#|:|~|<|>|!:)(\\s*\\w+\\s*|\\[[\\w+[\\s*\\w*]*,??]*\\]\\s*)"
  protected val pattern = Pattern.compile(searchPattern)
  
  protected def parseSearchPattern(str: String):( String, Map[String, AnyRef] )  = {
    val search = if(str == null) "" else str.trim
    if(search.isEmpty) return (" (1=1) ",null)
    log.debug(search)
    val (f,o) = buildFilter(pattern.matcher(search+" "))
    if(f.isEmpty) 
      ("(1=1)", null) 
    else
      (f.map(f => s"(${f})").mkString(" and "), o)
  }

  protected def build(p:String, o: String, v:String): String = {
    var op = new Operation
    var parameter= p
    var operator:String = SearchOperation.operator(o)
    var value = v.stripPrefix("[").stripSuffix("]")

    if(operator == SearchOperation.SQL_LIKE){
      return value
      .split(",")
      .map(vl => s"""${parameter.toLowerCase} like '%${vl.trim.toLowerCase.replace("*", "%")}%'""")
      .mkString(" or ")
    }
    if(operator == SearchOperation.SQL_EQUAL){
      return s"${parameter} in (${value})"
    }
    else return "1=1"
  }

  protected def buildFilter(m: Matcher): ( List[String], Map[String, AnyRef] )



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