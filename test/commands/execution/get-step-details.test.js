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

const { cli } = require('cli-ux')
const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const GetExecutionStepDetails = require('../../../src/commands/cloudmanager/execution/get-step-details')
const execution1010 = require('../../data/execution1010.json')

beforeEach(() => {
  resetCurrentOrgId()
})

test('get-execution-step-details - missing arg', async () => {
  expect.assertions(2)

  const runResult = GetExecutionStepDetails.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Missing 2 required args') === 0)
})

test('get-execution-step-details - missing config', async () => {
  expect.assertions(2)

  const runResult = GetExecutionStepDetails.run(['5', '--programId', '7', '1001'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('Unable to find IMS context aio-cli-plugin-cloudmanager'))
})

test('get-execution-step-details - no result', async () => {
  setCurrentOrgId('good')

  expect.assertions(6)

  const runResult = GetExecutionStepDetails.run(['5', '--programId', '5', '1002'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toBeUndefined()
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.getExecution.mock.calls.length).toEqual(1)
  await expect(mockSdk.getExecution).toHaveBeenCalledWith('5', '5', '1002')
})

test('get-execution-step-details - result', async () => {
  setCurrentOrgId('good')
  mockSdk.getExecution = jest.fn(() => execution1010)

  expect.assertions(12)

  const runResult = GetExecutionStepDetails.run(['5', '--programId', '5', '1002'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toBeTruthy()
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.getExecution.mock.calls.length).toEqual(1)
  await expect(mockSdk.getExecution).toHaveBeenCalledWith('5', '5', '1002')
  await expect(cli.table.mock.calls).toHaveLength(1)

  await expect(cli.table.mock.calls[0][1].status.get({ status: 'RUNNING' })).toEqual('Running')
  await expect(cli.table.mock.calls[0][1].action.get({ action: 'codeQuality' })).toEqual('Code Quality')
  await expect(cli.table.mock.calls[0][1].action.get({ action: 'contentAudit' })).toEqual('Experience Audit')
  await expect(cli.table.mock.calls[0][1].action.get({ action: 'deploy', environmentType: 'dev' })).toEqual('Dev Deploy')
  await expect(cli.table.mock.calls[0][1].duration.get(execution1010._embedded.stepStates[1])).toEqual('7 minutes')
})
