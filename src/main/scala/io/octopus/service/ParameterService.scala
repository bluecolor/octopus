package io.octopus.service

import scala.collection.JavaConversions._

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.PageRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import com.fasterxml.jackson.databind.ObjectMapper

import io.octopus.repository.ParameterRepository
import io.octopus.model.{Parameter,Scheduler}
import io.octopus.exception._

@Service
@Transactional
class ParameterService @Autowired()(val parameterRepository: ParameterRepository) {

  def findAll = parameterRepository.findAll

  def findOne(id: Long): Parameter = {
    parameterRepository.findOne(id)
  }

  def create(parameter: Parameter): Parameter = {
    val p = parameterRepository.findByNameIgnoreCase(parameter.name)
    if(p != null && p.name.toLowerCase == parameter.name.toLowerCase){
      throw new ParameterExistException(parameter.name)
    }
    parameterRepository.save(parameter);
  }

  def update(parameter: Parameter): Parameter = {
    parameterRepository.save(parameter);
  }

  def delete(id: Long): Parameter = {
    val parameter = parameterRepository.findOne(id);
    parameterRepository.delete(id);
    parameter;
  }

  def export(ids: java.util.List[java.lang.Long]) = {
    val mapper = new ObjectMapper
    var scheduler = new Scheduler
    
    scheduler.parameters = parameterRepository.findByIdIn(ids)
    mapper.writeValueAsString(scheduler)
  }

  def importParameters(parameters: java.util.List[Parameter]) = {

    for(parameter <- parameters) {
      var p = parameterRepository.findByNameIgnoreCase(parameter.name)
      if(p == null) {
        p = new Parameter
        p.name = parameter.name
      }    
      p.description = parameter.description
      p.value = parameter.value
      parameterRepository.save(p)
    }
    parameters
  }

}