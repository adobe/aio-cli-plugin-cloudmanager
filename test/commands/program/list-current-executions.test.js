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

const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const ListCurrentExecutions = require('../../../src/commands/cloudmanager/program/list-current-executions')

beforeEach(() => {
  resetCurrentOrgId()
})

test('list-current-executions - missing arg', async () => {
  expect.assertions(2)

  const runResult = ListCurrentExecutions.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:MISSING_PROGRAM_ID] Program ID must be specified either as --programId flag or through cloudmanager_programid config value.')
})

test('list-current-executions - missing config', async () => {
  expect.assertions(2)

  const runResult = ListCurrentExecutions.run(['--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
})

test('list-current-executions - success', async () => {
  setCurrentOrgId('good')

  expect.assertions(7)

  const runResult = ListCurrentExecutions.run(['--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.listPipelines.mock.calls.length).toEqual(1)
  await expect(mockSdk.listPipelines).toHaveBeenCalledWith('5', { busy: true })
  await expect(mockSdk.getCurrentExecution.mock.calls.length).toEqual(1)
  await expect(mockSdk.getCurrentExecution).toHaveBeenCalledWith('5', '10')
})
