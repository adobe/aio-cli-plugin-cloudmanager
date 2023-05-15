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

class GetContentSetCommand extends BaseExecutionCommand {
  async run () {
    const { args, flags } = this.parse(GetContentSetCommand)

    const programId = getProgramId(flags)

    const result = await this.getContentSet(programId, args.contentSetId, flags.imsContextName)

    if (getOutputFormat(flags) === 'json') {
      // Log as JSON, without the _links to get full details
      delete result._links
      cli.styledJSON(result)
    } else {
      // One row summary info table with headings
      const resArray = [result]
      cli.table(resArray, {
        id: {},
        name: {},
        description: {},
        programId: {},
        paths: {},
      }, {
        printLine: this.log,
        output: getOutputFormat(flags),
      })
    }

    return result
  }

  async getContentSet (programId, contentSetId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.getContentSet(programId, contentSetId)
  }
}

GetContentSetCommand.description = 'get content set'

GetContentSetCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...BaseExecutionCommand.flags,
}

GetContentSetCommand.args = [
  { name: 'contentSetId', required: true, description: 'the content set id' },
]

GetContentSetCommand.aliases = [
  'cloudmanager:get-content-set',
]

GetContentSetCommand.permissionInfo = {
  operation: 'getContentSet',
}

module.exports = GetContentSetCommand
