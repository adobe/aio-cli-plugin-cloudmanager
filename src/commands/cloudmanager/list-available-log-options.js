/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { Command } = require('@oclif/command')
const { accessToken: getAccessToken } = require('@adobe/aio-cli-plugin-jwt-auth')
const { getApiKey, getBaseUrl, getOrgId, getProgramId, sanitizeEnvironmentId, getOutputFormat } = require('../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const { init } = require('@adobe/aio-lib-cloudmanager')
const commonFlags = require('../../common-flags')

async function _listAvailableLogOptions (programId, environmentId, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  return sdk.listAvailableLogOptions(programId, environmentId)
}

class ListAvailableLogOptionsCommand extends Command {
  async run () {
    const { args, flags } = this.parse(ListAvailableLogOptionsCommand)

    const programId = await getProgramId(flags)

    const environmentId = sanitizeEnvironmentId(args.environmentId)

    let result

    try {
      result = await this.listAvailableLogOptions(programId, environmentId, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    if (result.length > 0) {
      cli.table(result, {
        id: {
          header: 'Environment Id',
          get: () => environmentId
        },
        service: {},
        name: {}
      }, {
        printLine: this.log,
        output: getOutputFormat(flags)
      })
    } else {
      cli.info(`No log options are available for environmentId ${environmentId}`)
    }

    return result
  }

  async listAvailableLogOptions (programId, environmentId, passphrase = null) {
    return _listAvailableLogOptions(programId, environmentId, passphrase)
  }
}

ListAvailableLogOptionsCommand.description = 'lists available log options for an environment in a Cloud Manager program'

ListAvailableLogOptionsCommand.args = [
  { name: 'environmentId', required: true, description: 'the environment id' }
]

ListAvailableLogOptionsCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId
}

module.exports = ListAvailableLogOptionsCommand
