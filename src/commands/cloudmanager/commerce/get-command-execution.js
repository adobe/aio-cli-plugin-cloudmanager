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
const { initSdk, formatTime, getProgramId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const commonArgs = require('../../../common-args')

class GetCommandExecutionCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(GetCommandExecutionCommand)

    const programId = getProgramId(flags)

    const commandRetrievalMessage = `Getting Status for Command ID# ${args.commandExecutionId}`
    const commandRetrievedMessage = `Status for Command ID# ${args.commandExecutionId}`

    cli.action.start(commandRetrievalMessage)

    const result = await this.getCommand(
      programId,
      args.environmentId,
      args.commandExecutionId,
    )

    cli.action.start(commandRetrievedMessage)
    cli.action.stop('\n')
    const { id, type, command, startedBy, startedAt, completedAt, status } = result
    cli.table([{ id, type, command, startedBy, startedAt, completedAt, status }], {
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

  async getCommand (
    programId,
    environmentId,
    commandExecutionId,
    imsContextName = null,
  ) {
    const sdk = await initSdk(imsContextName)
    return sdk.getCommerceCommandExecution(programId, environmentId, commandExecutionId)
  }
}

GetCommandExecutionCommand.description = 'get status of a single commerce cli command'

GetCommandExecutionCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

GetCommandExecutionCommand.args = [
  commonArgs.environmentId,
  { name: 'commandExecutionId', required: true, description: 'the command execution id' },
]

module.exports = GetCommandExecutionCommand
