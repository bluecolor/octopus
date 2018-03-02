package io.octopus.connector

import io.octopus.model.{TaskInstance,Connection}
import java.sql.{Connection => JDBCConnection}
import java.sql.{DriverManager => JDBCDriverManager}

import io.octopus.exception.UnSupportedConnectionUrlException

object Dbms {
  val ORACLE      = "oracle"
  val POSTGRESQL  = "postgresql"
  val SQLSERVER   = "sqlserver"
  val HSQLDB      = "hsqldb"

  def name(jdbcUrl: String): String = {
    if (jdbcUrl.toLowerCase contains "oracle") Dbms.ORACLE
    else if (jdbcUrl.toLowerCase contains "postgresql") Dbms.POSTGRESQL
    else if (jdbcUrl.toLowerCase contains "sqlserver")  Dbms.SQLSERVER
    else if (jdbcUrl.toLowerCase contains "hsqldb")  Dbms.HSQLDB
    else throw new UnSupportedConnectionUrlException(s"${jdbcUrl} rdbms not supported!")
  }

  def className(jdbcUrl: String) : String = {
    if (jdbcUrl.toLowerCase contains "oracle") "oracle.jdbc.driver.OracleDriver"
    else if (jdbcUrl.toLowerCase contains "postgresql") "org.postgresql.Driver"
    else if (jdbcUrl.toLowerCase contains "sqlserver") "com.microsoft.jdbc.sqlserver.SQLServerDriver"
    else if (jdbcUrl.toLowerCase contains "hsqldb") "org.hsqldb.jdbcDriver"
    else throw new UnSupportedConnectionUrlException(s"${jdbcUrl} rdbms not supported!")
  }

}

class JdbcConnector(private val connection: Connection) extends Connector {
  

  @throws(classOf[Exception])
  def test: Boolean = {
    val con = 
      JDBCDriverManager.getConnection(connection.jdbcUrl,connection.username,connection.password)
    con.close
    true  
  }

  @throws(classOf[Exception])
  def connect: java.sql.Connection = { 
    JDBCDriverManager.getConnection(connection.jdbcUrl,connection.username,connection.password)
  } 


}