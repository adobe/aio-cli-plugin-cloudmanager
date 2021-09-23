/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const BaseCommerceCliCommand = require('../../../../../../base-commerce-cli-command')
const { getProgramId } = require('../../../../../../cloudmanager-helpers')
const commonFlags = require('../../../../../../common-flags')
const commonArgs = require('../../../../../../common-args')
const commerceFlags = require('../../../../../../commerce-flags')

class AppConfigImportCommand extends BaseCommerceCliCommand {
  async run () {
    const { args, flags } = this.parse(AppConfigImportCommand)

    const programId = getProgramId(flags)

    const result = await this.runSync(programId, args.environmentId,
      {
        type: 'bin/magento',
        command: 'app:config:import',
        options: ['-n'],
      },
      1000, 'app:config:import')

    return result
  }
}

AppConfigImportCommand.description = 'commerce config import'

AppConfigImportCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...commerceFlags,
}

AppConfigImportCommand.args = [
  commonArgs.environmentId,
]

module.exports = AppConfigImportCommand
