/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const TailCommerceCommandExecutionLog = require('../../../src/commands/cloudmanager/commerce/tail-commerce-command-execution-log')

beforeEach(() => {
  resetCurrentOrgId()
})

test('commerce-tail-log - missing arg', async () => {
  expect.assertions(2)

  const runResult = TailCommerceCommandExecutionLog.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow(/^Missing 2 required arg/)
})

test('commerce-tail-log - missing config', async () => {
  expect.assertions(2)

  const runResult = TailCommerceCommandExecutionLog.run(['5', '123', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
})

test('commerce-tail-log - config', async () => {
  setCurrentOrgId('good')

  expect.assertions(5)

  const runResult = TailCommerceCommandExecutionLog.run(['17', '123', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.tailCommerceCommandExecutionLog.mock.calls.length).toEqual(1)
  await expect(mockSdk.tailCommerceCommandExecutionLog).toHaveBeenCalledWith('5', '17', '123', process.stdout)
})
