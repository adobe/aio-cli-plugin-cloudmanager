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

const { initSdk } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const BaseCommand = require('../../../base-command')

class DeleteProgramCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(DeleteProgramCommand)

    cli.action.start('deleting program')

    const result = await this.deleteProgram(args.programId, flags.imsContextName)

    cli.action.stop(`deleted program ID ${args.programId}`)

    return result
  }

  async deleteProgram (programId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.deleteProgram(programId)
  }
}

DeleteProgramCommand.description = 'delete program'

DeleteProgramCommand.flags = {
  ...commonFlags.global,
}

DeleteProgramCommand.args = [
  { name: 'programId', required: true, description: 'the program id' },
]

DeleteProgramCommand.aliases = [
  'cloudmanager:delete-program',
]

module.exports = DeleteProgramCommand
