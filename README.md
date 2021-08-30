# yarn-plugin-script-tools

> Tired of long script lines or mess with scripts in package.json? use this plugin to simplify your routine work.
> Works well with workspace-tools

## Usage

Install the plugin:
```sh
yarn plugin import https://raw.githubusercontent.com/zemd/yarn-plugin-script-tools/main/bundles/%40yarnpkg/plugin-script-tools.js
```

and then create a folder within your package OR packages with your scripts files. For example, you have a monorepo 
project where you have `mypackage1` and `mypackage2`. In the same time `mypackage1` has heavy launching and stopping 
logic. Then you can place all your commands within files `start.yml` and `stop.yml` to say that you want start the 
project with command `yarn scripts mypackage1 start`. 

```
/root
 |- /packages
 |--- /mypackage1
 |----- /.scripts
 |------- /assets
 |--------- Caddyfile
 |------- start.yml // <-- this file includes all commands for starting
 |------- stop.yml  // <-- this file includes all commands for stopping
```

Example of `start.yml`

```yml
- yarn banner Mypackage1 # good to have this plugin also, see yarn-plugin-banner-tools
- caddy start --config .scripts/assets/Caddyfile # each command is being executed with cwd of the **package** root
- docker-compose -f microservice/docker-compose.dev.yml up -d
- yarn workspace database knex migrate:latest # works well with workspace-tools
- yarn run start
```

Now you can build your logic much easier and safer. Scripts tools are cross-platform, so it works on Windows too
unless you are trying to execute bash scripts.

### Simple usage

For regular projects you can place `.scripts` folder in your project's root and run the command

```sh
yarn scripts start
```

### Advanced usage

Sometimes it might be necessary to have `.scripts` near packages. For example, if you have a set of microservices
which you want to coordinate. You can achieve this by adding `.script` configuration key into your `package.json`.

For example,
```json
{
  "workspaces": [
    "apps/**/*"
  ],
  ".script": [
    "apps/*"
  ]
}
```

and your folder structure looks like:

```
/root
 |- /apps
 |--- /myapp
 |----- /.scripts
 |------- start.yml
 |----- /microservice1
 |----- /microservice2
```

then you can execute command for your app with command:
```sh
yarn scripts myapp start
```

## ps

same works for usual non monorepo projects. For example,

```
/root
 |- /mypackage1
 |--- /.scripts
 |----- /assets
 |------- Caddyfile
 |----- start.yml
 |----- stop.yml
```

## License

yarn-plugin-script-tools is released under the MIT license.

## Donate

[![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/red_rabbit)
