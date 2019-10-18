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

const { Command, flags } = require('@oclif/command')
const { accessToken: getAccessToken } = require('@adobe/aio-cli-plugin-jwt-auth')
const { getApiKey, getOrgId, getProgramId } = require('../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const Client = require('../../client')
const commonFlags = require('../../common-flags')

async function _updatePipeline (programId, pipelineId, changes, passphrase) {
  const orgId = await getOrgId()
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  return new Client(orgId, accessToken, apiKey).updatePipeline(programId, pipelineId, changes)
}

class UpdatePipelineCommand extends Command {
  async run () {
    const { args, flags } = this.parse(UpdatePipelineCommand)

    const programId = await getProgramId(flags)

    let result

    cli.action.start("updating pipeline")

    try {
      result = await this.updatePipeline(programId, args.pipelineId, flags, flags.passphrase)
      cli.action.stop(`updated pipeline ID ${args.pipelineId}`)
    } catch (error) {
      cli.action.stop(error.message)
      return
    }

    return result
  }

  async updatePipeline (programId, pipelineId, changes, passphrase = null) {
    return _updatePipeline(programId, pipelineId, changes, passphrase)
  }
}

UpdatePipelineCommand.description = 'update pipeline'

UpdatePipelineCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  branch: flags.string({ description: "the new branch"}),
  repositoryId: flags.string({ description: "the new repositoryId"})
}

UpdatePipelineCommand.args = [
  {name: 'pipelineId', required: true, description: "the pipeline id"}
]

module.exports = UpdatePipelineCommand
