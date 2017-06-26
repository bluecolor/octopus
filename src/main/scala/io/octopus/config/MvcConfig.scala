package io.octopus.config

import scala.collection.JavaConversions._

import org.springframework.context.annotation.Bean
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.context.support.ReloadableResourceBundleMessageSource

import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module
import com.fasterxml.jackson.databind._


@Configuration
class MvcConfig extends WebMvcConfigurerAdapter{

  override def addViewControllers(registry: ViewControllerRegistry ) {
    registry.addViewController("/home").setViewName("index");
    registry.addViewController("/").setViewName("index");
    registry.addViewController("/login").setViewName("login");
    registry.addViewController("/forgot-password").setViewName("forgot-password");
  }

  @Bean
  def customJackson2HttpMessageConverter(): MappingJackson2HttpMessageConverter = {
    val jsonConverter= new MappingJackson2HttpMessageConverter
    val mapper = new ObjectMapper
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,false)
    mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false)
    val module = new Hibernate5Module
    module.disable(Hibernate5Module.Feature.USE_TRANSIENT_ANNOTATION);
    mapper.registerModule(module)
    mapper.registerModule(new DefaultScalaModule)

    jsonConverter.setObjectMapper(mapper)
    jsonConverter
  }

  override def configureMessageConverters(
    converters: java.util.List[HttpMessageConverter[_]]): Unit = {
    converters.add(customJackson2HttpMessageConverter())
  }

  @Bean
  def  messageSource: ReloadableResourceBundleMessageSource = {
    var messageBundle = new ReloadableResourceBundleMessageSource
    messageBundle.setBasename("classpath:messages/messages")
    messageBundle.setDefaultEncoding("UTF-8")
    messageBundle
  }

}