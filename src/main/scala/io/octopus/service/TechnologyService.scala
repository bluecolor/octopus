package io.octopus.service



import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import io.octopus.repository.TechnologyRepository
import io.octopus.model.Technology

@Service
@Transactional
class TechnologyService @Autowired()(val technologyRepository: TechnologyRepository) {

  def findAll() = {
    technologyRepository.findAll()
  }
  
}