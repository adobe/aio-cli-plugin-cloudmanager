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
const ListEnvironments = require('./commands/cloudmanager/list-environments')
const GetExecutionStepDetails = require('./commands/cloudmanager/get-execution-step-details')
const GetExecutionStepLog = require('./commands/cloudmanager/get-execution-step-log')
const ListAvailableLogOptions = require('./commands/cloudmanager/list-available-log-options')
const DownloadLogs = require('./commands/cloudmanager/download-logs')
const TailLog = require('./commands/cloudmanager/tail-log')
const DeletePipeline = require('./commands/cloudmanager/delete-pipeline')
const UpdatePipeline = require('./commands/cloudmanager/update-pipeline')
const OpenDeveloperConsole = require('./commands/cloudmanager/open-developer-console')
const DeleteProgram = require('./commands/cloudmanager/delete-program')

module.exports = {
  'aaa': CloudManagerCommand, // needs to be first alphabetically
  'list-programs': new ListProgramsCommand().listPrograms,
  'list-pipelines': new ListPipelinesCommand().listPipelines,
  'start-execution': new StartExecutionCommand().startExecution,
  'get-current-execution': new GetCurrentExecution().getCurrentExecution,
  'list-current-executions': new ListCurrentExecutions().listCurrentExecutions,
  'get-quality-gate-results': new GetQualityGateResults().getQualityGateResults,
  'cancel-current-execution': new CancelCurrentExecution().cancelCurrentExecution,
  'advance-current-execution': new AdvanceCurrentExecution().advanceCurrentExecution,
  'list-environments': new ListEnvironments().listEnvironments,
  'get-execution-step-details': new GetExecutionStepDetails().getExecution,
  'get-execution-step-log': new GetExecutionStepLog().getExecutionStepLog,
  'list-available-log-options': new ListAvailableLogOptions().listAvailableLogOptions,
  'download-logs': new DownloadLogs().downloadLogs,
  'tail-log': new TailLog().tailLog,
  'delete-pipeline': new DeletePipeline().deletePipeline,
  'update-pipeline': new UpdatePipeline().updatePipeline,
  'open-developer-console': new OpenDeveloperConsole().getDeveloperConsoleUrl,
  'delete-program': new DeleteProgram().deleteProgram
}
