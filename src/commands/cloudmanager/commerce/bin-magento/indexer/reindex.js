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
const { getProgramId } = require('../../../../../cloudmanager-helpers')
const commonFlags = require('../../../../../common-flags')
const commonArgs = require('../../../../../common-args')

class IndexerReindexCommand extends BaseCommerceCliCommand {
  async run () {
    const { args, flags } = this.parse(IndexerReindexCommand)

    const programId = getProgramId(flags)

    const result = await this.runSync(programId, args.environmentId,
      {
        type: 'bin/magento',
        command: 'indexer:reindex',
      },
      1000, 'indexer:reindex')

    return result
  }
}

IndexerReindexCommand.description = 'commerce indexer reindex'

IndexerReindexCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

IndexerReindexCommand.args = [
  commonArgs.environmentId,
]

IndexerReindexCommand.aliases = [
  'cloudmanager:commerce:indexer-reindex',
]

module.exports = IndexerReindexCommand
