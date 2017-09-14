package io.octopus.connector

import io.octopus.model.{Connection}
import scala.collection.mutable.ListBuffer

class OdiConnector(private val connection: Connection) extends JdbcConnector(connection) {

  def findSchemas = {
    val con = connect
    val md  = con.getMetaData
    val rs  = md.getSchemas
    val schemas = ListBuffer.empty[String]

    while(rs.next) {
      schemas += rs.getString("TABLE_SCHEM")   
    }
    rs.close
    con.close
    schemas  
  }

  def findWorkRepos(masterRepo: String) = {
    val sql = s"select rep_name from ${masterRepo}.snp_rem_rep"
    val con = connect
    val stmt= con.createStatement
    val rs  = stmt.executeQuery(sql) 
    val repos = ListBuffer.empty[String]

    while(rs.next) {
      repos += rs.getString("REP_NAME")   
    }
    rs.close
    con.close
    repos  
  }

}