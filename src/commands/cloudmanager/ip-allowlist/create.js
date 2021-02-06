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
const { initSdk, getProgramId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')

class CreateIPAllowlist extends Command {
  async run () {
    const { flags, args } = this.parse(CreateIPAllowlist)

    const programId = await getProgramId(flags)

    cli.action.start('creating allowlist')

    let result

    try {
      result = await this.createIpAllowlist(programId, args.name, flags.cidr, flags.imsContextName)
    } catch (error) {
      this.error(error.message)
    }

    cli.action.stop(`created IP Allowlist ${result.id}`)

    return result
  }

  async createIpAllowlist (programId, name, cidrBlocks, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.createIpAllowlist(programId, name, cidrBlocks)
  }
}

CreateIPAllowlist.description = 'Create an IP Allowlist'

CreateIPAllowlist.args = [
  { name: 'name', required: true, description: 'the name to create' },
]

CreateIPAllowlist.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  cidr: flags.string({
    char: 'c',
    description: 'a CIDR block',
    multiple: true,
    required: true,
  }),
}

module.exports = CreateIPAllowlist
