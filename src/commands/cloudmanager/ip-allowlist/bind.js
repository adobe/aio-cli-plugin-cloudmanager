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

const { initSdk, getProgramId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const commonArgs = require('../../../common-args')
const BaseCommand = require('../../../base-command')

class BindIPAllowlist extends BaseCommand {
  async run () {
    const { flags, args } = this.parse(BindIPAllowlist)

    const programId = getProgramId(flags)

    cli.action.start(`binding IP allowlist ${args.ipAllowlistId} to environment ${args.environmentId} (${args.service})`)

    const result = await this.bindIpAllowlist(programId, args.ipAllowlistId, args.environmentId, args.service, flags.imsContextName)

    cli.action.stop('bound')

    return result
  }

  async bindIpAllowlist (programId, ipAllowlistId, environmentId, service, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.addIpAllowlistBinding(programId, ipAllowlistId, environmentId, service)
  }
}

BindIPAllowlist.description = 'Bind an IP Allowlist to an environment'

BindIPAllowlist.strict = false

BindIPAllowlist.args = [
  { name: 'ipAllowlistId', required: true, description: 'the IP allowlist id' },
  commonArgs.environmentId,
  commonArgs.environmentServices,
]

BindIPAllowlist.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

BindIPAllowlist.permissionInfo = {
  operation: 'createIPAllowlistBinding',
}

module.exports = BindIPAllowlist
