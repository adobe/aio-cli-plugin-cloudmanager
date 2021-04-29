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
const commonFlags = require('../../../common-flags')
const BaseExecutionCommand = require('../../../base-execution-command')

class GetCurrentExecutionCommand extends BaseExecutionCommand {
  async run () {
    const { args, flags } = this.parse(GetCurrentExecutionCommand)

    const programId = getProgramId(flags)

    let result

    try {
      result = await this.getCurrentExecution(programId, args.pipelineId, flags.imsContextName)
    } catch (error) {
      this.error(error.message)
    }

    this.outputTableAssumingAllAreRunning([result], flags)

    return result
  }

  async getCurrentExecution (programId, pipelineId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.getCurrentExecution(programId, pipelineId)
  }
}

GetCurrentExecutionCommand.description = 'get pipeline execution'

GetCurrentExecutionCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...BaseExecutionCommand.flags,
}

GetCurrentExecutionCommand.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' },
]

GetCurrentExecutionCommand.aliases = [
  'cloudmanager:get-current-execution',
]

module.exports = GetCurrentExecutionCommand
