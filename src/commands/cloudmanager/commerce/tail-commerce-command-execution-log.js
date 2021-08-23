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

const BaseCommand = require('../../../base-command')
const { initSdk, getProgramId, sanitizeEnvironmentId } = require('../../../cloudmanager-helpers')
const commonFlags = require('../../../common-flags')

class TailCommerceCommandExecutionLog extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(TailCommerceCommandExecutionLog)

    const programId = getProgramId(flags)

    const environmentId = sanitizeEnvironmentId(args.environmentId)

    const result = await this.tailLog(programId, environmentId, args.commandExecutionId, flags.imsContextName)

    this.log()

    return result
  }

  async tailLog (programId, environmentId, commandExecutionId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.tailCommerceCommandExecutionLog(programId, environmentId, commandExecutionId, process.stdout)
  }
}

TailCommerceCommandExecutionLog.description = 'outputs a stream of log data for the specified environment and commerce execution id'

TailCommerceCommandExecutionLog.args = [
  { name: 'environmentId', required: true, description: 'the environment id' },
  { name: 'commandExecutionId', required: true, description: 'the commerece command execution id' },
]

TailCommerceCommandExecutionLog.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

TailCommerceCommandExecutionLog.aliases = ['cloudmanager:tail-logs', 'cloudmanager:tail-log']

module.exports = TailCommerceCommandExecutionLog
