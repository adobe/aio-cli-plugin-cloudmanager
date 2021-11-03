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
const commonCommerceArgs = require('../../../../../common-commerce-args')

class CacheFlushCommand extends BaseCommerceCliCommand {
  async run () {
    const { flags, argv } = this.parse(CacheFlushCommand)

    const programId = getProgramId(flags)

    const result = await this.runSync(programId, flags.environmentId,
      {
        type: 'bin/magento',
        command: 'cache:flush',
        options: ['-n', ...argv, ...getFormattedFlags(flags, CacheFlushCommand)],
      },
      1000, 'cache:flush')

    return result
  }
}

CacheFlushCommand.strict = false

CacheFlushCommand.description = 'commerce cache flush'

CacheFlushCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...commonCommerceFlags.environmentId,
  ...commonCommerceFlags.quiet,
  ...commonCommerceFlags.verbose,
  ...commonCommerceFlags.version,
  ...commonCommerceFlags.ansi,
}

CacheFlushCommand.args = [
  commonCommerceArgs.cacheType,
]

CacheFlushCommand.aliases = [
  'cloudmanager:commerce:cache-flush',
]

module.exports = CacheFlushCommand
