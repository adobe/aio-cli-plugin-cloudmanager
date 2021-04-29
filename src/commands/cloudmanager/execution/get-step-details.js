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
const { initSdk, getProgramId, getOutputFormat, formatAction, formatTime, formatDuration, formatStatus } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const halfred = require('halfred')
const commonFlags = require('../../../common-flags')

class GetExecutionStepDetails extends Command {
  async run () {
    const { args, flags } = this.parse(GetExecutionStepDetails)

    const programId = getProgramId(flags)

    let result

    try {
      result = await this.getExecution(programId, args.pipelineId, args.executionId, flags.imsContextName)
    } catch (error) {
      this.error(error.message)
    }

    if (result) {
      result = halfred.parse(result)

      const stepStates = result.embeddedArray('stepStates')

      const buildStep = stepStates.find(stepState => stepState.action === 'build')
      const codeQualityStep = stepStates.find(stepState => stepState.action === 'codeQuality')
      codeQualityStep.startedAt = buildStep.finishedAt

      cli.table(stepStates, {
        action: {
          header: 'Action',
          get: formatAction,
        },
        status: {
          header: 'Status',
          get: formatStatus,
        },
        startedAt: {
          header: 'Started At',
          get: formatTime('startedAt'),
        },
        finishedAt: {
          header: 'Finished At',
          get: formatTime('finishedAt'),
        },
        duration: {
          header: 'Duration',
          get: formatDuration,
        },
      }, {
        printLine: this.log,
        output: getOutputFormat(flags),
      })

      return stepStates
    }

    return result
  }

  async getExecution (programId, pipelineId, executionId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.getExecution(programId, pipelineId, executionId)
  }
}

GetExecutionStepDetails.description = 'get execution step details'

GetExecutionStepDetails.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId,
}

GetExecutionStepDetails.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' },
  { name: 'executionId', required: true, description: 'the execution id' },
]

GetExecutionStepDetails.aliases = [
  'cloudmanager:get-execution-step-details',
]

module.exports = GetExecutionStepDetails
