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
const commonArgs = require('../../../../../common-args')
const commonCommerceFlags = require('../../../../../common-commerce-flags')
const commonCommerceArgs = require('../../../../../common-commerce-args')

class CacheCleanCommand extends BaseCommerceCliCommand {
  async run () {
    const { args, flags, argv } = this.parse(CacheCleanCommand)

    const programId = getProgramId(flags)
    const cacheTypes = argv.slice(1)

    const result = await this.runSync(programId, args.environmentId,
      {
        type: 'bin/magento',
        command: 'cache:clean',
        options: ['-n', ...cacheTypes, ...getFormattedFlags(flags, CacheCleanCommand)],
      },
      1000, 'cache:clean')

    return result
  }
}

CacheCleanCommand.strict = false

CacheCleanCommand.description = 'commerce cache clean'

CacheCleanCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  ...commonCommerceFlags.quiet,
  ...commonCommerceFlags.verbose,
  ...commonCommerceFlags.version,
  ...commonCommerceFlags.ansi,
}

CacheCleanCommand.args = [
  commonArgs.environmentId,
  commonCommerceArgs.cacheType,
]

CacheCleanCommand.aliases = [
  'cloudmanager:commerce:cache-clean',
]

module.exports = CacheCleanCommand
