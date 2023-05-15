/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { setCurrentOrgId, resetCurrentOrgId } = require('@adobe/aio-lib-ims')
const { generateNewMock } = require('@adobe/aio-lib-cloudmanager')
const createConentFlow = require('../../../src/commands/cloudmanager/content-flow/create')

let mockSdk

beforeEach(() => {
  resetCurrentOrgId({})
  mockSdk = generateNewMock()
})
describe('content flow create', () => {
  test('create-content-flow - missing arg', async () => {
    expect.assertions(2)

    const runResult = createConentFlow.run(['--programId', '5', '--environmentId', '10'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toThrow(/^Missing 2 required arg/)
  })

  test('create-content-flow - missing config', async () => {
    expect.assertions(2)

    const runResult = createConentFlow.run(['--programId', '5', '--environmentId', '10', '--contentSetId', '123'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
  })

  test('create-content-flow - configured', async () => {
    setCurrentOrgId('good')
    expect.assertions(4)

    mockSdk.createContentFlow = jest.fn(() => Promise.resolve(require('../../data/contentFlow.json')))

    const runResult = createConentFlow.run(['--programId', '5', '10', '123', '1234', 'true', 'author'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(
      expect.objectContaining({
        contentSetId: '123',
        contentFlowId: '45',
      }),
    )
    await expect(mockSdk.createContentFlow.mock.calls.length).toEqual(1)
    await expect(mockSdk.createContentFlow).toHaveBeenCalledWith('5', '10',
      {
        contentSetId: '123',
        destEnvironmentId: '1234',
        includeACL: 'true',
        tier: 'author',
        mergeExcludePaths: 'false',
      })
  })
})
