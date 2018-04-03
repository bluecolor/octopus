# Octopus - Open Source Task Scheduler




### Getting started with minimal configuration
- Download the latest release from [here](https://github.com/bluecolor/octopus/releases/download/0.12/octopus-0.12.883.tar.gz)
- un-compress the archive file
- `cd octopus`
- `./octopus.sh`
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



### Configuration
- You can change the repository to use a different `db` by changing the parameters in `application.properties`
- Configure `octopus.shell` using the `application.properties`


### Developers
- Build backend by;
```
  cd octopus/backend
  gradle bootrun
```
- Start a dev server for frontend with;
```
cd octopus/frontend
npm run dev
```

### Building
- `git clone https://github.com/bluecolor/octopus`
- `cd` into cloned repo folder
- run `./build.sh'
- check out the `dist` folder


### Documentation
