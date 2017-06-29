package crash.commands

import org.crsh.cli.Command
import org.crsh.cli.Usage
import org.crsh.cli.Required
import org.crsh.cli.Named
import org.crsh.command.InvocationContext

import org.springframework.beans.factory.BeanFactory
import org.springframework.beans.factory.annotation.Autowired

import io.octopus.model.User
import io.octopus.model.Role
import io.octopus.service.UserService

/*
  CREATE:
    su -m c -u system -p system -n system -e system@bluecolor.io


*/

class Su {

  private UserService userService

  @Usage("Manage super user")
  @Command
  def main(InvocationContext context,
    @Required @Usage("username") @Option(names=["u","username"]) String username,
    @Usage("password") @Option(names=["p","password"]) String password,
    @Usage("name")  @Option(names=["n","name"])  String name,
    @Usage("email") @Option(names=["e","email"]) String email,
    @Usage("mode c(create) u(update) d(delete)") @Option(names=["m","mode"])  String mode 
  ) {
    
    BeanFactory beanFactory = (BeanFactory) context.getAttributes().get("spring.beanfactory")
    userService = beanFactory.getBean(UserService.class)
    User user = null

    switch(mode.toLowerCase()) {
      case ["c","create"]: 
        user = create(username, password, name, email); 
        break;
      case ["u","update"]:
        user = update(username, password, name, email); 
        break;
      case ["d","delete"]:
        user = delete(username); 
        break;
    }

    if(user != null){
      out.println("Success", green)
      return
    }

    return "Exit!"
  }

  
  private def create(String username, String password, String name, String email) {
    User user = userService.findSystemUser()

    if(user != null){
      out.println("""Error: 
        Only one system user is allowed. 
        There is already a system user with username ${user.username} 
      """, red)
      return null
    } 
    user = userService.findByUsername(username)
    if(user != null){
      out.println("Error: User ${username} already exists!", red)
      return null
    }
    if(!password?.trim()){
      out.println("Error: Password must be given for 'create' mode!", red)
      return null
    }

    user = new User()
    user.username = username
    user.password = password
    user.email = email
    user.name = name
    user.system = true
    user.role = "MASTER"
    return userService.create(user, true)
  }

  private def update(String username, String password, String name, String email) {
    
    User user = userService.findByUsername(username)

    if(user != null && !user.system){
      out.println("Error: User ${username} is not a system user!", red)
      return null
    }
    else if(user == null) {
      out.println("Error: User ${username} does not exist!", red)
      return null
    }
    if(!user.password?.trim()){
      out.println("Error: Password must be given for 'update' mode!", red)
      return null
    }

    user = new User()
    user.password = password
    user.email = email
    user.name = name
    return userService.update(user)
  }

  private def delete(String username) {
    User user = userService.findByUsername(username)
    
    if(user != null && !user.system){
      out.println("Error: User ${username} is not a system user!", red)
      return null
    }
    else if(user == null) {
      out.println("Error: User ${username} does not exist!", red)
      return null
    }
    
    return userService.deleteSystemUser(user.id)
  }




}