/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { initSdk, getProgramId } = require('../../../cloudmanager-helpers')
const commonFlags = require('../../../common-flags')
const BaseCommand = require('../../../base-command')
const { cli } = require('cli-ux')

class DeleteContentSetCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(DeleteContentSetCommand)

    const programId = getProgramId(flags)
    cli.action.start(`deleting content set ${args.contentSetId}\n`)
    await this.deleteContentSet(programId, args.contentSetId, flags.imsContextName)
    cli.action.stop(`content set ${args.contentSetId} deleted\n`)
  }

  async deleteContentSet (programId, contentSetId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.deleteContentSet(programId, contentSetId)
  }
}

DeleteContentSetCommand.description = 'Delete the specified content set.'

DeleteContentSetCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

DeleteContentSetCommand.args = [
  { name: 'contentSetId', required: true, description: 'the content set id' },
]

DeleteContentSetCommand.aliases = [
  'cloudmanager:delete-content-set',
]

DeleteContentSetCommand.permissionInfo = {
  operation: 'deleteContentSet',
}

module.exports = DeleteContentSetCommand
