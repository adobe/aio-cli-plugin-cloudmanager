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

const { Command } = require('@oclif/command')
const { initSdk, getProgramId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')

class DeleteIPAllowlist extends Command {
  async run () {
    const { flags, args } = this.parse(DeleteIPAllowlist)

    const programId = await getProgramId(flags)

    cli.action.start('deleting allowlist')

    let result

    try {
      result = await this.deleteIpAllowlist(programId, args.ipAllowlistId, flags.imsContextName)
    } catch (error) {
      this.error(error.message)
    }

    cli.action.stop('deleted')

    return result
  }

  async deleteIpAllowlist (programId, ipAllowlistId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.deleteIpAllowlist(programId, ipAllowlistId)
  }
}

DeleteIPAllowlist.description = 'Delete an IP Allowlist'

DeleteIPAllowlist.strict = false

DeleteIPAllowlist.args = [
  { name: 'ipAllowlistId', required: true, description: 'the id of the allowlist to delete' },
]

DeleteIPAllowlist.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

module.exports = DeleteIPAllowlist
