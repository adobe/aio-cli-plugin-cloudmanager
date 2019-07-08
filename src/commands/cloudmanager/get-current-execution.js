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

const { Command, flags } = require('@oclif/command')
const { accessToken: getAccessToken } = require('@adobe/aio-cli-plugin-jwt-auth')
const { getApiKey, getOrgId, getProgramId, getCurrentStep } = require('../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const Client = require('../../client')
const globalFlags = require('./index').flags

async function _getCurrentExecution (programId, pipelineId, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  return new Client(orgId, accessToken, apiKey).getCurrentExecution(programId, pipelineId)
}

class GetCurrentExecutionCommand extends Command {
  async run () {
    const { args, flags } = this.parse(GetCurrentExecutionCommand)

    const programId = await getProgramId(flags)

    let result;

    try {
      result = await this.getCurrentExecution(programId, args.pipelineId, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    cli.table([result], {
      pipelineId: {
        header: "Pipeline Id"
      },
      id: {
        header: "Execution Id"
      },
      currentStep: {
        header: "Current Step Action",
        get: item => getCurrentStep(item).action
      },
      currentStepStatus: {
        header: "Current Step Status",
        get: item => getCurrentStep(item).status
      }
    }, {
      printLine: this.log
    })

    return result
  }

  async getCurrentExecution (programId, pipelineId, passphrase = null) {
    return _getCurrentExecution(programId, pipelineId, passphrase)
  }
}

GetCurrentExecutionCommand.description = 'get pipeline execution'

GetCurrentExecutionCommand.flags = {
  ...globalFlags,
  programId: flags.string({ char: 'p', description: "the programId. if not specified, defaults to 'cloudmanager_programid' config value"})
}

GetCurrentExecutionCommand.args = [
    {name: 'pipelineId', required: true, description: "the pipeline id"}
]


module.exports = GetCurrentExecutionCommand
