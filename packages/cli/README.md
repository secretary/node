oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @secretary/cli
$ secretary COMMAND
running command...
$ secretary (--version)
@secretary/cli/4.0.0-alpha.0 darwin-x64 node-v18.12.1
$ secretary --help [COMMAND]
USAGE
  $ secretary COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`secretary help [COMMAND]`](#secretary-help-command)
* [`secretary plugins`](#secretary-plugins)
* [`secretary plugins:install PLUGIN...`](#secretary-pluginsinstall-plugin)
* [`secretary plugins:inspect PLUGIN...`](#secretary-pluginsinspect-plugin)
* [`secretary plugins:install PLUGIN...`](#secretary-pluginsinstall-plugin-1)
* [`secretary plugins:link PLUGIN`](#secretary-pluginslink-plugin)
* [`secretary plugins:uninstall PLUGIN...`](#secretary-pluginsuninstall-plugin)
* [`secretary plugins:uninstall PLUGIN...`](#secretary-pluginsuninstall-plugin-1)
* [`secretary plugins:uninstall PLUGIN...`](#secretary-pluginsuninstall-plugin-2)
* [`secretary plugins update`](#secretary-plugins-update)

## `secretary help [COMMAND]`

Display help for secretary.

```
USAGE
  $ secretary help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for secretary.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.20/src/commands/help.ts)_

## `secretary plugins`

List installed plugins.

```
USAGE
  $ secretary plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ secretary plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.8/src/commands/plugins/index.ts)_

## `secretary plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ secretary plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ secretary plugins add

EXAMPLES
  $ secretary plugins:install myplugin 

  $ secretary plugins:install https://github.com/someuser/someplugin

  $ secretary plugins:install someuser/someplugin
```

## `secretary plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ secretary plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ secretary plugins:inspect myplugin
```

## `secretary plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ secretary plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ secretary plugins add

EXAMPLES
  $ secretary plugins:install myplugin 

  $ secretary plugins:install https://github.com/someuser/someplugin

  $ secretary plugins:install someuser/someplugin
```

## `secretary plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ secretary plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ secretary plugins:link myplugin
```

## `secretary plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ secretary plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ secretary plugins unlink
  $ secretary plugins remove
```

## `secretary plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ secretary plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ secretary plugins unlink
  $ secretary plugins remove
```

## `secretary plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ secretary plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ secretary plugins unlink
  $ secretary plugins remove
```

## `secretary plugins update`

Update installed plugins.

```
USAGE
  $ secretary plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
