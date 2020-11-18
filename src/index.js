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
const ListPipelinesCommand = require('./commands/cloudmanager/program/list-pipelines')
const StartExecutionCommand = require('./commands/cloudmanager/pipeline/create-execution')
const GetCurrentExecution = require('./commands/cloudmanager/current-execution/get')
const ListCurrentExecutions = require('./commands/cloudmanager/program/list-current-executions')
const GetQualityGateResults = require('./commands/cloudmanager/execution/get-quality-gate-results')
const CancelCurrentExecution = require('./commands/cloudmanager/current-execution/cancel')
const AdvanceCurrentExecution = require('./commands/cloudmanager/current-execution/advance')
const ListEnvironments = require('./commands/cloudmanager/program/list-environments')
const GetExecutionStepDetails = require('./commands/cloudmanager/execution/get-step-details')
const GetExecutionStepLog = require('./commands/cloudmanager/execution/get-step-log')
const ListAvailableLogOptions = require('./commands/cloudmanager/environment/list-available-log-options')
const DownloadLogs = require('./commands/cloudmanager/environment/download-logs')
const TailLog = require('./commands/cloudmanager/environment/tail-log')
const DeletePipeline = require('./commands/cloudmanager/pipeline/delete')
const UpdatePipeline = require('./commands/cloudmanager/pipeline/update')
const OpenDeveloperConsole = require('./commands/cloudmanager/environment/open-developer-console')
const DeleteProgram = require('./commands/cloudmanager/program/delete')
const ListEnvironmentVariables = require('./commands/cloudmanager/environment/list-variables')
const SetEnvironmentVariables = require('./commands/cloudmanager/environment/set-variables')
const ListPipelineVariables = require('./commands/cloudmanager/pipeline/list-variables')
const SetPipelineVariables = require('./commands/cloudmanager/pipeline/set-variables')
const DeleteEnvironment = require('./commands/cloudmanager/environment/delete')

module.exports = {
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
  'delete-program': new DeleteProgram().deleteProgram,
  'list-environment-variables': new ListEnvironmentVariables().getVariables,
  'set-environment-variables': new SetEnvironmentVariables().setVariables,
  'list-pipeline-variables': new ListPipelineVariables().getVariables,
  'set-pipeline-variables': new SetPipelineVariables().setVariables,
  'delete-environment': new DeleteEnvironment().deleteEnvironment,
}
