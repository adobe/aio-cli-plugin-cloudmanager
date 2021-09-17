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
const { getProgramId } = require('../../../cloudmanager-helpers')
const commonFlags = require('../../../common-flags')
const commonArgs = require('../../../common-args')

class ListEnvironmentVariablesCommand extends BaseEnvironmentVariablesCommand {
  async run () {
    const { args, flags } = this.parse(ListEnvironmentVariablesCommand)

    const programId = getProgramId(flags)

    const result = await this.getVariables(programId, args, flags.imsContextName)

    this.outputTable(result, flags)

    return result
  }
}

ListEnvironmentVariablesCommand.description = 'lists variables set on an environment'

ListEnvironmentVariablesCommand.args = [
  commonArgs.environmentId,
]

ListEnvironmentVariablesCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...BaseVariablesCommand.getterFlags,
}

ListEnvironmentVariablesCommand.aliases = [
  'cloudmanager:list-environment-variables',
]

ListEnvironmentVariablesCommand.permissionInfo = {}

module.exports = ListEnvironmentVariablesCommand
