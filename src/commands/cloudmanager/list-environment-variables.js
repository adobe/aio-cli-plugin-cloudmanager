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

const BaseEnvironmentVariablesCommand = require('./base-environment-variables-command')
const { getProgramId } = require('../../cloudmanager-helpers')
const commonFlags = require('../../common-flags')

class ListEnvironmentVariablesCommand extends BaseEnvironmentVariablesCommand {
    async run() {
        const { args, flags } = this.parse(ListEnvironmentVariablesCommand)

        const programId = await getProgramId(flags)

        let result

        try {
            result = await this.getEnvironmentVariables(programId, args.environmentId, flags.passphrase)
        } catch (error) {
            this.error(error.message)
        }
        this.outputTable(result)

        return result
    }
}

ListEnvironmentVariablesCommand.description = 'lists variables set on an environment'

ListEnvironmentVariablesCommand.args = [
    {name: 'environmentId', required: true, description: "the environment id"}
]

ListEnvironmentVariablesCommand.flags = {
    ...commonFlags.global,
    ...commonFlags.programId
}

module.exports = ListEnvironmentVariablesCommand
