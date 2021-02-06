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
const StartExecutionCommand = require('../../../src/commands/cloudmanager/pipeline/create-execution')

beforeEach(() => {
  resetCurrentOrgId()
})

test('start-execution - missing arg', async () => {
  expect.assertions(2)

  const runResult = StartExecutionCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Missing 1 required arg') === 0)
})

test('start-execution - missing config', async () => {
  expect.assertions(3)

  const runResult = StartExecutionCommand.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toEqual(undefined)
  await expect(cli.action.stop.mock.calls[0][0]).toBe('Unable to find IMS context aio-cli-plugin-cloudmanager')
})

test('start-execution - some url', async () => {
  setCurrentOrgId('good')
  mockSdk.createExecution = jest.fn(() => Promise.resolve({
    id: '5000',
  }))

  expect.assertions(6)

  const runResult = StartExecutionCommand.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.createExecution.mock.calls.length).toEqual(1)
  await expect(mockSdk.createExecution).toHaveBeenCalledWith('5', '10')

  await expect(cli.action.stop.mock.calls[0][0]).toEqual('started execution ID 5000')
})
