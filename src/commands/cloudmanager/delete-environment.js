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
const { getApiKey, getOrgId, getProgramId, sanitizeEnvironmentId } = require('../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const Client = require('../../client')
const commonFlags = require('../../common-flags')

async function _deleteEnvironment (programId, environmentId, passphrase) {
  const orgId = await getOrgId()
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  return new Client(orgId, accessToken, apiKey).deleteEnvironment(programId, environmentId)
}

class DeleteEnvironmentCommand extends Command {
  async run () {
    const { args, flags } = this.parse(DeleteEnvironmentCommand)

    const programId = await getProgramId(flags)

    let result

    cli.action.start("deleting environment")

    let envId = sanitizeEnvironmentId(args.environmentId);
    try {
      result = await this.deleteEnvironment(programId, envId, flags.passphrase)
      cli.action.stop(`deleted environment ID ${envId}`)
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
  ...commonFlags.programId
}

DeleteEnvironmentCommand.args = [
  {name: 'environmentId', required: true, description: 'the environment id'}
]

module.exports = DeleteEnvironmentCommand
