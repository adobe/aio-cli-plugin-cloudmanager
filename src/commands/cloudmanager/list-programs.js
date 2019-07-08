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
const { getApiKey, getOrgId } = require('../../cloudmanager-helpers')
const Client = require('../../client')
const { cli } = require('cli-ux')
const globalFlags = require('./index').flags

async function _listPrograms(passphrase) {
    const apiKey = await getApiKey()
    const accessToken = await getAccessToken(passphrase)
    const orgId = await getOrgId()
    return new Client(orgId, accessToken, apiKey).listPrograms()
}

class ListProgramsCommand extends Command {
    async run() {
        const { flags } = this.parse(ListProgramsCommand)
        let result

        try {
            result = await this.listPrograms(flags.passphrase)
        } catch (error) {
            this.error(error.message)
        }

        if (flags.enabledonly) {
            result = result.filter(p => p.enabled)
        }

        cli.table(result, {
            id: {
                header: "Program Id"
            },
            name: {},
            enabled: {}
        }, {
                printLine: this.log
            })

        return result
    }

    async listPrograms(passphrase = null) {
        return _listPrograms(passphrase)
    }
}

ListProgramsCommand.description = 'lists programs available in Cloud Manager'

ListProgramsCommand.flags = {
    ...globalFlags,
    enabledonly: flags.boolean({ char: 'e', description: 'only output Cloud Manager-enabled programs' })
}

module.exports = ListProgramsCommand
