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

async function _getCurrentExecution (programId, pipelineId, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  return sdk.getCurrentExecution(programId, pipelineId)
}

class GetCurrentExecutionCommand extends BaseExecutionCommand {
  async run () {
    const { args, flags } = this.parse(GetCurrentExecutionCommand)

    const programId = await getProgramId(flags)

    let result

    try {
      result = await this.getCurrentExecution(programId, args.pipelineId, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    this.outputTable([result])

    return result
  }

  async getCurrentExecution (programId, pipelineId, passphrase = null) {
    return _getCurrentExecution(programId, pipelineId, passphrase)
  }
}

GetCurrentExecutionCommand.description = 'get pipeline execution'

GetCurrentExecutionCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId
}

GetCurrentExecutionCommand.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' }
]

module.exports = GetCurrentExecutionCommand
