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
[![Build Status](https://github.com/adobe/aio-cli-plugin-cloudmanager/workflows/CI%20Build/badge.svg?branch=main)](https://github.com/adobe/aio-cli-plugin-cloudmanager/actions?query=workflow%3A%22CI+Build%22)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/adobe/aio-cli-plugin-cloudmanager/master.svg?style=flat-square)](https://codecov.io/gh/adobe/aio-cli-plugin-cloudmanager/)
[![Known Vulnerabilities](https://snyk.io/test/github/adobe/aio-cli-plugin-cloudmanager/badge.svg)](https://snyk.io/test/github/adobe/aio-cli-plugin-cloudmanager)



# aio-cli-plugin-cloudmanager
Cloud Manager Plugin for the [Adobe I/O CLI](https://github.com/adobe/aio-cli)

# Requirements

* [Adobe I/O CLI](https://github.com/adobe/aio-cli)
* Node.js version compatibility:
    * 10.x -- 10.22.0 or higher.
    * 12.x -- 12.0.0 or higher.
    * 14.x -- currently incompatible due to lack of support from aio-cli.
    * Use with odd Node versions is *not* recommended.

> Although not recommended for general use, it is possible to use this plugin outside of the Adobe I/O CLI. See [Standalone Use](#standalone-use) below.

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

After you've created the integration, create a `config.json` file on your computer and navigate to the integration Overview page. From this page, copy the values into the file as described below.

```
//config.json 
{
  "client_id": "value from your CLI integration (String)",
  "client_secret": "value from your CLI integration (String)",
  "technical_account_id": "value from your CLI integration (String)",
  "ims_org_id": "value from your CLI integration (String)",
  "meta_scopes": [
    "ent_cloudmgr_sdk"
  ]
}
```

The last bit you need to have at hand is the private certificate you've used to create the integration; you need the private key, not the public one. Now, you are ready to configure the `aio` CLI.

First, configure the credentials:

```
aio config:set ims.contexts.aio-cli-plugin-cloudmanager PATH_TO_CONFIG_JSON_FILE --file --json
```

Then, configure the private certificate:

```
aio config:set ims.contexts.aio-cli-plugin-cloudmanager.private_key PATH_TO_PRIVATE_KEY_FILE --file
```

> More information on setting up a Cloud Manager integration in the Adobe I/O console can be found [here](https://www.adobe.io/apis/experiencecloud/cloud-manager/docs.html#!AdobeDocs/cloudmanager-api-docs/master/create-api-integration.md).

> More information on IMS contexts can be found in the documentation of [@adobe/aio-lib-ims](https://github.com/adobe/aio-lib-ims).

### Old Configuration Migration

Previous versions of this plugin used the configuration key `jwt-auth`. Upon execution, the plugin will automatically migrate these configurations. It will **not** delete the old configuration however and you may want to run

```
aio config:del jwt-auth
```

To clean up any dangling configuration unless it is necessary for other aio plugins.

This migration process is silent by default. You can enable debug logging by running any command where the environment variable `LOG_LEVEL` is set to `debug`, e.g.

```
LOG_LEVEL=debug aio cloudmanager:list-programs
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

## Set Default Environment

If you want to avoid passing the environment ID argument repeatedly, you can configure it using:

```sh-session
$ aio config:set cloudmanager_environmentid ENVIRONMENTID
```

For example

```sh-session
$ aio config:set cloudmanager_environmentid 7
```

> This only works for commands where the environmentId is the **first** argument.

# Commands
<!-- commands -->
* [`aio cloudmanager:current-execution:advance PIPELINEID`](#aio-cloudmanagercurrent-executionadvance-pipelineid)
* [`aio cloudmanager:current-execution:cancel PIPELINEID`](#aio-cloudmanagercurrent-executioncancel-pipelineid)
* [`aio cloudmanager:current-execution:get PIPELINEID`](#aio-cloudmanagercurrent-executionget-pipelineid)
* [`aio cloudmanager:environment:bind-ip-allowlist ENVIRONMENTID IPALLOWLISTID SERVICE`](#aio-cloudmanagerenvironmentbind-ip-allowlist-environmentid-ipallowlistid-service)
* [`aio cloudmanager:environment:delete ENVIRONMENTID`](#aio-cloudmanagerenvironmentdelete-environmentid)
* [`aio cloudmanager:environment:download-logs ENVIRONMENTID SERVICE NAME [DAYS]`](#aio-cloudmanagerenvironmentdownload-logs-environmentid-service-name-days)
* [`aio cloudmanager:environment:list-available-log-options ENVIRONMENTID`](#aio-cloudmanagerenvironmentlist-available-log-options-environmentid)
* [`aio cloudmanager:environment:list-ip-allowlist-bindings ENVIRONMENTID`](#aio-cloudmanagerenvironmentlist-ip-allowlist-bindings-environmentid)
* [`aio cloudmanager:environment:list-variables ENVIRONMENTID`](#aio-cloudmanagerenvironmentlist-variables-environmentid)
* [`aio cloudmanager:environment:open-developer-console ENVIRONMENTID`](#aio-cloudmanagerenvironmentopen-developer-console-environmentid)
* [`aio cloudmanager:environment:set-variables ENVIRONMENTID`](#aio-cloudmanagerenvironmentset-variables-environmentid)
* [`aio cloudmanager:environment:tail-log ENVIRONMENTID SERVICE NAME`](#aio-cloudmanagerenvironmenttail-log-environmentid-service-name)
* [`aio cloudmanager:environment:unbind-ip-allowlist ENVIRONMENTID IPALLOWLISTID SERVICE`](#aio-cloudmanagerenvironmentunbind-ip-allowlist-environmentid-ipallowlistid-service)
* [`aio cloudmanager:execution:get-quality-gate-results PIPELINEID EXECUTIONID ACTION`](#aio-cloudmanagerexecutionget-quality-gate-results-pipelineid-executionid-action)
* [`aio cloudmanager:execution:get-step-details PIPELINEID EXECUTIONID`](#aio-cloudmanagerexecutionget-step-details-pipelineid-executionid)
* [`aio cloudmanager:execution:get-step-log PIPELINEID EXECUTIONID ACTION`](#aio-cloudmanagerexecutionget-step-log-pipelineid-executionid-action)
* [`aio cloudmanager:ip-allowlist:bind IPALLOWLISTID ENVIRONMENTID SERVICE`](#aio-cloudmanagerip-allowlistbind-ipallowlistid-environmentid-service)
* [`aio cloudmanager:ip-allowlist:create NAME`](#aio-cloudmanagerip-allowlistcreate-name)
* [`aio cloudmanager:ip-allowlist:delete IPALLOWLISTID`](#aio-cloudmanagerip-allowlistdelete-ipallowlistid)
* [`aio cloudmanager:ip-allowlist:get-binding-details IPALLOWLISTID`](#aio-cloudmanagerip-allowlistget-binding-details-ipallowlistid)
* [`aio cloudmanager:ip-allowlist:unbind IPALLOWLISTID ENVIRONMENTID SERVICE`](#aio-cloudmanagerip-allowlistunbind-ipallowlistid-environmentid-service)
* [`aio cloudmanager:ip-allowlist:update IPALLOWLISTID`](#aio-cloudmanagerip-allowlistupdate-ipallowlistid)
* [`aio cloudmanager:list-programs`](#aio-cloudmanagerlist-programs)
* [`aio cloudmanager:pipeline:create-execution PIPELINEID`](#aio-cloudmanagerpipelinecreate-execution-pipelineid)
* [`aio cloudmanager:pipeline:delete PIPELINEID`](#aio-cloudmanagerpipelinedelete-pipelineid)
* [`aio cloudmanager:pipeline:list-executions PIPELINEID`](#aio-cloudmanagerpipelinelist-executions-pipelineid)
* [`aio cloudmanager:pipeline:list-variables PIPELINEID`](#aio-cloudmanagerpipelinelist-variables-pipelineid)
* [`aio cloudmanager:pipeline:set-variables PIPELINEID`](#aio-cloudmanagerpipelineset-variables-pipelineid)
* [`aio cloudmanager:pipeline:update PIPELINEID`](#aio-cloudmanagerpipelineupdate-pipelineid)
* [`aio cloudmanager:program:delete PROGRAMID`](#aio-cloudmanagerprogramdelete-programid)
* [`aio cloudmanager:program:list-current-executions`](#aio-cloudmanagerprogramlist-current-executions)
* [`aio cloudmanager:program:list-environments`](#aio-cloudmanagerprogramlist-environments)
* [`aio cloudmanager:program:list-ip-allowlists`](#aio-cloudmanagerprogramlist-ip-allowlists)
* [`aio cloudmanager:program:list-pipelines`](#aio-cloudmanagerprogramlist-pipelines)

## `aio cloudmanager:current-execution:advance PIPELINEID`

advance current pipeline execution either by overriding a waiting quality gate or advancing the approval step

```
USAGE
  $ aio cloudmanager:current-execution:advance PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:advance-current-execution
```

_See code: [src/commands/cloudmanager/current-execution/advance.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/current-execution/advance.js)_

## `aio cloudmanager:current-execution:cancel PIPELINEID`

cancel current pipeline execution either by cancelling the current step, rejecting a waiting quality gate, or rejecting the approval step

```
USAGE
  $ aio cloudmanager:current-execution:cancel PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:cancel-current-execution
```

_See code: [src/commands/cloudmanager/current-execution/cancel.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/current-execution/cancel.js)_

## `aio cloudmanager:current-execution:get PIPELINEID`

get pipeline execution

```
USAGE
  $ aio cloudmanager:current-execution:get PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:get-current-execution
```

_See code: [src/commands/cloudmanager/current-execution/get.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/current-execution/get.js)_

## `aio cloudmanager:environment:bind-ip-allowlist ENVIRONMENTID IPALLOWLISTID SERVICE`

Bind an IP Allowlist to an environment

```
USAGE
  $ aio cloudmanager:environment:bind-ip-allowlist ENVIRONMENTID IPALLOWLISTID SERVICE

ARGUMENTS
  ENVIRONMENTID  the environment id
  IPALLOWLISTID  the IP allowlist id
  SERVICE        (author|publish) the service name

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/environment/bind-ip-allowlist.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/environment/bind-ip-allowlist.js)_

## `aio cloudmanager:environment:delete ENVIRONMENTID`

delete environment

```
USAGE
  $ aio cloudmanager:environment:delete ENVIRONMENTID

ARGUMENTS
  ENVIRONMENTID  the environment id

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:delete-environment
```

_See code: [src/commands/cloudmanager/environment/delete.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/environment/delete.js)_

## `aio cloudmanager:environment:download-logs ENVIRONMENTID SERVICE NAME [DAYS]`

downloads log files for the specified environment, service and log name for one or more days

```
USAGE
  $ aio cloudmanager:environment:download-logs ENVIRONMENTID SERVICE NAME [DAYS]

ARGUMENTS
  ENVIRONMENTID  the environment id
  SERVICE        the service
  NAME           the log name
  DAYS           [default: 1] the number of days

OPTIONS
  -o, --outputDirectory=outputDirectory  the output directory. If not set, defaults to the current directory.

  -p, --programId=programId              the programId. if not specified, defaults to 'cloudmanager_programid' config
                                         value

  --imsContextName=imsContextName        the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:download-logs
```

_See code: [src/commands/cloudmanager/environment/download-logs.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/environment/download-logs.js)_

## `aio cloudmanager:environment:list-available-log-options ENVIRONMENTID`

lists available log options for an environment in a Cloud Manager program

```
USAGE
  $ aio cloudmanager:environment:list-available-log-options ENVIRONMENTID

ARGUMENTS
  ENVIRONMENTID  the environment id

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:list-available-log-options
```

_See code: [src/commands/cloudmanager/environment/list-available-log-options.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/environment/list-available-log-options.js)_

## `aio cloudmanager:environment:list-ip-allowlist-bindings ENVIRONMENTID`

lists IP Allowlists bound to an environment

```
USAGE
  $ aio cloudmanager:environment:list-ip-allowlist-bindings ENVIRONMENTID

ARGUMENTS
  ENVIRONMENTID  the environment id

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:environment:list-bound-ip-allowlists
```

_See code: [src/commands/cloudmanager/environment/list-ip-allowlist-bindings.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/environment/list-ip-allowlist-bindings.js)_

## `aio cloudmanager:environment:list-variables ENVIRONMENTID`

lists variables set on an environment

```
USAGE
  $ aio cloudmanager:environment:list-variables ENVIRONMENTID

ARGUMENTS
  ENVIRONMENTID  the environment id

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:list-environment-variables
```

_See code: [src/commands/cloudmanager/environment/list-variables.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/environment/list-variables.js)_

## `aio cloudmanager:environment:open-developer-console ENVIRONMENTID`

opens the Developer Console, if available, in a browser

```
USAGE
  $ aio cloudmanager:environment:open-developer-console ENVIRONMENTID

ARGUMENTS
  ENVIRONMENTID  the environment id

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:open-developer-console
```

_See code: [src/commands/cloudmanager/environment/open-developer-console.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/environment/open-developer-console.js)_

## `aio cloudmanager:environment:set-variables ENVIRONMENTID`

sets variables set on an environment. These are runtime variables available to components running inside the runtime environment. Use set-pipeline-variables to set build-time variables on a pipeline.

```
USAGE
  $ aio cloudmanager:environment:set-variables ENVIRONMENTID

ARGUMENTS
  ENVIRONMENTID  the environment id

OPTIONS
  -d, --delete=delete              variables/secrets to delete
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -s, --secret=secret              secret values in KEY VALUE format
  -v, --variable=variable          variable values in KEY VALUE format
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

  --jsonFile=jsonFile              if set, read variables from a JSON array provided as a file; variables set through
                                   --variable or --secret flag will take precedence

  --jsonStdin                      if set, read variables from a JSON array provided as standard input; variables set
                                   through --variable or --secret flag will take precedence

ALIASES
  $ aio cloudmanager:set-environment-variables
```

_See code: [src/commands/cloudmanager/environment/set-variables.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/environment/set-variables.js)_

## `aio cloudmanager:environment:tail-log ENVIRONMENTID SERVICE NAME`

outputs a stream of log data for the specified environment, service and log name

```
USAGE
  $ aio cloudmanager:environment:tail-log ENVIRONMENTID SERVICE NAME

ARGUMENTS
  ENVIRONMENTID  the environment id
  SERVICE        the service
  NAME           the log name

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:tail-logs
  $ aio cloudmanager:tail-log
```

_See code: [src/commands/cloudmanager/environment/tail-log.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/environment/tail-log.js)_

## `aio cloudmanager:environment:unbind-ip-allowlist ENVIRONMENTID IPALLOWLISTID SERVICE`

Bind an IP Allowlist to an environment

```
USAGE
  $ aio cloudmanager:environment:unbind-ip-allowlist ENVIRONMENTID IPALLOWLISTID SERVICE

ARGUMENTS
  ENVIRONMENTID  the environment id
  IPALLOWLISTID  the IP allowlist id
  SERVICE        (author|publish) the service name

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/environment/unbind-ip-allowlist.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/environment/unbind-ip-allowlist.js)_

## `aio cloudmanager:execution:get-quality-gate-results PIPELINEID EXECUTIONID ACTION`

get quality gate results

```
USAGE
  $ aio cloudmanager:execution:get-quality-gate-results PIPELINEID EXECUTIONID ACTION

ARGUMENTS
  PIPELINEID   the pipeline id
  EXECUTIONID  the execution id
  ACTION       (codeQuality|security|performance|contentAudit|experienceAudit) the step action

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:get-quality-gate-results
```

_See code: [src/commands/cloudmanager/execution/get-quality-gate-results.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/execution/get-quality-gate-results.js)_

## `aio cloudmanager:execution:get-step-details PIPELINEID EXECUTIONID`

get execution step details

```
USAGE
  $ aio cloudmanager:execution:get-step-details PIPELINEID EXECUTIONID

ARGUMENTS
  PIPELINEID   the pipeline id
  EXECUTIONID  the execution id

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:get-execution-step-details
```

_See code: [src/commands/cloudmanager/execution/get-step-details.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/execution/get-step-details.js)_

## `aio cloudmanager:execution:get-step-log PIPELINEID EXECUTIONID ACTION`

get step log

```
USAGE
  $ aio cloudmanager:execution:get-step-log PIPELINEID EXECUTIONID ACTION

ARGUMENTS
  PIPELINEID   the pipeline id
  EXECUTIONID  the execution id
  ACTION       (build|codeQuality|devDeploy|stageDeploy|prodDeploy|buildImage) the step action

OPTIONS
  -f, --file=file                  the alternative log file name. currently only `sonarLogFile` is available (for the
                                   codeQuality step)

  -o, --output=output              the output file. If not set, uses standard output.

  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value

  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:get-execution-step-log
```

_See code: [src/commands/cloudmanager/execution/get-step-log.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/execution/get-step-log.js)_

## `aio cloudmanager:ip-allowlist:bind IPALLOWLISTID ENVIRONMENTID SERVICE`

Bind an IP Allowlist to an environment

```
USAGE
  $ aio cloudmanager:ip-allowlist:bind IPALLOWLISTID ENVIRONMENTID SERVICE

ARGUMENTS
  IPALLOWLISTID  the IP allowlist id
  ENVIRONMENTID  the environment id
  SERVICE        (author|publish) the service name

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/ip-allowlist/bind.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/ip-allowlist/bind.js)_

## `aio cloudmanager:ip-allowlist:create NAME`

Create an IP Allowlist

```
USAGE
  $ aio cloudmanager:ip-allowlist:create NAME

ARGUMENTS
  NAME  the name to create

OPTIONS
  -c, --cidr=cidr                  (required) a CIDR block
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/ip-allowlist/create.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/ip-allowlist/create.js)_

## `aio cloudmanager:ip-allowlist:delete IPALLOWLISTID`

Delete an IP Allowlist

```
USAGE
  $ aio cloudmanager:ip-allowlist:delete IPALLOWLISTID

ARGUMENTS
  IPALLOWLISTID  the id of the allowlist to delete

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/ip-allowlist/delete.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/ip-allowlist/delete.js)_

## `aio cloudmanager:ip-allowlist:get-binding-details IPALLOWLISTID`

list detailed information on IP Allowlist Bindings

```
USAGE
  $ aio cloudmanager:ip-allowlist:get-binding-details IPALLOWLISTID

ARGUMENTS
  IPALLOWLISTID  the id of the allowlist

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/ip-allowlist/get-binding-details.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/ip-allowlist/get-binding-details.js)_

## `aio cloudmanager:ip-allowlist:unbind IPALLOWLISTID ENVIRONMENTID SERVICE`

Remove an IP Allowlist binding

```
USAGE
  $ aio cloudmanager:ip-allowlist:unbind IPALLOWLISTID ENVIRONMENTID SERVICE

ARGUMENTS
  IPALLOWLISTID  the IP allowlist id
  ENVIRONMENTID  the environment id
  SERVICE        (author|publish) the service name

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/ip-allowlist/unbind.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/ip-allowlist/unbind.js)_

## `aio cloudmanager:ip-allowlist:update IPALLOWLISTID`

Update an IP Allowlist by replacing the CIDR blocks

```
USAGE
  $ aio cloudmanager:ip-allowlist:update IPALLOWLISTID

ARGUMENTS
  IPALLOWLISTID  the id of the allowlist to update

OPTIONS
  -c, --cidr=cidr                  (required) a CIDR block
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/ip-allowlist/update.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/ip-allowlist/update.js)_

## `aio cloudmanager:list-programs`

lists programs available in Cloud Manager

```
USAGE
  $ aio cloudmanager:list-programs

OPTIONS
  -e, --enabledonly                only output Cloud Manager-enabled programs
  -j, --json                       output in json format
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/list-programs.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/list-programs.js)_

## `aio cloudmanager:pipeline:create-execution PIPELINEID`

start pipeline execution

```
USAGE
  $ aio cloudmanager:pipeline:create-execution PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:create-execution
  $ aio cloudmanager:start-execution
```

_See code: [src/commands/cloudmanager/pipeline/create-execution.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/pipeline/create-execution.js)_

## `aio cloudmanager:pipeline:delete PIPELINEID`

delete pipeline

```
USAGE
  $ aio cloudmanager:pipeline:delete PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:delete-pipeline
```

_See code: [src/commands/cloudmanager/pipeline/delete.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/pipeline/delete.js)_

## `aio cloudmanager:pipeline:list-executions PIPELINEID`

list pipeline executions

```
USAGE
  $ aio cloudmanager:pipeline:list-executions PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -j, --json                       output in json format
  -l, --limit=limit                Specify number of executions to return (defaults to 20)
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/pipeline/list-executions.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/pipeline/list-executions.js)_

## `aio cloudmanager:pipeline:list-variables PIPELINEID`

lists variables set on an pipeline

```
USAGE
  $ aio cloudmanager:pipeline:list-variables PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:list-pipeline-variables
```

_See code: [src/commands/cloudmanager/pipeline/list-variables.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/pipeline/list-variables.js)_

## `aio cloudmanager:pipeline:set-variables PIPELINEID`

sets variables set on a pipeline. These are build-time variables available during the build process. Use set-environment-variables to set runtime variables on a environment.

```
USAGE
  $ aio cloudmanager:pipeline:set-variables PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -d, --delete=delete              variables/secrets to delete
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -s, --secret=secret              secret values in KEY VALUE format
  -v, --variable=variable          variable values in KEY VALUE format
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

  --jsonFile=jsonFile              if set, read variables from a JSON array provided as a file; variables set through
                                   --variable or --secret flag will take precedence

  --jsonStdin                      if set, read variables from a JSON array provided as standard input; variables set
                                   through --variable or --secret flag will take precedence

ALIASES
  $ aio cloudmanager:set-pipeline-variables
```

_See code: [src/commands/cloudmanager/pipeline/set-variables.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/pipeline/set-variables.js)_

## `aio cloudmanager:pipeline:update PIPELINEID`

update pipeline

```
USAGE
  $ aio cloudmanager:pipeline:update PIPELINEID

ARGUMENTS
  PIPELINEID  the pipeline id

OPTIONS
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  --branch=branch                  the new branch
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
  --repositoryId=repositoryId      the new repositoryId
  --tag=tag                        the new tag

ALIASES
  $ aio cloudmanager:update-pipeline
```

_See code: [src/commands/cloudmanager/pipeline/update.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/pipeline/update.js)_

## `aio cloudmanager:program:delete PROGRAMID`

delete program

```
USAGE
  $ aio cloudmanager:program:delete PROGRAMID

ARGUMENTS
  PROGRAMID  the program id

OPTIONS
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:delete-program
```

_See code: [src/commands/cloudmanager/program/delete.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/program/delete.js)_

## `aio cloudmanager:program:list-current-executions`

list running pipeline executions

```
USAGE
  $ aio cloudmanager:program:list-current-executions

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:list-current-executions
```

_See code: [src/commands/cloudmanager/program/list-current-executions.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/program/list-current-executions.js)_

## `aio cloudmanager:program:list-environments`

lists environments available in a Cloud Manager program

```
USAGE
  $ aio cloudmanager:program:list-environments

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:list-environments
```

_See code: [src/commands/cloudmanager/program/list-environments.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/program/list-environments.js)_

## `aio cloudmanager:program:list-ip-allowlists`

lists IP Allowlists available in a Cloud Manager program

```
USAGE
  $ aio cloudmanager:program:list-ip-allowlists

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager
```

_See code: [src/commands/cloudmanager/program/list-ip-allowlists.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/program/list-ip-allowlists.js)_

## `aio cloudmanager:program:list-pipelines`

lists pipelines available in a Cloud Manager program

```
USAGE
  $ aio cloudmanager:program:list-pipelines

OPTIONS
  -j, --json                       output in json format
  -p, --programId=programId        the programId. if not specified, defaults to 'cloudmanager_programid' config value
  -y, --yaml                       output in yaml format
  --imsContextName=imsContextName  the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager

ALIASES
  $ aio cloudmanager:list-pipelines
```

_See code: [src/commands/cloudmanager/program/list-pipelines.js](https://github.com/adobe/aio-cli-plugin-cloudmanager/blob/1.3.0/src/commands/cloudmanager/program/list-pipelines.js)_
<!-- commandsstop -->

# Variables From Standard Input

The `environment:set-variables` and `pipeline:set-variables` commands allow for variables to be passed both as flags to the command and as a JSON array provided as standard input or as a file. The objects in this array are expected to have a `name`, `value`, and `type` keys following the same syntax as the Cloud Manager API. Deleting a variable can be done by passing an empty `value`. For example, given a file named `variables.json` that contains this:

```
[
  {
    "name" : "MY_VARIABLE",
    "value" : "something",
    "type" : "string"
  },
  {
    "name" : "MY_SECRET_VARIABLE",
    "value" : "shhhh",
    "type" : "secretString"
  }
]
```

This can be passed to the `pipeline:set-variables` command using a shell command of

```
$ cat variables.json | aio cloudmanager:pipeline:set-variables 1 --jsonStdin
```

Or

```
$ aio cloudmanager:pipeline:set-variables 1 --jsonFile=variables.json
```

# Alternative Flag Inputs

Adobe I/O CLI is based on [oclif](https://oclif.io/) which supports a variety of patterns for passing flags to commands. See [oclif documentation](https://oclif.io/docs/flags#alternative-flag-inputs) for more information.

# Development

For development, it is useful to use `aio plugins:link` to link to a local clone of this repository rather than a specific npm module, e.g.

```
$ git clone git@github.com:adobe/aio-cli-plugin-cloudmanager.git
$ git checkout -B <your feature branch>
$ npm install
$ aio plugins:link
$ aio cloudmanager:<some command>
```

It may also be useful during development to point to a different API endpoint than https://cloudmanager.adobe.io, e.g. if you have a mock server you are using. For this you can
configure the `cloudmanager.base_url` configuration key:

```
$ aio config:set cloudmanager.base_url https://mydummyapiserver
```

## Using an Unreleased aio-lib-cloudmanager

When new functions are added to [aio-lib-cloudmanager](https://github.com/adobe/aio-lib-cloudmanager), it may be useful to use a local copy of this library during the development of this plugin. This can be done using [npm-link](https://docs.npmjs.com/cli/v6/commands/npm-link) as a two-step process:

First, in the `aio-lib-cloudmanager` clone directory, run

```
npm link
```

And then in the clone of this project, run

```
npm link @adobe/aio-lib-cloudmanager
```

To switch back to the released version of `aio-lib-cloudmanager` run

```
npm unlink --no-save @adobe/aio-lib-cloudmanager
npm install
```

Of course this should not replace proper unit testing.

# Standalone Use

In rare circumstances, it may be useful to run this plugin separately from the Adobe I/O CLI. To do this, install this npm module directly, i.e.

```
npm install -g @adobe/aio-cli-plugin-cloudmanager
```

This will create an executable named `adobe-cloudmanager-cli` on your `PATH`. The arguments to this executable are the same as when used through Adobe I/O CLI. The following caveats apply:

* You must still use Adobe I/O CLI for all configuration setting.
* The help messages displayed will show the command as `aio` not `adobe-cloudmanager-cli`.
