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

class CancelContentFlowCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(CancelContentFlowCommand)

    const programId = getProgramId(flags)
    cli.action.start(`cancelling content flow ${args.flowId}\n`)
    await this.cancelContentFlow(programId, args.flowId, flags.imsContextName)
    cli.action.stop(`cancel content flow accepted ${args.flowId}\n`)
  }

  async cancelContentFlow (programId, flowId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.cancelContentFlow(programId, flowId)
  }
}

CancelContentFlowCommand.description = 'Cancel the specified flow. The flow has to be running to be canceled.'

CancelContentFlowCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

CancelContentFlowCommand.args = [
  { name: 'flowId', required: true, description: 'the content flow id' },
]

CancelContentFlowCommand.aliases = [
  'cloudmanager:cancel-content-flow',
]

CancelContentFlowCommand.permissionInfo = {
  operation: 'cancelContentFlow',
}

module.exports = CancelContentFlowCommand
