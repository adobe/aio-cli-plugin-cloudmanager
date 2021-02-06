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
const { initSdk, getProgramId, getOutputFormat, columnWithArray } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const ListEnvironmentsCommand = require('./list-environments')

class ListIPAllowlists extends Command {
  async run () {
    const { flags } = this.parse(ListIPAllowlists)

    const programId = await getProgramId(flags)

    let result

    try {
      result = await this.listIpAllowlists(programId, flags.imsContextName)
    } catch (error) {
      this.error(error.message)
    }

    let environments
    try {
      environments = await new ListEnvironmentsCommand().listEnvironments(programId, flags.imsContextName)
    } catch (error) {
    }

    if (environments) {
      result.forEach(ipAllowlist => {
        ipAllowlist.boundServices = []
        ipAllowlist.bindings.forEach(binding => {
          const environment = environments.find(e => e.id === binding.environmentId)
          if (environment) {
            ipAllowlist.boundServices.push(`${environment.name} (${binding.tier})`)
          } else {
            ipAllowlist.boundServices.push(`Environment ${binding.environmentId} (${binding.tier})`)
          }
        })
      })
    }

    const columns = {
      id: {
        header: 'Allowlist Id',
      },
      name: {},
      ipCidrSet: columnWithArray('ipCidrSet', {
        header: 'CIDR Blocks',
      }, flags),
    }

    if (environments) {
      columns.bindings = columnWithArray('boundServices', {
        header: 'Bound Services',
      }, flags)
    } else {
      columns.bindings = {
        header: 'Binding Count',
        get: item => item.bindings.length,
      }
    }

    cli.table(result, columns, {
      printLine: this.log,
      output: getOutputFormat(flags),
    })

    return result
  }

  async listIpAllowlists (programId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.listIpAllowlists(programId)
  }
}

ListIPAllowlists.description = 'lists IP Allowlists available in a Cloud Manager program'

ListIPAllowlists.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId,
}

module.exports = ListIPAllowlists
