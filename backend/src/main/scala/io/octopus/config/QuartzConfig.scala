package io.octopus.config

import org.quartz.Scheduler
import org.quartz.Trigger
import org.quartz.spi.JobFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.quartz.SchedulerFactoryBean
import java.util.List

import scala.collection.JavaConversions._


@Configuration
class QuartzConfig {

  @Autowired
  private var applicationContext: ApplicationContext = _

  @Autowired(required = false)
  var triggers: List[Trigger] = _

  @Bean
  def schedulerFactoryBean(): SchedulerFactoryBean = {
    val scheduler: SchedulerFactoryBean = new SchedulerFactoryBean()
    scheduler.setJobFactory(jobFactory())
    if (triggers != null && !triggers.isEmpty) {
      scheduler.setTriggers(triggers: _*)
    }
    scheduler
  }

  @Bean
  def scheduler(schedulerFactoryBean: SchedulerFactoryBean): Scheduler =
    schedulerFactoryBean.getObject

  @Bean
  def jobFactory(): JobFactory = {
    val jobFactory: AutowiringSpringBeanJobFactory = new AutowiringSpringBeanJobFactory()
    jobFactory.setApplicationContext(applicationContext)
    jobFactory
  }

}
