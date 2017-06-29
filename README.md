# Octopus - Open Source Task Scheduler


### Boot
```
git clone https://github.com/bluecolor/octopus
cd octopus
gradle bootrun
```

### Gulp
```
cd octopus/src/main/resources/static
gulp
```

### Usage

- configure `octopus.shell` using the `application.properties` file in `OCTOPUS_HOME`

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