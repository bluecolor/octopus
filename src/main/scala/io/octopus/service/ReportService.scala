package io.octopus.service

import scala.collection.JavaConversions._
import scala.annotation.meta.setter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import io.octopus.model._

@Service
class ReportService {

  @(Autowired @setter)
  private var planService: PlanService = _
  
}