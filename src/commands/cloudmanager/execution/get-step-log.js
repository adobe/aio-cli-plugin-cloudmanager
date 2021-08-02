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
const fs = require('fs')
const { cli } = require('cli-ux')
const { initSdk, getProgramId } = require('../../../cloudmanager-helpers')
const commonFlags = require('../../../common-flags')
const BaseCommand = require('../../../base-command')

class GetExecutionStepLogs extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(GetExecutionStepLogs)

    const programId = getProgramId(flags)

    const outputStream = flags.output ? fs.createWriteStream(flags.output) : process.stdout

    if (flags.output) {
      cli.action.start(`download ${args.action} log to ${flags.output}`)
    }

    const result = await this.getExecutionStepLog(programId, args.pipelineId, args.executionId, args.action, flags.file, outputStream, flags.imsContextName)

    if (flags.output) {
      cli.action.stop('downloaded')
    }

    return result
  }

  async getExecutionStepLog (programId, pipelineId, executionId, action, logFile, outputStream, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.getExecutionStepLog(programId, pipelineId, executionId, action, logFile, outputStream)
  }
}

GetExecutionStepLogs.description = 'get step log'

GetExecutionStepLogs.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  output: flags.string({ char: 'o', description: 'the output file. If not set, uses standard output.' }),
  file: flags.string({ char: 'f', description: 'the alternative log file name. currently only `sonarLogFile` is available (for the codeQuality step)' }),
}

GetExecutionStepLogs.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' },
  { name: 'executionId', required: true, description: 'the execution id' },
  {
    name: 'action',
    required: true,
    description: 'the step action',
    options: [
      'build',
      'codeQuality',
      'devDeploy',
      'stageDeploy',
      'prodDeploy',
      'buildImage',
    ],
  },
]

GetExecutionStepLogs.aliases = [
  'cloudmanager:get-execution-step-log',
]

module.exports = GetExecutionStepLogs
