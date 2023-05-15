/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { initSdk, getProgramId, getOutputFormat } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const BaseCommand = require('../../../base-command')

class ListContentFlowsCommand extends BaseCommand {
  async run () {
    const { flags } = this.parse(ListContentFlowsCommand)

    const programId = getProgramId(flags)

    const result = await this.listContentFlows(programId, flags.imsContextName)

    cli.table(result, {
      contentFlowId: {
        header: 'Content Flow Id',
      },
      contentSetId: {
        header: 'Content Set',
      },
      contentSetName: {
        header: 'Content Set Name',
      },
      srcEnvironmentId: {
        header: 'Source Env',
      },
      destEnvironmentId: {
        header: 'Destination Env',
      },
      tier: {},
      status: {},
    }, {
      printLine: this.log,
      output: getOutputFormat(flags),
    })

    return result
  }

  async listContentFlows (programId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.listContentFlows(programId)
  }
}

ListContentFlowsCommand.description = 'lists Content flows available in a Cloud Manager program'

ListContentFlowsCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId,
}

ListContentFlowsCommand.aliases = [
  'cloudmanager:list-content-flows',
]

ListContentFlowsCommand.permissionInfo = {
  operation: 'listContentFlows',
}

module.exports = ListContentFlowsCommand
