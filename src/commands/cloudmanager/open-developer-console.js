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
const { getApiKey, getOrgId, getProgramId } = require('../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const Client = require('../../client')
const commonFlags = require('../../common-flags')

async function _getDeveloperConsoleUrl(programId, environmentId, passphrase) {
    const apiKey = await getApiKey()
    const accessToken = await getAccessToken(passphrase)
    const orgId = await getOrgId()
    return new Client(orgId, accessToken, apiKey).getDeveloperConsoleUrl(programId, environmentId)
}

class OpenDeveloperConsoleCommand extends Command {
    async run() {
        const { args, flags } = this.parse(OpenDeveloperConsoleCommand)

        const programId = await getProgramId(flags)

        let result

        try {
            result = await this.getDeveloperConsoleUrl(programId, args.environmentId, flags.passphrase)
        } catch (error) {
            this.error(error.message)
        }

        await cli.open(result)

        return result
    }

    async getDeveloperConsoleUrl(programId, environmentId, passphrase = null) {
        return _getDeveloperConsoleUrl(programId, environmentId, passphrase)
    }
}

OpenDeveloperConsoleCommand.description = 'opens the Developer Console, if available, in a browser'

OpenDeveloperConsoleCommand.args = [
    {name: 'environmentId', required: true, description: "the environment id"}
]

OpenDeveloperConsoleCommand.flags = {
    ...commonFlags.global,
    ...commonFlags.programId
}

module.exports = OpenDeveloperConsoleCommand
