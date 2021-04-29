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
const { initSdk, getProgramId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')

class UpdatePipelineCommand extends Command {
  async run () {
    const { args, flags } = this.parse(UpdatePipelineCommand)

    const programId = getProgramId(flags)

    if (flags.tag && flags.branch) {
      throw new Error('Both branch and tag cannot be specified.')
    }

    if (flags.tag && flags.tag.startsWith('refs/tags/')) {
      throw new Error(`tag flag should not be specified with "refs/tags/" prefix. Value provided was ${flags.tag}`)
    }

    if (flags.tag) {
      flags.branch = `refs/tags/${flags.tag}`
    }

    let result

    cli.action.start('updating pipeline')

    try {
      result = await this.updatePipeline(programId, args.pipelineId, flags, flags.imsContextName)
      cli.action.stop(`updated pipeline ID ${args.pipelineId}`)
    } catch (error) {
      cli.action.stop(error.message)
      return
    }

    return result
  }

  async updatePipeline (programId, pipelineId, changes, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.updatePipeline(programId, pipelineId, changes)
  }
}

UpdatePipelineCommand.description = 'update pipeline'

UpdatePipelineCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
  branch: flags.string({ description: 'the new branch' }),
  tag: flags.string({ description: 'the new tag' }),
  repositoryId: flags.string({ description: 'the new repositoryId' }),
}

UpdatePipelineCommand.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' },
]

UpdatePipelineCommand.aliases = [
  'cloudmanager:update-pipeline',
]

module.exports = UpdatePipelineCommand
