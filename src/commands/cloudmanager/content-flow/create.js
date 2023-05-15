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

const { initSdk, getProgramId, sanitizeEnvironmentId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const commonArgs = require('../../../common-args')
const BaseCommand = require('../../../base-command')

class CreateContentFlowCommand extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(CreateContentFlowCommand)
    const programId = getProgramId(flags)

    const environmentId = sanitizeEnvironmentId(args.environmentId)

    const createInfo = {
      contentSetId: args.contentSetId,
      destEnvironmentId: args.destEnvironmentId,
      includeACL: args.includeACL,
      tier: args.tier,
      mergeExcludePaths: 'false',
    }
    cli.action.start(`Creating content flow for pid: ${programId} env: ${environmentId}   values: ${JSON.stringify(createInfo)}.`)

    const result = await this.createContentFlow(programId, environmentId, createInfo, flags.imsContextName)

    cli.action.stop(`Created content flow ${result.contentFlowId}`)

    return result
  }

  async createContentFlow (programId, environmentId, contentSet, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.createContentFlow(programId, environmentId, contentSet)
  }
}

CreateContentFlowCommand.description = 'Create a content flow'

CreateContentFlowCommand.args = [
  commonArgs.environmentId,
  { name: 'contentSetId', required: true, description: 'Id of content set to use' },
  { name: 'destEnvironmentId', required: true, description: 'The destination environment id' },
  { name: 'includeACL', required: true, description: 'Include ACLs' },
  { name: 'tier', required: false, description: 'The tier, for example author', default: 'author' },
]

CreateContentFlowCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

CreateContentFlowCommand.aliases = [
  'cloudmanager:create-content-flow',
]

CreateContentFlowCommand.permissionInfo = {
  operation: 'createContentFlow',
}

module.exports = CreateContentFlowCommand
