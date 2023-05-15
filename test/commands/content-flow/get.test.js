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
const getContentFlow = require('../../../src/commands/cloudmanager/content-flow/get')

let mockSdk

beforeEach(() => {
  resetCurrentOrgId({})
  mockSdk = generateNewMock()
})

describe('content flow get', () => {
  test('get-content-flow - missing arg', async () => {
    expect.assertions(2)

    const runResult = getContentFlow.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toThrow(/^Missing 1 required arg/)
  })

  test('get-content-flow - missing config', async () => {
    expect.assertions(2)

    const runResult = getContentFlow.run(['--programId', '5', '10'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
  })

  test('get-content-flow - configured', async () => {
    setCurrentOrgId('good')
    expect.assertions(4)

    mockSdk.getContentFlow = jest.fn(() => Promise.resolve(require('../../data/contentFlow.json')))

    const runResult = getContentFlow.run(['--programId', '5', '10'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(
      expect.objectContaining({
        contentSetId: '123',
        contentFlowId: '45',
      }),
    )
    await expect(mockSdk.getContentFlow.mock.calls.length).toEqual(1)
    await expect(mockSdk.getContentFlow).toHaveBeenCalledWith('5', '10')
  })
})
