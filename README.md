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
    * 12.x -- 12.0.0 or higher.
    * 14.x -- 14.0.0 or higher.
    * 16.x -- currently incompatible due to lack of support from aio-cli.
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

This CLI supports two modes of authentication: Browser-based and Service Account. The key distinction between these is that when using browser-based authentication, the API calls made through the CLI are done as *you* and use your permissions whereas when using Service Account authentication, a separate service account is needed and that account may have separate permissions than you personally would when logging into the Cloud Manager UI. In general, Service Account authentication should be primarily used in a scripting context where there is no opportunity to authenticate with a browser, although there may be other situations where the Service Account method is more appropriate even for interactive usage.

### Browser-Based Authentication

Browser-based authentication starts by running this command

```
aio auth:login
```

More options for this command are available and are described [here](https://github.com/adobe/aio-cli-plugin-auth#aio-authlogin).

This command will open a browser window in which you will authenticate using your Adobe Identity.

In addition to the authentication, the CLI needs to know the Adobe Organization Identifer (OrgId). There are two ways to do this:

1. By running `aio cloudmanager:org:select` and use the interactive menu. By default this will store the selected organization in the current working directory, but the selection can also be stored globally by passing `--global` (see full command documentation below)
2. By setting the identifier as the configuration `cloudmanager_orgid`, i.e. `aio config:set cloudmanager_orgid <myorgid>`

Alternatively, if you have selected an organization using `aio console:org:select`, that organization will be used.

### Service Account Authentication

To use a service account authentication, an integration must be created in the [Adobe I/O Console](https://console.adobe.io) which has the Cloud Manager service. You may also add other services to this integration if you want to use other Adobe I/O CLI plugins.

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

> More information on setting up a Cloud Manager integration in the Adobe I/O console can be found [here](https://www.adobe.io/experience-cloud/cloud-manager/guides/getting-started/create-api-integration/).

> More information on IMS contexts can be found in the documentation of [@adobe/aio-lib-ims](https://github.com/adobe/aio-lib-ims).

#### Old Service Account Configuration Migration

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

## Proxy Support

When used with [Adobe I/O CLI](https://github.com/adobe/aio-cli) 8.2.0 or higher, this plugin can support an HTTP(S) Proxy. See [the Adobe I/O CLI release announcement](https://github.com/adobe/aio-cli/releases/tag/8.2.0) for more information.

## Exit Codes

Primarily for scripting application purposes, the following exit codes are used:

* 1 - A generic error has occurred
* 2 - A configuration error has occurred
* 3 - A validation error with the supplied flags or arguments has occurred
* 10 - An error in IMS authentication has occurred
* 30 - An error emanating from the Cloud Manager SDK has occurred

## Reporting Issues

In general, issues with this plugin should be reported in this project via GitHub issues using one of the provided issue templates. Errors emanating from the Cloud Manager API (i.e. those with exit code 30 as described above) should be reported to Adobe support. The error output will generally contain the URL, response code, and other debug information that is necessary to identify and resolve the issue.

# Commands
<!-- commands -->

<!-- commandsstop -->

# Permissions

Information about Cloud Manager API permissions can be found on https://www.adobe.io/experience-cloud/cloud-manager/guides/getting-started/permissions/. To see the
permissions required for a specific command, you can also run any command with the flag `--permissions`, e.g.

```
$ aio cloudmanager:current-execution:advance --permissions
To execute cloudmanager:current-execution:advance, one of the following product profiles is required: Business Owner, Deployment Manager, Program Manager
```

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

## End-to-End (E2E) Testing

To execute the end-to-end tests, create a file named `.env` in the project directory and configure it with your JWT credentials:

```
E2E_CLIENT_ID=<CLIENT ID>
E2E_CLIENT_SECRET=<CLIENT SECRET>
E2E_TA_EMAIL=<TECHNICAL ACCOUNT EMAIL>
E2E_IMS_ORG_ID=<ORG ID>
E2E_PRIVATE_KEY_B64=<Base64-Encoded PRIVATE KEY>
```

Note that the private key **must** be base64 encoded, e.g. by running

```
$ base64 -i private.key
```

With this in place the end-to-end tests can be run with

```
npm run e2e
```

# Standalone Use

In rare circumstances, it may be useful to run this plugin separately from the Adobe I/O CLI. To do this, install this npm module directly, i.e.

```
npm install -g @adobe/aio-cli-plugin-cloudmanager
```

This will create an executable named `adobe-cloudmanager-cli` on your `PATH`. The arguments to this executable are the same as when used through Adobe I/O CLI. The following caveats apply:

* You must still use Adobe I/O CLI for all configuration setting.
* The help messages displayed will show the command as `aio` not `adobe-cloudmanager-cli`.
