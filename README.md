<!--
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@adobe/aio-cli-plugin-cloudmanager.svg)](https://npmjs.org/package/@adobe/aio-cli-plugin-cloudmanager)
[![Build Status](https://travis-ci.com/adobe/aio-cli-plugin-cloudmanager.svg?branch=master)](https://travis-ci.com/adobe/aio-cli-plugin-cloudmanager)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/adobe/aio-cli-plugin-cloudmanager/master.svg?style=flat-square)](https://codecov.io/gh/adobe/aio-cli-plugin-cloudmanager/) [![Greenkeeper badge](https://badges.greenkeeper.io/adobe/aio-cli-plugin-cloudmanager.svg)](https://greenkeeper.io/)

# aio-cli-plugin-cloudmanager
Cloud Manager Plugin for the [Adobe I/O CLI](https://github.com/adobe/aio-cli)

# Requirements

* Node.js 10.0+
* [Adobe I/O CLI](https://github.com/adobe/aio-cli)

# Installation

```sh-session
$ aio plugins:install @adobe/aio-cli-plugin-cloudmanager
```
# Updating

```sh-session
$ aio plugins:update
```

# Configuration

## Authentication

At minimum, an integration must be created in the [Adobe I/O Console](https://console.adobe.io) which has the Cloud Manager service. You may also add other services to this integration
if you want to use other Adobe I/O CLI plugins. For example, to use the [Console Plugin](https://github.com/adobe/aio-cli-plugin-console/), your integration needs to have the "I/O Management API" service.

After you've created the integration, create a `config.json` file on your computer and navigate to the integration Overview page. From this page, copy the `client_id` and `client_secret` values to the config file; if you navigate to the JWT tab in Console, you'll get the value for the `jwt_payload`.

```
//config.json 
{
  "client_id": "value from your CLI integration (String)",
  "client_secret": "value from your CLI integration (String)",
  "jwt_payload": { value from your CLI integration (JSON Object Literal) },
  "token_exchange_url": "https://ims-na1.adobelogin.com/ims/exchange/jwt"
}
```

The last bit you need to have at hand is the private certificate you've used to create the integration; you need the private key, not the public one. Now, you are ready to configure the `aio` CLI.

First, configure the credentials:

```
aio config:set jwt-auth PATH_TO_CONFIG_JSON_FILE --file --json
```

Then, configure the private certificate:

```
aio config:set jwt-auth.jwt_private_key PATH_TO_PRIVATE_KEY_FILE --file
```

## Set Default Program

If you want to avoid passing the program ID flag repeatedly, you can configure it using:

```sh-session
$ aio config:set cloudmanager_programid PROGRAMID
```

For example

```sh-session
$ aio config:set cloudmanager_programid 4
```

# Commands
<!-- commands -->
* [`aio cloudmanager`](#aio-cloudmanager)
* [`aio cloudmanager:advance-current-execution PIPELINEID`](#aio-cloudmanageradvance-current-execution-pipelineid)
* [`aio cloudmanager:cancel-current-execution PIPELINEID`](#aio-cloudmanagercancel-current-execution-pipelineid)
* [`aio cloudmanager:delete-pipeline PIPELINEID`](#aio-cloudmanagerdelete-pipeline-pipelineid)
* [`aio cloudmanager:download-logs ENVIRONMENTID SERVICE NAME [DAYS]`](#aio-cloudmanagerdownload-logs-environmentid-service-name-days)
* [`aio cloudmanager:get-current-execution PIPELINEID`](#aio-cloudmanagerget-current-execution-pipelineid)
* [`aio cloudmanager:get-execution-step-details PIPELINEID EXECUTIONID`](#aio-cloudmanagerget-execution-step-details-pipelineid-executionid)
* [`aio cloudmanager:get-execution-step-log PIPELINEID EXECUTIONID ACTION`](#aio-cloudmanagerget-execution-step-log-pipelineid-executionid-action)
* [`aio cloudmanager:get-quality-gate-results PIPELINEID EXECUTIONID ACTION`](#aio-cloudmanagerget-quality-gate-results-pipelineid-executionid-action)
* [`aio cloudmanager:list-available-log-options ENVIRONMENTID`](#aio-cloudmanagerlist-available-log-options-environmentid)
* [`aio cloudmanager:list-current-executions`](#aio-cloudmanagerlist-current-executions)
* [`aio cloudmanager:list-environments`](#aio-cloudmanagerlist-environments)
* [`aio cloudmanager:list-pipelines`](#aio-cloudmanagerlist-pipelines)
* [`aio cloudmanager:list-programs`](#aio-cloudmanagerlist-programs)
* [`aio cloudmanager:start-execution PIPELINEID`](#aio-cloudmanagerstart-execution-pipelineid)
* [`aio cloudmanager:tail-log ENVIRONMENTID SERVICE NAME`](#aio-cloudmanagertail-log-environmentid-service-name)

## `aio cloudmanager`

interact with the Cloud Manager API to list, start, cancel, and inspect pipelines and executions.

```
USAGE
  $ aio cloudmanager

OPTIONS
  -r, --passphrase=passphrase  the passphrase for the private-key

EXAMPLES
  $ aio cloudmanager:list-programs
  $ aio cloudmanager:list-programs --enabledonly
  $ aio cloudmanager:list-pipelines
  $ aio cloudmanager:list-pipelines --programId=PROGRAM_ID
  $ aio cloudmanager:start-execution PIPELINE_ID
  $ aio cloudmanager:start-execution --programId=PROGRAM_ID PIPELINE_ID
  $ aio cloudmanager:list-current-executions
  $ aio cloudmanager:list-current-executions --programId=PROGRAM_ID
  $ aio cloudmanager:get-current-execution PIPELINE_ID
  $ aio cloudmanager:get-current-execution --programId=PROGRAM_ID PIPELINE_ID
  $ aio cloudmanager:get-quality-gate-results PIPELINE_ID [codeQuality|security|performance]
  $ aio cloudmanager:get-quality-gate-results --programId=PROGRAM_ID PIPELINE_ID [codeQuality|security|performance]
  $ aio cloudmanager:cancel-current-execution PIPELINE_ID
  $ aio cloudmanager:cancel-current-execution --programId=PROGRAM_ID PIPELINE_ID
  $ aio cloudmanager:advance-current-execution PIPELINE_ID
  $ aio cloudmanager:advance-current-execution --programId=PROGRAM_ID PIPELINE_ID
```

_See code: [src/commands/cloudmanager/index.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/index.js)_

## `aio cloudmanager:advance-current-execution PIPELINEID`

advance current pipeline execution either by overriding a waiting quality gate or advancing the approval step

```
USAGE
  $ aio cloudmanager:advance-current-execution PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/advance-current-execution.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/advance-current-execution.js)_

## `aio cloudmanager:cancel-current-execution PIPELINEID`

cancel current pipeline execution either by cancelling the current step, rejecting a waiting quality gate, or rejecting the approval step

```
USAGE
  $ aio cloudmanager:cancel-current-execution PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/cancel-current-execution.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/cancel-current-execution.js)_

## `aio cloudmanager:delete-pipeline PIPELINEID`

delete pipeline

```
USAGE
  $ aio cloudmanager:delete-pipeline PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/delete-pipeline.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/delete-pipeline.js)_

## `aio cloudmanager:download-logs ENVIRONMENTID SERVICE NAME [DAYS]`

lists available logs for an environment in a Cloud Manager program

```
USAGE
  $ aio cloudmanager:download-logs ENVIRONMENTID SERVICE NAME [DAYS]

ARGUMENTS
  ENVIRONMENTID  the environment id
  SERVICE        the service
  NAME           the log name
  DAYS           [default: 1] the number of days

OPTIONS
  -o, --outputDirectory=outputDirectory  the output directory. If not set, defaults to the current directory.

  -p, --programId=programId              the programId. if not specified, defaults to 'cloudmanager_programid' config
                                         value

  -r, --passphrase=passphrase            the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/download-logs.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/download-logs.js)_

## `aio cloudmanager:get-current-execution PIPELINEID`

get pipeline execution

```
USAGE
  $ aio cloudmanager:get-current-execution PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/get-current-execution.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/get-current-execution.js)_

## `aio cloudmanager:get-execution-step-details PIPELINEID EXECUTIONID`

get quality gate results

```
USAGE
  $ aio cloudmanager:get-execution-step-details PIPELINEID EXECUTIONID

ARGUMENTS
  PIPELINEID   the pipeline id
  EXECUTIONID  the execution id

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/get-execution-step-details.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/get-execution-step-details.js)_

## `aio cloudmanager:get-execution-step-log PIPELINEID EXECUTIONID ACTION`

get step log

```
USAGE
  $ aio cloudmanager:get-execution-step-log PIPELINEID EXECUTIONID ACTION

ARGUMENTS
  PIPELINEID   the pipeline id
  EXECUTIONID  the execution id
  ACTION       (build|codeQuality|devDeploy|stageDeploy|prodDeploy) the step action

OPTIONS
  -o, --output=output          the output file. If not set, uses standard output.
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/get-execution-step-log.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/get-execution-step-log.js)_

## `aio cloudmanager:get-quality-gate-results PIPELINEID EXECUTIONID ACTION`

get quality gate results

```
USAGE
  $ aio cloudmanager:get-quality-gate-results PIPELINEID EXECUTIONID ACTION

ARGUMENTS
  PIPELINEID   the pipeline id
  EXECUTIONID  the execution id
  ACTION       (codeQuality|security|performance) the step action

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/get-quality-gate-results.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/get-quality-gate-results.js)_

## `aio cloudmanager:list-available-log-options ENVIRONMENTID`

lists available log options for an environment in a Cloud Manager program

```
USAGE
  $ aio cloudmanager:list-available-log-options ENVIRONMENTID

ARGUMENTS
  ENVIRONMENTID  the environment id

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-available-log-options.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/list-available-log-options.js)_

## `aio cloudmanager:list-current-executions`

list running pipeline executions

```
USAGE
  $ aio cloudmanager:list-current-executions

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-current-executions.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/list-current-executions.js)_

## `aio cloudmanager:list-environments`

lists environments available in a Cloud Manager program

```
USAGE
  $ aio cloudmanager:list-environments

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-environments.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/list-environments.js)_

## `aio cloudmanager:list-pipelines`

lists pipelines available in a Cloud Manager program

```
USAGE
  $ aio cloudmanager:list-pipelines

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-pipelines.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/list-pipelines.js)_

## `aio cloudmanager:list-programs`

lists programs available in Cloud Manager

```
USAGE
  $ aio cloudmanager:list-programs

OPTIONS
  -e, --enabledonly            only output Cloud Manager-enabled programs
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-programs.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/list-programs.js)_

## `aio cloudmanager:start-execution PIPELINEID`

start pipeline execution

```
USAGE
  $ aio cloudmanager:start-execution PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/start-execution.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/start-execution.js)_

## `aio cloudmanager:tail-log ENVIRONMENTID SERVICE NAME`

lists available logs for an environment in a Cloud Manager program

```
USAGE
  $ aio cloudmanager:tail-log ENVIRONMENTID SERVICE NAME

ARGUMENTS
  ENVIRONMENTID  the environment id
  SERVICE        the service
  NAME           the log name

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key

ALIASES
  $ aio cloudmanager:tail-logs
```

_See code: [src/commands/cloudmanager/tail-log.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.2.1/src/commands/cloudmanager/tail-log.js)_
<!-- commandsstop -->

# Development

For development, it is useful to use `aio plugins:link` to link to a local clone of this repository rather than a specific npm module, e.g.

```
$ git clone git@github.com:adobe/aio-cli-plugin-cloudmanager.git
$ git checkout -B <your feature branch>
$ aio plugins:link
$ aio cloudmanager:<some command>
```

It may also be useful during development to point to a different API endpoint than https://cloudmanager.adobe.io, e.g. if you have a mock server you are using. For this you can
configure the `cloudmanager.base_url` configuration key:

```
$ aio config:set cloudmanager.base_url https://mydummyapiserver
```
