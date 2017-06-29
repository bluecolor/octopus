package crash.commands

import org.crsh.cli.Command
import org.crsh.cli.Usage
import org.crsh.command.InvocationContext

class Hello {

  @Usage("Say Hello")
  @Command
  def main(InvocationContext context) {
      return "Hello"
  }

}