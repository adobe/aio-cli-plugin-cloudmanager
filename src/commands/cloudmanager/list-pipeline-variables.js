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

const BasePipelineVariablesCommand = require('../../base-pipeline-variables-command')
const { getProgramId } = require('../../cloudmanager-helpers')
const commonFlags = require('../../common-flags')

class ListPipelineVariablesCommand extends BasePipelineVariablesCommand {
  async run () {
    const { args, flags } = this.parse(ListPipelineVariablesCommand)

    const programId = await getProgramId(flags)

    let result

    try {
      result = await this.getVariables(programId, args, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }
    this.outputTable(result)

    return result
  }
}

ListPipelineVariablesCommand.description = 'lists variables set on an pipeline'

ListPipelineVariablesCommand.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' }
]

ListPipelineVariablesCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId
}

module.exports = ListPipelineVariablesCommand
