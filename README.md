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

# Installation

```sh-session
$ aio plugin:install @adobe/aio-cli-plugin-cloudmanager
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
  "token_exchange_url": "https://ims-na1.adobelogin.com/ims/exchange/jwt",
  "console_get_orgs_url":"https://api.adobe.io/console/organizations",
  "console_get_namespaces_url":"https://api.adobe.io/runtime/admin/namespaces/"
}
```

The last bit you need to have at hand is the private certificate you've used to create the integration; you need the private key, not the public one. Now, you are ready to configure the `aio` CLI.

First, configure the credentials:

```
aio config:set jwt-auth PATH_TO_CONFIG_JSON_FILE --file --mime-type=application/json
```

Then, configure the private certificate:

```
aio config:set jwt-auth.jwt_private_key PATH_TO_PRIVATE_KEY_FILE --file --mime-type=application/x-pem-file
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
* [`./bin/run cloudmanager:get-current-execution PIPELINEID`](#bin-run-cloudmanagerget-current-execution-pipelineid)
* [`./bin/run cloudmanager:list-current-executions`](#bin-run-cloudmanagerlist-current-executions)
* [`./bin/run cloudmanager:list-pipelines`](#bin-run-cloudmanagerlist-pipelines)
* [`./bin/run cloudmanager:list-programs`](#bin-run-cloudmanagerlist-programs)
* [`./bin/run cloudmanager:start-execution PIPELINEID`](#bin-run-cloudmanagerstart-execution-pipelineid)

## `./bin/run cloudmanager:get-current-execution PIPELINEID`

get pipeline execution

```
USAGE
  $ ./bin/run cloudmanager:get-current-execution PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/get-current-execution.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/v0.0.1/src/commands/cloudmanager/get-current-execution.js)_

## `./bin/run cloudmanager:list-current-executions`

list running pipeline executions

```
USAGE
  $ ./bin/run cloudmanager:list-current-executions

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-current-executions.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/v0.0.1/src/commands/cloudmanager/list-current-executions.js)_

## `./bin/run cloudmanager:list-pipelines`

lists pipelines available in a Cloud Manager program

```
USAGE
  $ ./bin/run cloudmanager:list-pipelines

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-pipelines.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/v0.0.1/src/commands/cloudmanager/list-pipelines.js)_

## `./bin/run cloudmanager:list-programs`

lists programs available in Cloud Manager

```
USAGE
  $ ./bin/run cloudmanager:list-programs

OPTIONS
  -e, --enabledonly            only output Cloud Manager-enabled programs
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/list-programs.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/v0.0.1/src/commands/cloudmanager/list-programs.js)_

## `./bin/run cloudmanager:start-execution PIPELINEID`

start pipeline execution

```
USAGE
  $ ./bin/run cloudmanager:start-execution PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId    the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -r, --passphrase=passphrase  the passphrase for the private-key
```

_See code: [src/commands/cloudmanager/start-execution.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/v0.0.1/src/commands/cloudmanager/start-execution.js)_
<!-- commandsstop -->
