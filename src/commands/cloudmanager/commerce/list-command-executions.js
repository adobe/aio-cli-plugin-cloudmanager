/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const BaseCommand = require('../../../base-command')
const {
  initSdk,
  formatTime,
  getProgramId,
} = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const { flags } = require('@oclif/command')
const commonFlags = require('../../../common-flags')

class ListCommandExecutionsCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(ListCommandExecutionsCommand)

    const programId = getProgramId(flags)

    const commandsRetrievalMessage = 'Getting Commerce Command Executions'
    const commandsRetrievedMessage = 'Retrieved Commerce Command Executions'

    cli.action.start(commandsRetrievalMessage)

    const result = await this.getCommands(
      programId,
      args.environmentId,
      flags.type,
      flags.status,
      flags.command,
    )

    cli.action.start(commandsRetrievedMessage)
    cli.action.stop('\n')

    cli.table(result, {
      id: {},
      type: {},
      command: {},
      startedBy: {
        header: 'Started By',
      },
      startedAt: {
        header: 'Started At',
        get: formatTime('startedAt'),
      },
      completedAt: {
        header: 'Completed At',
        get: formatTime('completedAt'),
      },
      status: {},
    })
    console.log('\n')

    return result
  }

  async getCommands (
    programId,
    environmentId,
    type,
    status,
    command,
    imsContextName = null,
  ) {
    const sdk = await initSdk(imsContextName)
    return sdk.getCommerceCommandExecutions(
      programId,
      environmentId,
      type,
      status,
      command,
    )
  }
}

ListCommandExecutionsCommand.description =
  'get status of a single commerce cli command'

ListCommandExecutionsCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  type: flags.string({
    char: 't',
    required: false,
    description: 'filter by type of command',
    options: ['bin/magento'],
  }),
  status: flags.string({
    char: 's',
    required: false,
    description: 'filter by status of command',
    options: [
      'PENDING',
      'RUNNING',
      'CANCELLED',
      'COMPLETED',
      'FAILED',
      'CANCELLING',
      'CANCEL_FAILED',
      'UNKNOWN',
    ],
  }),
  command: flags.string({
    char: 'c',
    required: false,
    description: 'filter by command',
    options: [
      'maintenance:status',
      'maintenance:enable',
      'maintenance:disable',
      'indexer:reindex',
      'cache:clean',
      'cache:flush',
      'app:config:dump',
      'app:config:import',
    ],
  }),
}

ListCommandExecutionsCommand.args = [
  { name: 'environmentId', required: true, description: 'the environment id' },
]

module.exports = ListCommandExecutionsCommand
