package io.octopus.service

import scala.collection.JavaConversions._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import io.octopus.model._

@Service
@Transactional
class SearchService {

  @(Autowired @setter)
  private var taskService: TaskService = _

  @(Autowired @setter)
  private var taskInstanceService: TaskInstanceService = _

  @(Autowired @setter)
  private var userService: UserService = _
  
  @(Autowired @setter)
  private var groupService: GroupService = _

  @(Autowired @setter)
  private var connectionService: ConnectionService = _
  
  
  def search(q: String) = {
    
    var responses = scala.List[SearchResponse]()
    val tasks = taskService.search(q)
    val users = userService.search(q)
    val groups= groupService.search(q)
    val connections = connectionService.search(q)

    responses ++= tasks.map{ t =>
      var resp = new SearchResponse
      resp.name= t.name
      resp.result = t
      resp.resultType = SearchResultType.TASK
      resp
    }

    responses ++= users.map{ u =>
      var resp = new SearchResponse
      resp.name= u.name
      resp.result = u
      resp.resultType = SearchResultType.USER
      resp
    }

    responses ++= groups.map{ g =>
      var resp = new SearchResponse
      resp.name= g.name
      resp.result = g
      resp.resultType = SearchResultType.GROUP
      resp
    }

    responses ++= connections.map{ c =>
      var resp = new SearchResponse
      resp.name= c.name
      resp.result = c
      resp.resultType = SearchResultType.CONNECTION
      resp
    }

    responses
  }  


}