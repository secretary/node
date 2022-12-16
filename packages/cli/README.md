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
* [`secretary inject COMMAND`](#secretary-inject-command)

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

## `secretary inject COMMAND`

Inject secrets into the environment of the given command

```
USAGE
  $ secretary inject [COMMAND] [-c <value>]

ARGUMENTS
  COMMAND  Command to run

FLAGS
  -c, --config=<value>  [default: /Users/aaron/projects/secretary/node/packages/cli/.secretaryrc.js] SecretaryConfig
                        file to read mapping from

DESCRIPTION
  Inject secrets into the environment of the given command

EXAMPLES
  $ secretary inject yarn build
  // output from yarn build
```

_See code: [dist/commands/inject/index.ts](https://github.com/secretary/node/blob/v4.0.0-alpha.0/dist/commands/inject/index.ts)_
<!-- commandsstop -->
