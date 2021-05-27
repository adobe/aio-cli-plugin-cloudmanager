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

const BaseEnvironmentVariablesCommand = require('../../../base-environment-variables-command')
const BaseVariablesCommand = require('../../../base-variables-command')
const { initSdk, sanitizeEnvironmentId } = require('../../../cloudmanager-helpers')
const { flags } = require('@oclif/command')
const _ = require('lodash')
const commonFlags = require('../../../common-flags')

const services = ['author', 'publish', 'preview']

class SetEnvironmentVariablesCommand extends BaseEnvironmentVariablesCommand {
  getFlagDefs () {
    const coreFlagDefs = super.getFlagDefs()
    const result = {
      ...coreFlagDefs,
    }
    services.forEach(service => {
      Object.keys(coreFlagDefs).forEach(coreFlagKey => {
        const flagName = _.camelCase(`${service} ${coreFlagKey}`)
        result[flagName] = {
          ...coreFlagDefs[coreFlagKey],
          service,
        }
      })
    })
    return result
  }

  async run () {
    const { args, flags } = this.parse(SetEnvironmentVariablesCommand)

    return this.runSet(args, flags)
  }

  async setVariables (programId, args, variables, imsContextName = null) {
    const environmentId = sanitizeEnvironmentId(args.environmentId)
    const sdk = await initSdk(imsContextName)
    return sdk.setEnvironmentVariables(programId, environmentId, variables)
  }
}

SetEnvironmentVariablesCommand.description = 'sets variables set on an environment. These are runtime variables available to components running inside the runtime environment. Use set-pipeline-variables to set build-time variables on a pipeline.'

SetEnvironmentVariablesCommand.args = [
  { name: 'environmentId', required: true, description: 'the environment id' },
]

SetEnvironmentVariablesCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...BaseVariablesCommand.setterFlags,
}

services.forEach(service => {
  Object.keys(BaseVariablesCommand.coreSetterFlags).forEach(coreFlagKey => {
    const coreFlag = BaseVariablesCommand.coreSetterFlags[coreFlagKey]
    const flagName = _.camelCase(`${service} ${coreFlagKey}`)
    SetEnvironmentVariablesCommand.flags[flagName] = flags.string({
      description: `${coreFlag.description} for ${service} service`,
      multiple: true,
    })
  })
})

SetEnvironmentVariablesCommand.aliases = [
  'cloudmanager:set-environment-variables',
]

module.exports = SetEnvironmentVariablesCommand
