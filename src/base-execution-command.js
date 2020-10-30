/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { Command } = require('@oclif/command')
const { cli } = require('cli-ux')
const { getCurrentStep } = require('@adobe/aio-lib-cloudmanager')
const { getOutputFormat } = require('./cloudmanager-helpers')
const commonFlags = require('./common-flags')

class BaseExecutionCommand extends Command {
  outputTable (result, flags) {
    cli.table(result, {
      pipelineId: {
        header: 'Pipeline Id'
      },
      id: {
        header: 'Execution Id'
      },
      currentStep: {
        header: 'Current Step Action',
        get: item => getCurrentStep(item).action
      },
      currentStepStatus: {
        header: 'Current Step Status',
        get: item => getCurrentStep(item).status
      }
    }, {
      printLine: this.log,
      output: await getOutputFormat(flags)
    })
  }
}

BaseExecutionCommand.flags = {
  ...commonFlags.outputFormat
}

module.exports = BaseExecutionCommand
