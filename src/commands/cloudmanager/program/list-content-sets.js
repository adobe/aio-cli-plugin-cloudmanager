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

class ListContentSetsCommand extends BaseCommand {
  async run () {
    const { flags } = this.parse(ListContentSetsCommand)

    const programId = getProgramId(flags)

    const result = await this.listContentSets(programId, flags.imsContextName)

    cli.table(result, {
      id: {},
      name: {},
      description: {},
      paths: {
        header: 'Number of paths',
        get: item => item.paths.length,
      },
    }, {
      printLine: this.log,
      output: getOutputFormat(flags),
    })

    return result
  }

  async listContentSets (programId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.listContentSets(programId)
  }
}

ListContentSetsCommand.description = 'lists Content sets available in a Cloud Manager program'

ListContentSetsCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId,
}

ListContentSetsCommand.aliases = [
  'cloudmanager:list-content-sets',
]

ListContentSetsCommand.permissionInfo = {
  operation: 'listContentSets',
}

module.exports = ListContentSetsCommand
