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

const { Command, flags } = require('@oclif/command')
const { accessToken: getAccessToken } = require('@adobe/aio-cli-plugin-jwt-auth')
const { getApiKey, getBaseUrl, getOrgId, getProgramId, sanitizeEnvironmentId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const path = require('path')
const { init } = require('@adobe/aio-lib-cloudmanager')
const commonFlags = require('../../../common-flags')

async function _downloadLogs (programId, environmentId, service, logName, days, outputDirectory, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  return sdk.downloadLogs(programId, environmentId, service, logName, days, outputDirectory)
}

class DownloadLogs extends Command {
  async run () {
    const { args, flags } = this.parse(DownloadLogs)

    const programId = await getProgramId(flags)

    const environmentId = sanitizeEnvironmentId(args.environmentId)

    const outputDirectory = flags.outputDirectory || '.'

    cli.action.start('downloading logs')

    let result

    try {
      result = await this.downloadLogs(programId, environmentId, args.service, args.name, args.days, outputDirectory, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    cli.action.stop(`downloaded ${result.length} file${result.length > 1 ? 's' : ''} to ${path.resolve(outputDirectory)}`)

    this.log()

    cli.table(result, {
      service: {},
      name: {},
      index: {},
      date: {},
      path: {
        get: row => path.resolve(row.path),
      },
    })

    return result
  }

  async downloadLogs (programId, environmentId, service, name, days, outputDirectory, passphrase = null) {
    return _downloadLogs(programId, environmentId, service, name, days, outputDirectory, passphrase)
  }
}

DownloadLogs.description = 'downloads log files for the specified environment, service and log name for one or more days'

DownloadLogs.args = [
  { name: 'environmentId', required: true, description: 'the environment id' },
  { name: 'service', required: true, description: 'the service' },
  { name: 'name', required: true, description: 'the log name' },
  { name: 'days', required: false, description: 'the number of days', default: '1' },
]

DownloadLogs.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  outputDirectory: flags.string({ char: 'o', description: 'the output directory. If not set, defaults to the current directory.' }),
}

DownloadLogs.aliases = [
  'cloudmanager:download-logs',
]

module.exports = DownloadLogs
