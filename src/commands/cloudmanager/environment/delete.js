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

const { initSdk, getProgramId, sanitizeEnvironmentId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const commonArgs = require('../../../common-args')
const BaseCommand = require('../../../base-command')

class DeleteEnvironmentCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(DeleteEnvironmentCommand)

    const programId = getProgramId(flags)

    const environmentId = sanitizeEnvironmentId(args.environmentId)

    cli.action.start('deleting environment')

    const result = await this.deleteEnvironment(programId, environmentId, flags.imsContextName)

    cli.action.stop(`deleted environment ID ${environmentId}`)

    return result
  }

  async deleteEnvironment (programId, environmentId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.deleteEnvironment(programId, environmentId)
  }
}

DeleteEnvironmentCommand.description = 'delete environment'

DeleteEnvironmentCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

DeleteEnvironmentCommand.args = [
  commonArgs.environmentId,
]

DeleteEnvironmentCommand.aliases = [
  'cloudmanager:delete-environment',
]

DeleteEnvironmentCommand.permissionInfo = {
  operation: 'deleteEnvironment',
}

module.exports = DeleteEnvironmentCommand
