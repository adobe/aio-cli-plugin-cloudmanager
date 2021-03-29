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

const tmp = require('tmp')
const { cli } = require('cli-ux')
const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const GetExecutionStepLog = require('../../../src/commands/cloudmanager/execution/get-step-log')

beforeEach(() => {
  resetCurrentOrgId()
})

test('get-execution-step-log - missing arg', async () => {
  expect.assertions(2)

  const runResult = GetExecutionStepLog.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Missing 3 required args') === 0)
})

test('get-execution-step-log - missing config', async () => {
  expect.assertions(2)

  const runResult = GetExecutionStepLog.run(['5', '--programId', '7', '1001', 'codeQuality'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('Unable to find IMS context aio-cli-plugin-cloudmanager'))
})

test('get-execution-step-log - stdout', async () => {
  setCurrentOrgId('good')

  expect.assertions(5)

  const runResult = GetExecutionStepLog.run(['15', '--programId', '5', '1002', 'codeQuality'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.getExecutionStepLog.mock.calls.length).toEqual(1)
  await expect(mockSdk.getExecutionStepLog).toHaveBeenCalledWith('5', '15', '1002', 'codeQuality', undefined, process.stdout)
})

test('get-execution-step-log - success alternate file', async () => {
  setCurrentOrgId('good')

  expect.assertions(5)

  const runResult = GetExecutionStepLog.run(['--programId', '5', '7', '1001', 'codeQuality', '--file', 'somethingspecial'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.getExecutionStepLog.mock.calls.length).toEqual(1)
  await expect(mockSdk.getExecutionStepLog).toHaveBeenCalledWith('5', '7', '1001', 'codeQuality', 'somethingspecial', process.stdout)
})

test('get-execution-step-log - file', async () => {
  const tmpFile = tmp.fileSync()

  setCurrentOrgId('good')

  expect.assertions(11)

  const runResult = GetExecutionStepLog.run(['15', '--programId', '5', '1002', 'codeQuality', '--output', tmpFile.name])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.getExecutionStepLog.mock.calls.length).toEqual(1)
  await expect(mockSdk.getExecutionStepLog.mock.calls[0][0]).toEqual('5')
  await expect(mockSdk.getExecutionStepLog.mock.calls[0][1]).toEqual('15')
  await expect(mockSdk.getExecutionStepLog.mock.calls[0][2]).toEqual('1002')
  await expect(mockSdk.getExecutionStepLog.mock.calls[0][3]).toEqual('codeQuality')
  await expect(cli.action.start.mock.calls).toHaveLength(1)
  await expect(cli.action.start.mock.calls[0][0]).toEqual(`download codeQuality log to ${tmpFile.name}`)
  await expect(cli.action.stop.mock.calls).toHaveLength(1)
})
