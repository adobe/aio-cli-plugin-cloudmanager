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

const { Command } = require('@oclif/command')
const { initSdk, getProgramId } = require('../../../cloudmanager-helpers')
const commonFlags = require('../../../common-flags')

class TailExecutionStepLog extends Command {
  async run () {
    const { args, flags } = this.parse(TailExecutionStepLog)

    const programId = getProgramId(flags)

    let result

    try {
      result = await this.tailExecutionStepLog(programId, args.pipelineId, args.action, flags.file, flags.imsContextName)
    } catch (error) {
      this.error(error.message)
    }

    this.log()

    return result
  }

  async tailExecutionStepLog (programId, pipelineId, action, logFile, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.tailExecutionStepLog(programId, pipelineId, action, logFile, process.stdout)
  }
}

TailExecutionStepLog.description = 'tail step log'

TailExecutionStepLog.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

TailExecutionStepLog.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' },
  {
    name: 'action',
    required: true,
    description: 'the step action',
    default: 'build',
    options: [
      'build',
    ],
  },
]

module.exports = TailExecutionStepLog
