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
  $ aio cloudmanager:get-execution-step-details PIPELINE_ID EXECUTION_ID
  $ aio cloudmanager:get-execution-step-details --programId=PROGRAM_ID PIPELINE_ID EXECUTION_ID
  $ aio cloudmanager:get-execution-step-log PIPELINE_ID
  $ aio cloudmanager:get-execution-step-log --programId=PROGRAM_ID PIPELINE_ID 
  [build|codeQuality|devDeploy|stageDeploy|prodDeploy]
  $ aio cloudmanager:cancel-current-execution PIPELINE_ID
  $ aio cloudmanager:cancel-current-execution --programId=PROGRAM_ID PIPELINE_ID
  $ aio cloudmanager:advance-current-execution PIPELINE_ID
  $ aio cloudmanager:advance-current-execution --programId=PROGRAM_ID PIPELINE_ID
  $ aio cloudmanager:delete-pipeline PIPELINE_ID
  $ aio cloudmanager:delete-pipeline --programId=PROGRAM_ID PIPELINE_ID
  $ aio cloudmanager:update-pipeline PIPELINE_ID --branch=NEW_BRANCH
  $ aio cloudmanager:update-pipeline --programId=PROGRAM_ID PIPELINE_ID --branch=NEW_BRANCH
  $ aio cloudmanager:list-environments
  $ aio cloudmanager:list-environments --programId=PROGRAM_ID
  $ aio cloudmanager:list-available-log-options ENVIRONMENT_ID
  $ aio cloudmanager:list-available-log-options --programId=PROGRAM_ID ENVIRONMENT_ID
  $ aio cloudmanager:download-logs ENVIRONMENT_ID SERVICE NAME
  $ aio cloudmanager:download-logs ENVIRONMENT_ID SERVICE NAME DAYS
  $ aio cloudmanager:download-logs --programId=PROGRAM_ID ENVIRONMENT_ID SERVICE NAME DAYS
  $ aio cloudmanager:tail-log ENVIRONMENT_ID SERVICE NAME
  $ aio cloudmanager:tail-log --programId=PROGRAM_ID ENVIRONMENT_ID SERVICE NAME
```

_See code: [src/commands/cloudmanager/index.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/0.5.1/src/commands/cloudmanager/index.js)_
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
