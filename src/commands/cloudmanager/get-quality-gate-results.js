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
const _ = require("lodash")
const Client = require('../../client')
const globalFlags = require('./index').flags

async function _getQualityGateResults (programId, pipelineId, executionId, action, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  return new Client(orgId, accessToken, apiKey).getQualityGateResults(programId, pipelineId, executionId, action)
}

function formatMetricName(name) {
    return _.startCase(name.replace('sqale', 'maintainability'))
}

class GetQualityGateResults extends Command {
  async run () {
    const { args, flags } = this.parse(GetQualityGateResults)

    const programId = await getProgramId(flags)

    let result;

    try {
      result = await this.getQualityGateResults(programId, args.pipelineId, args.executionId, args.action, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }

    result = result.metrics

    if (!result) {
        throw new Error(`Metrics for action ${args.action} on execution ${args.executionId} could not be found.`)
    }

    result = _.sortBy(result, "severity")

    cli.table(result, {
      severity: {
        header: "Severity",
        get: item => _.upperFirst(item.severity)
      },
      kpi: {
        header: "Metric",
        get: item => formatMetricName(item.kpi)
      },
      expectedValue: {
        header: "Expected Value"
      },
      actualValue: {
        header: "Actual Value"
      },
      passed: {
        header: "Passed?",
        get: item => item.passed ? "Yes" : "No"
      }
    }, {
      printLine: this.log
    })

    return result
  }

  async getQualityGateResults (programId, pipelineId, executionId, action, passphrase = null) {
    return _getQualityGateResults(programId, pipelineId, executionId, action, passphrase)
  }
}

GetQualityGateResults.description = 'get quality gate results'

GetQualityGateResults.flags = {
  ...globalFlags,
  programId: flags.string({ char: 'p', description: "the programId. if not specified, defaults to 'cloudmanager_programid' config value"})
}

GetQualityGateResults.args = [
    {name: 'pipelineId', required: true, description: "the pipeline id"},
    {name: 'executionId', required: true, description: "the execution id"},
    {name: 'action', required: true, description: "the step action", options: [
        'codeQuality',
        'security',
        'performance'
    ]},
]


module.exports = GetQualityGateResults
