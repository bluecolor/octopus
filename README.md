# Octopus - Open Source Task Scheduler

### Clone
```
git clone https://github.com/bluecolor/octopus
```


### Configuration
- configure `octopus.shell` using the `application.properties.template` file in `backend` directory
  - rename the `application.properties.template` file to `application.properties` and enter the 
  repository connection parameters and octopus shell initiation parameters.

### Backend
```
  cd octopus/backend
  gradle bootrun
```


### Frontend
```
cd octopus/frontend
npm run dev
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
  http://localhost:9090
  ```

### Documentation
