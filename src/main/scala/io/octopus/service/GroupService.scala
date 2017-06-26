package io.octopus.service

import scala.collection.JavaConversions._
import scala.collection.JavaConverters._

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.PageRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import com.fasterxml.jackson.databind.ObjectMapper

import io.octopus.repository.GroupRepository
import io.octopus.model.{Group,Scheduler}
import io.octopus.exception.GroupExistException

@Service
@Transactional
class GroupService @Autowired()(val groupRepository: GroupRepository) {

  def findAll = groupRepository.findAll

  def findOne(id: Long) = groupRepository.findOne(id)

  def findByNameContainingIgnoreCase(q:String) = 
    groupRepository.findByNameContainingIgnoreCase(q)

  def create(group: Group): Group = {
    val g = groupRepository.findByNameIgnoreCase(group.name)
    if(g != null && g.name.toLowerCase == group.name.toLowerCase){
      throw new GroupExistException(group.name)
    }
    groupRepository.save(group)
  }
  
  def update(group: Group): Group = {
    var g = groupRepository.findOne(group.id)
    g.color = group.color.trim
    g.connection = group.connection
    g.parallel = group.parallel
    g.priority = group.priority
    g.description = group.description
    groupRepository.save(g)
  }

  def delete(id: Long): Group = {
    val group = groupRepository.findOne(id)
    groupRepository.delete(id)
    group
  }

  def export(id: java.lang.Long) = {
    val mapper = new ObjectMapper
    var scheduler = new Scheduler
    scheduler.groups = List(groupRepository.findOne(id))
    mapper.writeValueAsString(scheduler)
  }

  def importGroups(groups: java.util.List[Group]) = {
    for(group <- groups) {
      var g = groupRepository.findByNameIgnoreCase(group.name)
      if(g == null) {
        g = new Group
        g.name = group.name
      }   
      g.priority = group.priority
      g.color = group.color
      g.parallel = group.parallel 
      g.description = group.description
      groupRepository.save(g)
    }
    groups
  }

  def search(q: String) = {
    groupRepository.findByNameContainingIgnoreCase(q)
  }


}