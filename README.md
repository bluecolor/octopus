# Octopus - Open Source Task Scheduler


### Configuration
- configure `octopus.shell` using the `application.properties.template` file in `OCTOPUS_HOME`
  - rename the `application.properties.template` file to `application.properties` and enter the 
  repository connection parameters and octopus shell initiation parameters.

### Bower
```
cd octopus/src/main/resources/static
bower install
```

### Gulp
```
cd octopus/src/main/resources/static
gulp
```

### Boot
```
git clone https://github.com/bluecolor/octopus
cd octopus
gradle bootrun
```

### Usage
- create system user from the `octopus shell`:
  ```
    ssh user@localhost -p 2000
    # enter password
    su -h # help for su command
    # example
    # su -m c -u system -p system -n system -e system@bluecolor.io
    # username: system password: system
  ```
- open app in browser and login with `system user` that you created in previous step.
  ```
  http://localhost:8080
  ```

### Documentation

See [here](https://bluebooks.gitbooks.io/octopus/content/) for user guide and documentation.
