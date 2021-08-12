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

const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const InvalidatePipelineCacheCommand = require('../../../src/commands/cloudmanager/pipeline/invalidate-cache')

beforeEach(() => {
  resetCurrentOrgId()
})

test('invalidate-cache - missing arg', async () => {
  expect.assertions(2)

  const runResult = InvalidatePipelineCacheCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow(/^Missing 1 required arg/)
})

test('invalidate-cache - missing config', async () => {
  expect.assertions(2)

  const runResult = InvalidatePipelineCacheCommand.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
})

test('invalidate-cache - configured', async () => {
  setCurrentOrgId('good')

  expect.assertions(5)

  const runResult = InvalidatePipelineCacheCommand.run(['--programId', '5', '7'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.invalidatePipelineCache.mock.calls.length).toEqual(1)
  await expect(mockSdk.invalidatePipelineCache).toHaveBeenCalledWith('5', '7')
})
