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

const { Command } = require('@oclif/command')
const { cli } = require('cli-ux')
const { initSdk } = require('./cloudmanager-helpers')
class BaseCommerceCommand extends Command {
  async runSync (programId, environmentId, body, pollingInterval, command, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    const commandMessage = `Starting ${command}`
    cli.action.start(commandMessage)
    const { id: commandId } = await sdk.postCLICommand(programId, environmentId, body)
    let result = await this.callGet(sdk, programId, environmentId, commandId, command)

    while (result.status === 'RUNNING' || result.status === 'CREATING') {
      await cli.wait(pollingInterval)
      result = await this.callGet(sdk, programId, environmentId, commandId, command)
    }
    cli.action.start(`${this.formatStatus(result.status)} ${command}`)
    cli.action.stop(result.message)
    return result
  }

  async callGet (sdk, programId, environmentId, commandId, command) {
    const getResponse = await sdk.getCLICommand(programId, environmentId, commandId)
    const result = await getResponse
    cli.action.start(`${this.formatStatus(result.status)} ${command}`)
    return result
  }

  formatStatus (status) {
    return status === 'CREATING' ? 'Starting' : status[0].toUpperCase() + status.slice(1).toLowerCase()
  }
}

module.exports = BaseCommerceCommand
