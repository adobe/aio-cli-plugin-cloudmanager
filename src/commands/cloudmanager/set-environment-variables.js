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
const BaseEnvironmentVariablesCommand = require('./base-environment-variables-command')
const { accessToken: getAccessToken } = require('@adobe/aio-cli-plugin-jwt-auth')
const { getApiKey, getOrgId, getProgramId } = require('../../cloudmanager-helpers')
const { createKeyValueObjectFromFlag } = require('@adobe/aio-cli-plugin-runtime')
const { cli } = require('cli-ux')
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

        const programId = await getProgramId(flags)

        const currentVariablesList = await this.getEnvironmentVariables(programId, args.environmentId, flags.passphrase)
        const currentVariableTypes = {}
        currentVariablesList.forEach(variable => currentVariableTypes[variable.name] = variable.type)

        const variables = []
        if (flags.variable) {
            // each --param flag expects two values ( a key and a value ). Multiple --parm flags can be passed
            // For example : aio runtime:action:create --param name "foo" --param city "bar"
            const parsedVariables = createKeyValueObjectFromFlag(flags.variable)
            for (const key in parsedVariables) {
                variables.push({
                    name: key,
                    value: parsedVariables[key],
                    type: 'string'
                })
            }
        }
        if (flags.secret) {
            const parsedSecrets = createKeyValueObjectFromFlag(flags.secret)
            for (const key in parsedSecrets) {
                variables.push({
                    name: key,
                    value: parsedSecrets[key],
                    type: 'secretString'
                })
            }
        }
        if (flags.delete) {
            flags.delete.forEach(key => {
                if (currentVariableTypes[key]) {
                    variables.push({
                        name: key,
                        type: currentVariableTypes[key],
                        value: ''
                    })
                } else {
                    this.warn(`Variable ${key} not found. Will not try to delete.`)
                }
            })
        }

        if (variables.length > 0) {
            cli.action.start('setting variables')
            await this.setEnvironmentVariables(programId, args.environmentId, variables, flags.passphrase)
            cli.action.stop()
        } else {
            this.log("No variables to set or delete.")
        }

        let result

        try {
            result = await this.getEnvironmentVariables(programId, args.environmentId, flags.passphrase)
        } catch (error) {
            this.error(error.message)
        }
        this.outputTable(result)

        return result
    }

    async setEnvironmentVariables(programId, environmentId, variables, passphrase = null) {
        return _setEnvironmentVariables(programId, environmentId, variables, passphrase)
    }
}

SetEnvironmentVariablesCommand.description = 'sets variables set on an environment'

SetEnvironmentVariablesCommand.args = [
    {name: 'environmentId', required: true, description: "the environment id"}
]

SetEnvironmentVariablesCommand.flags = {
    ...commonFlags.global,
    ...commonFlags.programId,
    variable: flags.string({
        char: 'v',
        description: 'variable values in KEY VALUE format',
        multiple: true
    }),
    secret: flags.string({
        char: 's',
        description: 'secret values in KEY VALUE format',
        multiple: true
    }),
    delete: flags.string({
        char: 'd',
        description: 'variables/secrets to delete',
        multiple: true
    })
}

module.exports = SetEnvironmentVariablesCommand
