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
const { getApiKey, getOrgId } = require('../../cloudmanager-helpers')
const Client = require('../../client')

async function _getEnvironmentVariables(programId, environmentId, passphrase) {
    const apiKey = await getApiKey()
    const accessToken = await getAccessToken(passphrase)
    const orgId = await getOrgId()
    return new Client(orgId, accessToken, apiKey).getEnvironmentVariables(programId, environmentId)
}

class BaseEnvironmentVariablesCommand extends Command {

    async getEnvironmentVariables(programId, environmentId, passphrase = null) {
        return _getEnvironmentVariables(programId, environmentId, passphrase)
    }
}

module.exports = BaseEnvironmentVariablesCommand
