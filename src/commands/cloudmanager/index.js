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

class CloudManagerCommand extends Command { }

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
    '$ aio cloudmanager:get-quality-gate-results --programId=PROGRAM_ID PIPELINE_ID [codeQuality|security|performance]'
  ]

CloudManagerCommand.flags = {
  passphrase: flags.string({ char: 'r', description: 'the passphrase for the private-key' })
}

module.exports = CloudManagerCommand
