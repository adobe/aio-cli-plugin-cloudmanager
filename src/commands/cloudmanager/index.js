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
const commonFlags = require('../../common-flags')

class CloudManagerCommand extends Command {
  async run () {
    this._help()
  }
}

CloudManagerCommand.description = 'interact with the Cloud Manager API to list, start, cancel, and inspect pipelines and executions.'

CloudManagerCommand.examples = [
  '$ aio cloudmanager:list-programs',
  '$ aio cloudmanager:list-programs --enabledonly',

  '$ aio cloudmanager:list-pipelines',
  '$ aio cloudmanager:list-pipelines --programId=PROGRAM_ID',

  '$ aio cloudmanager:start-execution PIPELINE_ID',
  '$ aio cloudmanager:start-execution --programId=PROGRAM_ID PIPELINE_ID',

  '$ aio cloudmanager:list-current-executions',
  '$ aio cloudmanager:list-current-executions --programId=PROGRAM_ID',

  '$ aio cloudmanager:get-current-execution PIPELINE_ID',
  '$ aio cloudmanager:get-current-execution --programId=PROGRAM_ID PIPELINE_ID',

  '$ aio cloudmanager:get-quality-gate-results PIPELINE_ID [codeQuality|security|performance]',
  '$ aio cloudmanager:get-quality-gate-results --programId=PROGRAM_ID PIPELINE_ID [codeQuality|security|performance]',

  '$ aio cloudmanager:get-execution-step-details PIPELINE_ID EXECUTION_ID',
  '$ aio cloudmanager:get-execution-step-details --programId=PROGRAM_ID PIPELINE_ID EXECUTION_ID',

  '$ aio cloudmanager:get-execution-step-log PIPELINE_ID',
  '$ aio cloudmanager:get-execution-step-log --programId=PROGRAM_ID PIPELINE_ID [build|codeQuality|devDeploy|stageDeploy|prodDeploy]',

  '$ aio cloudmanager:cancel-current-execution PIPELINE_ID',
  '$ aio cloudmanager:cancel-current-execution --programId=PROGRAM_ID PIPELINE_ID',

  '$ aio cloudmanager:advance-current-execution PIPELINE_ID',
  '$ aio cloudmanager:advance-current-execution --programId=PROGRAM_ID PIPELINE_ID',

  '$ aio cloudmanager:delete-pipeline PIPELINE_ID',
  '$ aio cloudmanager:delete-pipeline --programId=PROGRAM_ID PIPELINE_ID',

  '$ aio cloudmanager:update-pipeline PIPELINE_ID --branch=NEW_BRANCH',
  '$ aio cloudmanager:update-pipeline --programId=PROGRAM_ID PIPELINE_ID --branch=NEW_BRANCH',

  '$ aio cloudmanager:list-environments',
  '$ aio cloudmanager:list-environments --programId=PROGRAM_ID',

  '$ aio cloudmanager:list-available-log-options ENVIRONMENT_ID',
  '$ aio cloudmanager:list-available-log-options --programId=PROGRAM_ID ENVIRONMENT_ID',

  '$ aio cloudmanager:download-logs ENVIRONMENT_ID SERVICE NAME',
  '$ aio cloudmanager:download-logs ENVIRONMENT_ID SERVICE NAME DAYS',
  '$ aio cloudmanager:download-logs --programId=PROGRAM_ID ENVIRONMENT_ID SERVICE NAME DAYS',

  '$ aio cloudmanager:tail-log ENVIRONMENT_ID SERVICE NAME',
  '$ aio cloudmanager:tail-log --programId=PROGRAM_ID ENVIRONMENT_ID SERVICE NAME'
]

CloudManagerCommand.flags = commonFlags.global

module.exports = CloudManagerCommand
