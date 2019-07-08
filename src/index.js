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

const ListProgramsCommand = require('./commands/cloudmanager/list-programs')
const ListPipelinesCommand = require('./commands/cloudmanager/list-pipelines')
const StartExecutionCommand = require('./commands/cloudmanager/start-execution')
const GetCurrentExecution = require('./commands/cloudmanager/get-current-execution')
const ListCurrentExecutions = require('./commands/cloudmanager/list-current-executions')
const GetQualityGateResults = require('./commands/cloudmanager/get-quality-gate-results')
const CloudManagerCommand = require('./commands/cloudmanager')
const CancelCurrentExecution = require('./commands/cloudmanager/cancel-current-execution')
const AdvanceCurrentExecution = require('./commands/cloudmanager/advance-current-execution')

module.exports = {
  'aaa': CloudManagerCommand, // needs to be first alphabetically
  'list-programs': new ListProgramsCommand().listPrograms,
  'list-pipelines': new ListPipelinesCommand().listPipelines,
  'start-execution': new StartExecutionCommand().startExecution,
  'get-current-execution': new GetCurrentExecution().getCurrentExecution,
  'list-current-executions': new ListCurrentExecutions().listCurrentExecutions,
  'get-quality-gate-results': new GetQualityGateResults().getQualityGateResults,
  'cancel-current-execution': new CancelCurrentExecution().cancelCurrentExecution,
  'advance-current-execution': new AdvanceCurrentExecution().advanceCurrentExecution
}
