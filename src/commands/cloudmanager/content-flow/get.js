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
const commonFlags = require('../../../common-flags')
const BaseExecutionCommand = require('../../../base-execution-command')
const { cli } = require('cli-ux')

class GetContentFlowCommand extends BaseExecutionCommand {
  async run () {
    const { args, flags } = this.parse(GetContentFlowCommand)

    const programId = getProgramId(flags)

    const result = await this.getContentFlow(programId, args.contentFlowId, flags.imsContextName)

    if (getOutputFormat(flags) === 'json') {
      // Log as JSON, without the _links to get full details
      delete result._links
      cli.styledJSON(result)
    } else {
      // One row summary info table with headings (too much info to display)
      const resArray = [result]
      cli.table(resArray, {
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
    }

    return result
  }

  async getContentFlow (programId, contentFlowId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.getContentFlow(programId, contentFlowId)
  }
}

GetContentFlowCommand.description = 'get content flow'

GetContentFlowCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...BaseExecutionCommand.flags,
}

GetContentFlowCommand.args = [
  { name: 'contentFlowId', required: true, description: 'the content flow id' },
]

GetContentFlowCommand.aliases = [
  'cloudmanager:get-content-flow',
]

GetContentFlowCommand.permissionInfo = {
  operation: 'getContentFlow',
}

module.exports = GetContentFlowCommand
