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
const { initSdk, getOutputFormat } = require('../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../common-flags')

class ListProgramsCommand extends Command {
  async run () {
    const { flags } = this.parse(ListProgramsCommand)
    let result

    try {
      result = await this.listPrograms(flags.imsContextName)
    } catch (error) {
      this.error(error.message)
    }

    if (flags.enabledonly) {
      result = result.filter(p => p.enabled)
    }

    cli.table(result, {
      id: {
        header: 'Program Id',
      },
      name: {},
      enabled: {},
    }, {
      printLine: this.log,
      output: getOutputFormat(flags),
    })

    return result
  }

  async listPrograms (imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.listPrograms()
  }
}

ListProgramsCommand.description = 'lists programs available in Cloud Manager'

ListProgramsCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  enabledonly: flags.boolean({ char: 'e', description: 'only output Cloud Manager-enabled programs' }),
}

module.exports = ListProgramsCommand
