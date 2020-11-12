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

const { Command } = require('@oclif/command')
const { accessToken: getAccessToken } = require('@adobe/aio-cli-plugin-jwt-auth')
const { getApiKey, getBaseUrl, getOrgId, getProgramId, getOutputFormat } = require('../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const _ = require('lodash')
const halfred = require('halfred')
const moment = require('moment')
const { init } = require('@adobe/aio-lib-cloudmanager')
const commonFlags = require('../../common-flags')

async function _getExecution (programId, pipelineId, executionId, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  return sdk.getExecution(programId, pipelineId, executionId)
}

function formatAction (stepState) {
  if (stepState.action === 'deploy') {
    return `${_.startCase(stepState.environmentType)} ${_.startCase(stepState.action)}`
  } else if (stepState.action === 'contentAudit') {
    return 'Experience Audit'
  } else {
    return _.startCase(stepState.action)
  }
}

function formatTime (property) {
  return (stepState) => stepState[property] ? moment(stepState[property]).format('LLL') : ''
}

function formatDuration (stepState) {
  return stepState.startedAt && stepState.finishedAt
    ? moment.duration(moment(stepState.finishedAt).diff(stepState.startedAt)).humanize()
    : ''
}

class GetExecutionStepDetails extends Command {
  async run () {
    const { args, flags } = this.parse(GetExecutionStepDetails)

    const programId = await getProgramId(flags)

    let result

    try {
      result = await this.getExecution(programId, args.pipelineId, args.executionId, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    if (result) {
      result = halfred.parse(result)

      const stepStates = result.embeddedArray('stepStates')

      const buildStep = stepStates.find(stepState => stepState.action === 'build')
      const codeQualityStep = stepStates.find(stepState => stepState.action === 'codeQuality')
      codeQualityStep.startedAt = buildStep.finishedAt

      cli.table(stepStates, {
        action: {
          header: 'Action',
          get: formatAction
        },
        status: {
          header: 'Status',
          get: (stepState) => _.startCase(stepState.status.toLowerCase())
        },
        startedAt: {
          header: 'Started At',
          get: formatTime('startedAt')
        },
        finishedAt: {
          header: 'Finished At',
          get: formatTime('finishedAt')
        },
        duration: {
          header: 'Duration',
          get: formatDuration
        }
      }, {
        printLine: this.log,
        output: getOutputFormat(flags)
      })

      return stepStates
    }

    return result
  }

  async getExecution (programId, pipelineId, executionId, passphrase = null) {
    return _getExecution(programId, pipelineId, executionId, passphrase)
  }
}

GetExecutionStepDetails.description = 'get execution step details'

GetExecutionStepDetails.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId
}

GetExecutionStepDetails.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' },
  { name: 'executionId', required: true, description: 'the execution id' }
]

module.exports = GetExecutionStepDetails
