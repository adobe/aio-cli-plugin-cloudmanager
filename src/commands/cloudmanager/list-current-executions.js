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
const { accessToken: getAccessToken } = require('@adobe/aio-cli-plugin-jwt-auth')
const { getApiKey, getOrgId, getProgramId, getCurrentStep } = require('../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const Client = require('../../client')
const commonFlags = require('../../common-flags')

async function _listCurrentExecutions(programId, passphrase) {
    const apiKey = await getApiKey()
    const accessToken = await getAccessToken(passphrase)
    const orgId = await getOrgId()
    const client = new Client(orgId, accessToken, apiKey)
    const pipelines = await client.listPipelines(programId, {
        busy: true
    });
    return await Promise.all(pipelines.map(async pipeline => await client.getCurrentExecution(programId, pipeline.id)))
}

class ListCurrentExecutionsCommand extends Command {
    async run() {
        const { flags } = this.parse(ListCurrentExecutionsCommand)

        let result;

        const programId = await getProgramId(flags)

        try {
          result = await this.listCurrentExecutions(programId, flags.passphrase)
        } catch (error) {
          this.error(error.message)
        }

        cli.table(result, {
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

    async listCurrentExecutions(programId, passphrase = null) {
        return _listCurrentExecutions(programId, passphrase)
    }
}

ListCurrentExecutionsCommand.description = 'list running pipeline executions'

ListCurrentExecutionsCommand.flags = {
    ...commonFlags.global,
    ...commonFlags.programId
}

module.exports = ListCurrentExecutionsCommand
