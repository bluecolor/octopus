package io.octopus.config

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint
import org.springframework.security.config.annotation.web.builders.WebSecurity

import io.octopus.service.UserService

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
class SecurityConfig extends WebSecurityConfigurerAdapter {
    
  @Autowired
  private var userService: UserService = _
  
  override def configure(web: WebSecurity): Unit = {
    web
      .ignoring()
      .antMatchers("/forgot-password")
      .antMatchers("/api/v1/users/forgot-password")
      .antMatchers("/static/**")
      .antMatchers("/bower_components/**");
  }

  protected override def configure(http: HttpSecurity) : Unit = {
    
    http.csrf().disable().exceptionHandling()
    .authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/login") )
    
    http.authorizeRequests()
    .anyRequest().fullyAuthenticated()
    
    // http.authorizeRequests().antMatchers("/api/v1/users").permitAll()

    http
    .formLogin()
    .loginPage("/login")
    .failureUrl("/login?error")
    .usernameParameter("username")
    .permitAll()
    
    http
    .logout()
    .logoutUrl("/logout")
    .deleteCookies("remember-me")
    .logoutSuccessUrl("/login")
    .permitAll()
    
    
    http
    .rememberMe();
  }

  override def configure(auth: AuthenticationManagerBuilder ): Unit = {
    auth
      .userDetailsService(userService)
      .passwordEncoder(new BCryptPasswordEncoder());
  }
}