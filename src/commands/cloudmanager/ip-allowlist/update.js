/*
Copyright 2020 Adobe. All rights reserved.
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
const { getApiKey, getBaseUrl, getOrgId, getProgramId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const { init } = require('@adobe/aio-lib-cloudmanager')
const commonFlags = require('../../../common-flags')

async function _updateIpAllowlist (programId, ipAllowlistId, blocks, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  return sdk.updateIpAllowlist(programId, ipAllowlistId, blocks)
}

class UpdateIPAllowlist extends Command {
  async run () {
    const { flags, args } = this.parse(UpdateIPAllowlist)

    const programId = await getProgramId(flags)

    cli.action.start(`updating allowlist ${args.ipAllowlistId}`)

    let result

    try {
      result = await this.updateIpAllowlist(programId, args.ipAllowlistId, flags.cidr, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    cli.action.stop('updated')

    return result
  }

  async updateIpAllowlist (programId, ipAllowlistId, blocks, passphrase = null) {
    return _updateIpAllowlist(programId, ipAllowlistId, blocks, passphrase)
  }
}

UpdateIPAllowlist.description = 'Update an IP Allowlist by replacing the CIDR blocks'

UpdateIPAllowlist.strict = false

UpdateIPAllowlist.args = [
  { name: 'ipAllowlistId', required: true, description: 'the id of the allowlist to update' },
]

UpdateIPAllowlist.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId,
  cidr: flags.string({
    char: 'c',
    description: 'a CIDR block',
    multiple: true,
    required: true,
  }),
}

module.exports = UpdateIPAllowlist
