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
const { getApiKey, getBaseUrl, getOrgId, getProgramId, getOutputFormat } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const { init } = require('@adobe/aio-lib-cloudmanager')
const commonFlags = require('../../../common-flags')

async function _listPipelines (programId, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  return sdk.listPipelines(programId)
}

class ListPipelinesCommand extends Command {
  async run () {
    const { flags } = this.parse(ListPipelinesCommand)

    const programId = await getProgramId(flags)

    let result

    try {
      result = await this.listPipelines(programId, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    cli.table(result, {
      id: {
        header: 'Pipeline Id'
      },
      name: {},
      status: {}
    }, {
      printLine: this.log,
      output: getOutputFormat(flags)
    })

    return result
  }

  async listPipelines (programId, passphrase = null) {
    return _listPipelines(programId, passphrase)
  }
}

ListPipelinesCommand.description = 'lists pipelines available in a Cloud Manager program'

ListPipelinesCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId
}

ListPipelinesCommand.aliases = [
  'cloudmanager:list-pipelines'
]

module.exports = ListPipelinesCommand
