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

const BaseCommerceCliCommand = require('../../../../../base-commerce-cli-command')
const { getProgramId, getFormattedFlags } = require('../../../../../cloudmanager-helpers')
const commonFlags = require('../../../../../common-flags')
const commonCommerceFlags = require('../../../../../common-commerce-flags')

class MaintenanceEnableCommand extends BaseCommerceCliCommand {
  async run () {
    const { flags } = this.parse(MaintenanceEnableCommand)

    const programId = getProgramId(flags)

    const result = await this.runSync(programId, flags.environmentId,
      {
        type: 'bin/magento',
        command: 'maintenance:enable',
        options: [...getFormattedFlags(flags, MaintenanceEnableCommand)],
      },
      1000, 'maintenance:enable')

    return result
  }
}

MaintenanceEnableCommand.description = 'commerce maintenance enable'

MaintenanceEnableCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...commonCommerceFlags.environmentId,
  ...commonCommerceFlags.quiet,
  ...commonCommerceFlags.verbose,
  ...commonCommerceFlags.version,
  ...commonCommerceFlags.ansi,
}

MaintenanceEnableCommand.aliases = [
  'cloudmanager:commerce:maintenance-enable',
]

module.exports = MaintenanceEnableCommand
