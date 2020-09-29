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
const { getApiKey, getBaseUrl, getOrgId, getProgramId, sanitizeEnvironmentId } = require('../../cloudmanager-helpers')
const { init } = require('@adobe/aio-lib-cloudmanager')
const commonFlags = require('../../common-flags')

async function _tailLog (programId, environmentId, service, logName, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  return sdk.tailLog(programId, environmentId, service, logName, process.stdout)
}

class TailLog extends Command {
  async run () {
    const { args, flags } = this.parse(TailLog)

    const programId = await getProgramId(flags)

    const environmentId = sanitizeEnvironmentId(args.environmentId)

    let result

    try {
      result = await this.tailLog(programId, environmentId, args.service, args.name, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    this.log()

    return result
  }

  async tailLog (programId, environmentId, service, name, passphrase = null) {
    return _tailLog(programId, environmentId, service, name, passphrase)
  }
}

TailLog.description = 'lists available logs for an environment in a Cloud Manager program'

TailLog.args = [
  { name: 'environmentId', required: true, description: 'the environment id' },
  { name: 'service', required: true, description: 'the service' },
  { name: 'name', required: true, description: 'the log name' }
]

TailLog.flags = {
  ...commonFlags.global,
  ...commonFlags.programId
}

TailLog.aliases = ['cloudmanager:tail-logs']

module.exports = TailLog
