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

const BaseCommand = require('../../../base-command')
const { initSdk, getProgramId, sanitizeEnvironmentId } = require('../../../cloudmanager-helpers')
const commonFlags = require('../../../common-flags')
const commonArgs = require('../../../common-args')

class TailLog extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(TailLog)

    const programId = getProgramId(flags)

    const environmentId = sanitizeEnvironmentId(args.environmentId)

    const result = await this.tailLog(programId, environmentId, args.service, args.name, flags.imsContextName)

    this.log()

    return result
  }

  async tailLog (programId, environmentId, service, logName, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.tailLog(programId, environmentId, service, logName, process.stdout)
  }
}

TailLog.description = 'outputs a stream of log data for the specified environment, service and log name'

TailLog.args = [
  commonArgs.environmentId,
  { name: 'service', required: true, description: 'the service' },
  { name: 'name', required: true, description: 'the log name' },
]

TailLog.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

TailLog.aliases = ['cloudmanager:tail-logs', 'cloudmanager:tail-log']

module.exports = TailLog
