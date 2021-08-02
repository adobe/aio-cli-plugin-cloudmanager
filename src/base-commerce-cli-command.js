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

const { cli } = require('cli-ux')
const { initSdk } = require('./cloudmanager-helpers')
const BaseCommand = require('./base-command')

class BaseCommerceCliCommand extends BaseCommand {
  async runSync (programId, environmentId, body, pollingInterval, command, imsContextName = null) {
    this.warn('Commerce cli commands are in active development and may not be functional.')

    const sdk = await initSdk(imsContextName)
    const commandMessage = `Starting ${command}`
    cli.action.start(commandMessage)
    const { id: commandId } = await sdk.postCommerceCommandExecution(programId, environmentId, body)
    let result = await this.callGet(sdk, programId, environmentId, commandId, command)

    while (result.status === 'RUNNING' || result.status === 'PENDING') {
      await cli.wait(pollingInterval)
      result = await this.callGet(sdk, programId, environmentId, commandId, command)
    }
    cli.action.start(`${this.formatStatus(result.status)} ${command}`)
    cli.action.stop(result.message)
    return result
  }

  async callGet (sdk, programId, environmentId, commandId, command) {
    const getResponse = await sdk.getCommerceCommandExecution(programId, environmentId, commandId)
    const result = await getResponse
    cli.action.start(`${this.formatStatus(result.status)} ${command}`)
    return result
  }

  formatStatus (status) {
    return status === 'PENDING' ? 'Starting' : status[0].toUpperCase() + status.slice(1).toLowerCase()
  }
}

module.exports = BaseCommerceCliCommand
