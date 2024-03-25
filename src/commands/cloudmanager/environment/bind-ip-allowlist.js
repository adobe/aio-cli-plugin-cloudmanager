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

const { getProgramId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const commonArgs = require('../../../common-args')
const CoreBindIPAllowlist = require('../ip-allowlist/bind.js')
const BaseCommand = require('../../../base-command')

class BindIPAllowlist extends BaseCommand {
  async run () {
    const { flags, args } = this.parse(BindIPAllowlist)

    const programId = getProgramId(flags)

    cli.action.start(`binding IP allowlist ${args.ipAllowlistId} to environment ${args.environmentId} (${args.service})`)

    const result = await new CoreBindIPAllowlist().bindIpAllowlist(programId, args.ipAllowlistId, args.environmentId, args.service, flags.imsContextName)

    cli.action.stop('bound')

    return result
  }
}

BindIPAllowlist.description = 'Bind an IP Allowlist to an environment'

BindIPAllowlist.args = [
  commonArgs.environmentId,
  { name: 'ipAllowlistId', required: true, description: 'the IP allowlist id' },
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
