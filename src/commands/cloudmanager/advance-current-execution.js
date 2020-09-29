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
const { getApiKey, getBaseUrl, getOrgId, getProgramId } = require('../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const { init } = require('@adobe/aio-lib-cloudmanager')
const commonFlags = require('../../common-flags')

async function _advanceCurrentExecution (programId, pipelineId, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  return sdk.advanceCurrentExecution(programId, pipelineId)
}

class AdvanceCurrentExecutionCommand extends Command {
  async run () {
    const { args, flags } = this.parse(AdvanceCurrentExecutionCommand)

    const programId = await getProgramId(flags)

    let result

    cli.action.start('advancing execution')

    try {
      result = await this.advanceCurrentExecution(programId, args.pipelineId, flags.passphrase)
    } catch (error) {
      cli.action.stop(error.message)
      return
    }

    cli.action.stop('advanced')

    return result
  }

  async advanceCurrentExecution (programId, pipelineId, passphrase = null) {
    return _advanceCurrentExecution(programId, pipelineId, passphrase)
  }
}

AdvanceCurrentExecutionCommand.description = 'advance current pipeline execution either by overriding a waiting quality gate or advancing the approval step'

AdvanceCurrentExecutionCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId
}

AdvanceCurrentExecutionCommand.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' }
]

module.exports = AdvanceCurrentExecutionCommand
