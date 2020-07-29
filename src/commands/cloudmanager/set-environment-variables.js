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

const BaseEnvironmentVariablesCommand = require('../../base-environment-variables-command')
const BaseVariablesCommand = require('../../base-variables-command')
const { accessToken: getAccessToken } = require('@adobe/aio-cli-plugin-jwt-auth')
const { getApiKey, getOrgId, sanitizeEnvironmentId } = require('../../cloudmanager-helpers')
const Client = require('../../client')
const commonFlags = require('../../common-flags')

async function _setEnvironmentVariables(programId, environmentId, variables, passphrase) {
    const apiKey = await getApiKey()
    const accessToken = await getAccessToken(passphrase)
    const orgId = await getOrgId()
    return new Client(orgId, accessToken, apiKey).setEnvironmentVariables(programId, environmentId, variables)
}

class SetEnvironmentVariablesCommand extends BaseEnvironmentVariablesCommand {
    async run() {
        const { args, flags } = this.parse(SetEnvironmentVariablesCommand)

        return this.runSet(args, flags)
    }

    async setVariables(programId, args, variables, passphrase = null) {
        return _setEnvironmentVariables(programId, sanitizeEnvironmentId(args.environmentId), variables, passphrase)
    }
}

SetEnvironmentVariablesCommand.description = 'sets variables set on an environment. These are runtime variables available to components running inside the runtime environment. Use set-pipeline-variables to set build-time variables on a pipeline.'

SetEnvironmentVariablesCommand.args = [
    {name: 'environmentId', required: true, description: "the environment id"}
]

SetEnvironmentVariablesCommand.flags = {
    ...commonFlags.global,
    ...commonFlags.programId,
    ...BaseVariablesCommand.flags
}

module.exports = SetEnvironmentVariablesCommand
