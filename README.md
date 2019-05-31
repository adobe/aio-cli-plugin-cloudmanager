# aio-cli-plugin-cloudmanager
Cloud Manager Plugin for the Adobe I/O CLI 

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @adobe/aio-cli-plugin-cloudmanager
$ ./bin/run COMMAND
running command...
$ ./bin/run (-v|--version|version)
@adobe/aio-cli-plugin-cloudmanager/0.0.0 darwin-x64 node-v10.15.3
$ ./bin/run --help [COMMAND]
USAGE
  $ ./bin/run COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`./bin/run cloudmanager:get-current-execution PROGRAMID PIPELINEID`](#bin-run-cloudmanagerget-current-execution-programid-pipelineid)
* [`./bin/run cloudmanager:list-current-executions PROGRAMID`](#bin-run-cloudmanagerlist-current-executions-programid)
* [`./bin/run cloudmanager:list-pipelines PROGRAMID`](#bin-run-cloudmanagerlist-pipelines-programid)
* [`./bin/run cloudmanager:list-programs`](#bin-run-cloudmanagerlist-programs)
* [`./bin/run cloudmanager:start-execution PROGRAMID PIPELINEID`](#bin-run-cloudmanagerstart-execution-programid-pipelineid)

## `./bin/run cloudmanager:get-current-execution PROGRAMID PIPELINEID`

get pipeline execution

```
USAGE
  $ ./bin/run cloudmanager:get-current-execution PROGRAMID PIPELINEID

ARGUMENTS
  PROGRAMID   the program id
  PIPELINEID  the pipeline id

OPTIONS
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/get-current-execution.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/v0.0.0/src/commands/cloudmanager/get-current-execution.js)_

## `./bin/run cloudmanager:list-current-executions PROGRAMID`

list running pipeline executions

```
USAGE
  $ ./bin/run cloudmanager:list-current-executions PROGRAMID

ARGUMENTS
  PROGRAMID  the program id

OPTIONS
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-current-executions.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/v0.0.0/src/commands/cloudmanager/list-current-executions.js)_

## `./bin/run cloudmanager:list-pipelines PROGRAMID`

lists pipelines available in a Cloud Manager program

```
USAGE
  $ ./bin/run cloudmanager:list-pipelines PROGRAMID

ARGUMENTS
  PROGRAMID  the program id

OPTIONS
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-pipelines.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/v0.0.0/src/commands/cloudmanager/list-pipelines.js)_

## `./bin/run cloudmanager:list-programs`

lists programs available in Cloud Manager

```
USAGE
  $ ./bin/run cloudmanager:list-programs

OPTIONS
  -e, --enabledonly            only output Cloud Manager-enabled programs
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-programs.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/v0.0.0/src/commands/cloudmanager/list-programs.js)_

## `./bin/run cloudmanager:start-execution PROGRAMID PIPELINEID`

start pipeline execution

```
USAGE
  $ ./bin/run cloudmanager:start-execution PROGRAMID PIPELINEID

ARGUMENTS
  PROGRAMID   the program id
  PIPELINEID  the pipeline id

OPTIONS
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/start-execution.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/v0.0.0/src/commands/cloudmanager/start-execution.js)_
<!-- commandsstop -->
