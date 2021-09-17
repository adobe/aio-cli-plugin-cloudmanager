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

const { initSdk, getProgramId, getOutputFormat } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const _ = require('lodash')
const commonFlags = require('../../../common-flags')
const BaseCommand = require('../../../base-command')
const { codes: validationCodes } = require('../../../ValidationErrors')

function formatMetricName (name) {
  switch (name) {
    case 'pwa':
    case 'seo':
      return _.upperCase(name)
    default:
      return _.startCase(name.replace('sqale', 'maintainability'))
  }
}

class GetQualityGateResults extends BaseCommand {
  async run () {
    const { args, flags } = this.parse(GetQualityGateResults)

    const programId = getProgramId(flags)

    let result = await this.getQualityGateResults(programId, args.pipelineId, args.executionId, args.action, flags.imsContextName)

    result = result.metrics

    if (!result) {
      throw new validationCodes.MISSING_METRICS({ messageValues: [args.action, args.executionId] })
    }

    result = _.sortBy(result, 'severity')

    cli.table(result, {
      severity: {
        header: 'Severity',
        get: item => _.upperFirst(item.severity),
      },
      kpi: {
        header: 'Metric',
        get: item => formatMetricName(item.kpi),
      },
      expectedValue: {
        header: 'Expected Value',
      },
      actualValue: {
        header: 'Actual Value',
      },
      passed: {
        header: 'Passed?',
        get: item => item.passed ? 'Yes' : 'No',
      },
    }, {
      printLine: this.log,
      output: getOutputFormat(flags),
    })

    return result
  }

  async getQualityGateResults (programId, pipelineId, executionId, action, imsContextName = null) {
    if (action === 'experienceAudit') {
      action = 'contentAudit'
    }
    const sdk = await initSdk(imsContextName)
    return sdk.getQualityGateResults(programId, pipelineId, executionId, action)
  }
}

GetQualityGateResults.description = 'get quality gate results'

GetQualityGateResults.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId,
}

GetQualityGateResults.args = [
  { name: 'pipelineId', required: true, description: 'the pipeline id' },
  { name: 'executionId', required: true, description: 'the execution id' },
  {
    name: 'action',
    required: true,
    description: 'the step action',
    options: [
      'codeQuality',
      'security',
      'performance',
      'contentAudit',
      'experienceAudit',
    ],
  },
]

GetQualityGateResults.aliases = [
  'cloudmanager:get-quality-gate-results',
]

GetQualityGateResults.permissionInfo = {}

module.exports = GetQualityGateResults
