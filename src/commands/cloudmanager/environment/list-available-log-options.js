/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { initSdk, getProgramId, sanitizeEnvironmentId, getOutputFormat } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const BaseCommand = require('../../../base-command')

class ListAvailableLogOptionsCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(ListAvailableLogOptionsCommand)

    const programId = getProgramId(flags)

    const environmentId = sanitizeEnvironmentId(args.environmentId)

    const result = await this.listAvailableLogOptions(programId, environmentId, flags.imsContextName)

    if (result.length > 0) {
      cli.table(result, {
        id: {
          header: 'Environment Id',
          get: () => environmentId,
        },
        service: {},
        name: {},
      }, {
        printLine: this.log,
        output: getOutputFormat(flags),
      })
    } else {
      cli.info(`No log options are available for environmentId ${environmentId}`)
    }

    return result
  }

  async listAvailableLogOptions (programId, environmentId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.listAvailableLogOptions(programId, environmentId)
  }
}

ListAvailableLogOptionsCommand.description = 'lists available log options for an environment in a Cloud Manager program'

ListAvailableLogOptionsCommand.args = [
  { name: 'environmentId', required: true, description: 'the environment id' },
]

ListAvailableLogOptionsCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId,
}

ListAvailableLogOptionsCommand.aliases = [
  'cloudmanager:list-available-log-options',
]

module.exports = ListAvailableLogOptionsCommand
