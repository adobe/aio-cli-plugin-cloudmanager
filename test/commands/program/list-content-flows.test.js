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
const listContentFlows = require('../../../src/commands/cloudmanager/program/list-content-flows')

let mockSdk

beforeEach(() => {
  resetCurrentOrgId({})
  mockSdk = generateNewMock()
})

describe('list content flows', () => {
  test('list-content-flows - missing arg', async () => {
    expect.assertions(2)

    const runResult = listContentFlows.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toThrow('[CloudManagerCLI:MISSING_PROGRAM_ID] Program ID must be specified either as --programId flag or through cloudmanager_programid config value.')
  })

  test('list-content-flows - missing config', async () => {
    expect.assertions(2)

    const runResult = listContentFlows.run(['--programId', '5'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
  })

  test('list-content-flows - configured', async () => {
    setCurrentOrgId('good')
    mockSdk.listContentFlows = jest.fn(() => Promise.resolve(require('../../data/contentFlowList.json')))

    expect.assertions(5)

    const runResult = listContentFlows.run(['--programId', '5'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toHaveLength(2)
    await expect(runResult).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contentSetId: '123',
          status: 'IN_PROGRESS',
          contentFlowId: '11558',
        }),
        expect.objectContaining({
          contentFlowId: '1234',
          status: 'FAILED',
        }),
      ]),
    )
    await expect(mockSdk.listContentFlows.mock.calls.length).toEqual(1)
    await expect(mockSdk.listContentFlows).toHaveBeenCalledWith('5')
  })
})
