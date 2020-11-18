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
const { getApiKey, getBaseUrl, getOrgId, getProgramId, sanitizeEnvironmentId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const { init } = require('@adobe/aio-lib-cloudmanager')
const commonFlags = require('../../../common-flags')

async function _deleteEnvironment (programId, environmentId, passphrase) {
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  return sdk.deleteEnvironment(programId, environmentId)
}

class DeleteEnvironmentCommand extends Command {
  async run () {
    const { args, flags } = this.parse(DeleteEnvironmentCommand)

    const programId = await getProgramId(flags)

    const environmentId = sanitizeEnvironmentId(args.environmentId)

    let result

    cli.action.start('deleting environment')

    try {
      result = await this.deleteEnvironment(programId, environmentId, flags.passphrase)
      cli.action.stop(`deleted environment ID ${environmentId}`)
    } catch (error) {
      cli.action.stop(error.message)
      return
    }

    return result
  }

  async deleteEnvironment (programId, environmentId, passphrase = null) {
    return _deleteEnvironment(programId, environmentId, passphrase)
  }
}

DeleteEnvironmentCommand.description = 'delete environment'

DeleteEnvironmentCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

DeleteEnvironmentCommand.args = [
  { name: 'environmentId', required: true, description: 'the environment id' },
]

DeleteEnvironmentCommand.aliases = [
  'cloudmanager:delete-environment',
]

module.exports = DeleteEnvironmentCommand
