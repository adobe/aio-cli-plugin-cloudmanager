/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { setCurrentOrgId, resetCurrentOrgId } = require('@adobe/aio-lib-ims')
const { generateNewMock } = require('@adobe/aio-lib-cloudmanager')
const cancelContentFlow = require('../../../src/commands/cloudmanager/content-flow/cancel')

let mockSdk

beforeEach(() => {
  resetCurrentOrgId({})
  mockSdk = generateNewMock()
})
describe('cancel content flow', () => {
  test('cancel-content-flow - missing arg', async () => {
    expect.assertions(2)

    const runResult = cancelContentFlow.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toThrow(/^Missing 1 required arg/)
  })

  test('cancel-content-flow - missing config', async () => {
    expect.assertions(2)

    const runResult = cancelContentFlow.run(['--programId', '5', '10'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
  })

  test('cancel-content-flow - configured', async () => {
    setCurrentOrgId('good')
    expect.assertions(3)

    mockSdk.cancelContentFlow = jest.fn(() => Promise.resolve())

    const runResult = cancelContentFlow.run(['--programId', '5', '10'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await runResult
    await expect(mockSdk.cancelContentFlow.mock.calls.length).toEqual(1)
    await expect(mockSdk.cancelContentFlow).toHaveBeenCalledWith('5', '10')
  })
})
