package io.octopus.service

import java.util.Date
import scala.collection.JavaConversions._
import scala.collection.JavaConverters._

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.lang.invoke.MethodHandles

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.{Pageable, Page}
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import com.fasterxml.jackson.databind.ObjectMapper

import io.octopus.repository.ConnectionRepository
import io.octopus.model._
import io.octopus.connector._

import io.octopus.exception._

@Service
@Transactional
class ConnectionService @Autowired()(val connectionRepository: ConnectionRepository) {

  def findAll = connectionRepository.findAll

  def findOne(id: Long) = connectionRepository.findOne(id)

  private val log:Logger  = LoggerFactory.getLogger(MethodHandles.lookup.lookupClass)


  def search(q: String) = {
    connectionRepository.findByNameContainingIgnoreCase(q)
  }

  @throws(classOf[UnSupportedConnectionTypeException])
  @throws(classOf[Exception])
  def test(connection: Connection): Boolean = {
    
    if(!ConnectionType.isSupported(connection.connectionType)){
      throw new UnSupportedConnectionTypeException(s"${connection.connectionType} is not supported")
    }
    
    var result: Boolean = true

    try {
      if(connection.connectionType == ConnectionType.JDBC) {
        val con = new JdbcConnector(connection)
        result = con.test
      } else if (connection.connectionType == ConnectionType.SSH){
        val con = new SshConnector(connection)
        result = con.test
      }
    }catch {
        case e: Exception => 
          updateStatus(connection.id,-1)
          throw e
    }
    
    updateStatus(connection.id, if(result) 1 else -1)
      
    return result
  }

  def test(id: Long): Boolean = {
    test(findOne(id))
  }

  def update(connection: Connection) = {
    var con = findOne(connection.id)
    con.name = connection.name
    con.host = connection.host
    con.port = connection.port
    con.connectionType = connection.connectionType
    con.jdbcUrl = connection.jdbcUrl
    con.username= connection.username
    con.password= connection.password //todo encrypt
    connectionRepository.save(con)  
  }

  private def updateStatus(id:Long, status: Int = 0) = {
    var connection = findOne(id)
    if(connection != null) {
      log.debug(s"Update connection($id) status : $status")
      connection.status = status
      connectionRepository.save(connection)
    }
  }

  @throws(classOf[ConnectionNameExistException])
  def create(connection: Connection): Connection = {
    if(connectionRepository.findByNameIgnoreCase(connection.name) == null){
      throw new ConnectionNameExistException(connection.name)
    }
    connectionRepository.save(connection)
  }
    

  def delete(id: Long): Connection = {
    val connection = connectionRepository.findOne(id);
    connectionRepository.delete(id)
    connection
  }

  def export(id: java.lang.Long) = {
    var scheduler = new Scheduler
    val mapper = new ObjectMapper
    scheduler.connections = scala.List(connectionRepository.findOne(id))
    mapper.writeValueAsString(scheduler)
  }

  def importConnections(connections: java.util.List[Connection]) = {

    connections.foreach{connection =>
      var c = connectionRepository.findByNameIgnoreCase(connection.name)
      if(c == null) {
        c = new Connection
        c.name = connection.name
      }
      c.disabled = connection.disabled
      c.connectionType = connection.connectionType 
      c.host = connection.host
      c.port = connection.port
      c.jdbcUrl = connection.jdbcUrl
      c.username= connection.username
      c.password= connection.password
      c.status = connection.status
      connectionRepository.save(connection)
    }
    connections
  }

}
