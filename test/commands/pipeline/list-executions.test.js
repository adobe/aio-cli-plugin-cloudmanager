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
const ListExecutionsCommand = require('../../../src/commands/cloudmanager/pipeline/list-executions')

beforeEach(() => {
  resetCurrentOrgId()
})

test('list-execution - missing arg', async () => {
  expect.assertions(2)

  const runResult = ListExecutionsCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow(/^Missing 1 required arg/)
})

test('list-execution - missing config', async () => {
  expect.assertions(2)

  const runResult = ListExecutionsCommand.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('Unable to find IMS context aio-cli-plugin-cloudmanager')
})

test('list-executions -- fail', async () => {
  setCurrentOrgId('good')
  mockSdk.listExecutions = jest.fn(() => Promise.reject(new Error('some error')))

  expect.assertions(6)

  const runResult = ListExecutionsCommand.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('some error')
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.listExecutions.mock.calls.length).toEqual(1)
  await expect(mockSdk.listExecutions).toHaveBeenCalledWith('5', '10', 20)
})

test('list-executions -- success', async () => {
  setCurrentOrgId('good')
  mockSdk.listExecutions = jest.fn(() => {
    return { tested: true }
  })

  expect.assertions(7)

  const runResult = ListExecutionsCommand.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toEqual({ tested: true })
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.listExecutions.mock.calls.length).toEqual(1)
  await expect(mockSdk.listExecutions).toHaveBeenCalledWith('5', '10', 20)
  await expect(Object.keys(cli.table.mock.calls[0][1])).toEqual([
    'pipelineId',
    'id',
    'createdAt',
    'status',
    'trigger',
    'currentStep',
    'currentStepStatus',
  ])
})
