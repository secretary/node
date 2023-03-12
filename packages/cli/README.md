Secretary CLI
=================

Secretary CLI

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
@secretary/cli/4.1.0 linux-x64 node-v18.12.1
$ secretary --help [COMMAND]
USAGE
  $ secretary COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`secretary help [COMMANDS]`](#secretary-help-commands)
* [`secretary inject COMMAND`](#secretary-inject-command)

## `secretary help [COMMANDS]`

Display help for secretary.

```
USAGE
  $ secretary help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for secretary.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.8/src/commands/help.ts)_

## `secretary inject COMMAND`

Inject secrets into the environment of the given command

```
USAGE
  $ secretary inject COMMAND [-c <value>]

ARGUMENTS
  COMMAND  Command to run

FLAGS
  -c, --config=<value>  [default: /home/aequasi/projects/secretary/node/packages/cli/.secretaryrc.js] SecretaryConfig
                        file to read mapping from

DESCRIPTION
  Inject secrets into the environment of the given command

EXAMPLES
  $ secretary inject yarn build
  // output from yarn build
```

_See code: [dist/commands/inject/index.ts](https://github.com/secretary/node/blob/v4.1.0/dist/commands/inject/index.ts)_
<!-- commandsstop -->
