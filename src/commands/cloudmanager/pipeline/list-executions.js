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

const { flags } = require('@oclif/command')
const { initSdk, getProgramId } = require('../../../cloudmanager-helpers')
const commonFlags = require('../../../common-flags')
const BaseExecutionCommand = require('../../../base-execution-command')

const DEFAULT_LIMIT = 20

class ListExecutionsCommand extends BaseExecutionCommand {
  async run () {
    const { args, flags } = this.parse(ListExecutionsCommand)

    const programId = getProgramId(flags)

    let result

    try {
      result = await this.listExecutions(programId, args.pipelineId, flags.limit || DEFAULT_LIMIT, flags.imsContextName)
    } catch (error) {
      this.error(error.message)
    }

    this.outputCompleteTable(result, flags)

    return result
  }

  async listExecutions (programId, pipelineId, limit, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.listExecutions(programId, pipelineId, limit)
  }
}

ListExecutionsCommand.description = 'list pipeline executions'

ListExecutionsCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...commonFlags.outputFormat,
  limit: flags.integer({ char: 'l', description: 'Specify number of executions to return (defaults to 20)' }),
}

ListExecutionsCommand.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' },
]

module.exports = ListExecutionsCommand
