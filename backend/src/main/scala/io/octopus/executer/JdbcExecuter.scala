package io.octopus.executer

import java.sql.{Connection}

class JdbcExecuter(private val connection: Connection) {

  def run(script: String) = {
    val stmt = connection.createStatement
    stmt.execute(script)   
  }
  
}