package io.octopus.config


import org.quartz.spi.TriggerFiredBundle
import org.springframework.beans.factory.config.AutowireCapableBeanFactory
import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware
import org.springframework.scheduling.quartz.SpringBeanJobFactory

import scala.collection.JavaConversions._

class AutowiringSpringBeanJobFactory extends SpringBeanJobFactory with ApplicationContextAware {

  @transient private var beanFactory: AutowireCapableBeanFactory = _

  override def setApplicationContext(context: ApplicationContext): Unit = {
    beanFactory = context.getAutowireCapableBeanFactory
  }

  protected override def createJobInstance(bundle: TriggerFiredBundle): AnyRef = {
    val job: AnyRef = super.createJobInstance(bundle)
    beanFactory.autowireBean(job)
    job
  }

}
