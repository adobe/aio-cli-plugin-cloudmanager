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

class ListCurrentExecutionsCommand extends BaseExecutionCommand {
  async run () {
    const { flags } = this.parse(ListCurrentExecutionsCommand)

    let result

    const programId = await getProgramId(flags)

    try {
      result = await this.listCurrentExecutions(programId, flags.imsContextName)
    } catch (error) {
      this.error(error.message)
    }

    this.outputTable(result, flags)

    return result
  }

  async listCurrentExecutions (programId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    const pipelines = await sdk.listPipelines(programId, {
      busy: true,
    })
    return await Promise.all(pipelines.map(async pipeline => await sdk.getCurrentExecution(programId, pipeline.id)))
  }
}

ListCurrentExecutionsCommand.description = 'list running pipeline executions'

ListCurrentExecutionsCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...BaseExecutionCommand.flags,
}

ListCurrentExecutionsCommand.aliases = [
  'cloudmanager:list-current-executions',
]

module.exports = ListCurrentExecutionsCommand
