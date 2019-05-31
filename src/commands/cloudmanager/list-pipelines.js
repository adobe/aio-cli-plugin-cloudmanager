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
const { cli } = require('cli-ux')
const Client = require('../../client')

async function _listPipelines(programId, passphrase) {
    const apiKey = await getApiKey()
    const accessToken = await getAccessToken(passphrase)
    const orgId = await getOrgId()
    return new Client(orgId, accessToken, apiKey).listPipelines(programId)
}

class ListPipelinesCommand extends Command {
    async run() {
        const { args, flags } = this.parse(ListPipelinesCommand)
        let result

        try {
            result = await this.listPipelines(args.programId, flags.passphrase)
        } catch (error) {
            this.error(error.message)
        }

        cli.table(result, {
            id: {
                header: "Pipeline Id"
            },
            name: {},
            status: {}
        }, {
                printLine: this.log
            })

        return result
    }

    async listPipelines(programId, passphrase = null) {
        return _listPipelines(programId, passphrase)
    }
}

ListPipelinesCommand.description = 'lists pipelines available in a Cloud Manager program'

ListPipelinesCommand.flags = {
    passphrase: flags.string({ char: 'r', description: 'the passphrase for the private-key' })
}

ListPipelinesCommand.args = [
    { name: 'programId', required: true, description: "the program id" }
]

module.exports = ListPipelinesCommand
