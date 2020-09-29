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

const { accessToken: getAccessToken } = require('@adobe/aio-cli-plugin-jwt-auth')
const { getApiKey, getBaseUrl, getOrgId, getProgramId } = require('../../cloudmanager-helpers')
const { init } = require('@adobe/aio-lib-cloudmanager')
const commonFlags = require('../../common-flags')
const BaseExecutionCommand = require('../../base-execution-command')

async function _listCurrentExecutions (programId, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  const pipelines = await sdk.listPipelines(programId, {
    busy: true
  })
  return await Promise.all(pipelines.map(async pipeline => await sdk.getCurrentExecution(programId, pipeline.id)))
}

class ListCurrentExecutionsCommand extends BaseExecutionCommand {
  async run () {
    const { flags } = this.parse(ListCurrentExecutionsCommand)

    let result

    const programId = await getProgramId(flags)

    try {
      result = await this.listCurrentExecutions(programId, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    this.outputTable(result)

    return result
  }

  async listCurrentExecutions (programId, passphrase = null) {
    return _listCurrentExecutions(programId, passphrase)
  }
}

ListCurrentExecutionsCommand.description = 'list running pipeline executions'

ListCurrentExecutionsCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId
}

module.exports = ListCurrentExecutionsCommand
