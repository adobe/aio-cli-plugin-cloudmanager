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

const { initSdk, getProgramId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const { flags } = require('@oclif/command')
const commonFlags = require('../../../common-flags')
const BaseCommand = require('../../../base-command')

class StartExecutionCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(StartExecutionCommand)

    const programId = getProgramId(flags)

    cli.action.start('starting execution')

    const result = await this.startExecution(programId, args.pipelineId, flags.emergency, flags.imsContextName)

    cli.action.stop(`started execution ID ${result.id}`)

    return result
  }

  async startExecution (programId, pipelineId, emergencyMode, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.createExecution(programId, pipelineId, emergencyMode ? 'EMERGENCY' : 'NORMAL')
  }
}

StartExecutionCommand.description = 'start pipeline execution'

StartExecutionCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  emergency: flags.boolean({
    description: 'create the execution in emergency mode. emergency mode will skip certain steps and is only available to select AMS customers.',
    allowNo: true,
  }),
}

StartExecutionCommand.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' },
]

StartExecutionCommand.aliases = ['cloudmanager:create-execution', 'cloudmanager:start-execution']

StartExecutionCommand.permissionInfo = {
  operation: 'startPipeline',
}

module.exports = StartExecutionCommand
