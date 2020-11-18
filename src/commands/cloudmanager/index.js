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

  '$ aio cloudmanager:program:list-pipelines',
  '$ aio cloudmanager:program:list-pipelines --programId=PROGRAM_ID',

  '$ aio cloudmanager:pipeline:start-execution PIPELINE_ID',
  '$ aio cloudmanager:pipeline:start-execution --programId=PROGRAM_ID PIPELINE_ID',

  '$ aio cloudmanager:program:list-current-executions',
  '$ aio cloudmanager:program:list-current-executions --programId=PROGRAM_ID',

  '$ aio cloudmanager:pipeline:get-current-execution PIPELINE_ID',
  '$ aio cloudmanager:pipeline:get-current-execution --programId=PROGRAM_ID PIPELINE_ID',

  '$ aio cloudmanager:execution:get-quality-gate-results PIPELINE_ID [codeQuality|security|performance]',
  '$ aio cloudmanager:execution:get-quality-gate-results --programId=PROGRAM_ID PIPELINE_ID [codeQuality|security|performance]',

  '$ aio cloudmanager:execution:get-step-details PIPELINE_ID EXECUTION_ID',
  '$ aio cloudmanager:execution:get-step-details --programId=PROGRAM_ID PIPELINE_ID EXECUTION_ID',

  '$ aio cloudmanager:execution:get-step-log PIPELINE_ID',
  '$ aio cloudmanager:execution:get-step-log --programId=PROGRAM_ID PIPELINE_ID [build|codeQuality|devDeploy|stageDeploy|prodDeploy]',

  '$ aio cloudmanager:current-execution:cancel PIPELINE_ID',
  '$ aio cloudmanager:current-execution:cancel --programId=PROGRAM_ID PIPELINE_ID',

  '$ aio cloudmanager:current-execution:advance PIPELINE_ID',
  '$ aio cloudmanager:current-execution:advance --programId=PROGRAM_ID PIPELINE_ID',

  '$ aio cloudmanager:pipeline:delete PIPELINE_ID',
  '$ aio cloudmanager:pipeline:delete --programId=PROGRAM_ID PIPELINE_ID',

  '$ aio cloudmanager:pipeline:update PIPELINE_ID --branch=NEW_BRANCH',
  '$ aio cloudmanager:pipeline:update --programId=PROGRAM_ID PIPELINE_ID --branch=NEW_BRANCH',

  '$ aio cloudmanager:program:list-environments',
  '$ aio cloudmanager:program:list-environments --programId=PROGRAM_ID',

  '$ aio cloudmanager:environment:list-available-log-options ENVIRONMENT_ID',
  '$ aio cloudmanager:environment:list-available-log-options --programId=PROGRAM_ID ENVIRONMENT_ID',

  '$ aio cloudmanager:environment:download-logs ENVIRONMENT_ID SERVICE NAME',
  '$ aio cloudmanager:environment:download-logs ENVIRONMENT_ID SERVICE NAME DAYS',
  '$ aio cloudmanager:environment:download-logs --programId=PROGRAM_ID ENVIRONMENT_ID SERVICE NAME DAYS',

  '$ aio cloudmanager:environment:tail-log ENVIRONMENT_ID SERVICE NAME',
  '$ aio cloudmanager:environment:tail-log --programId=PROGRAM_ID ENVIRONMENT_ID SERVICE NAME',
]

CloudManagerCommand.flags = commonFlags.global

module.exports = CloudManagerCommand
