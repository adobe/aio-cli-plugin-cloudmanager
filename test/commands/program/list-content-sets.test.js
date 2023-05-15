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
const listContentSets = require('../../../src/commands/cloudmanager/program/list-content-sets')

let mockSdk

beforeEach(() => {
  resetCurrentOrgId({})
  mockSdk = generateNewMock()
})

describe('list content sets', () => {
  test('list-content-sets - missing arg', async () => {
    expect.assertions(2)

    const runResult = listContentSets.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toThrow('[CloudManagerCLI:MISSING_PROGRAM_ID] Program ID must be specified either as --programId flag or through cloudmanager_programid config value.')
  })

  test('list-content-sets - missing config', async () => {
    expect.assertions(2)

    const runResult = listContentSets.run(['--programId', '5'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
  })

  test('list-content-sets - configured', async () => {
    setCurrentOrgId('good')
    expect.assertions(5)

    mockSdk.listContentSets = jest.fn(() => Promise.resolve([
      {
        id: '7202',
        name: 'AIO Lib test 1',
        description: 'Test AIO library 1',
        programId: '67406',
      },
      {
        id: '7203',
        name: 'AIO Lib test 3',
        description: 'Test AIO library 3',
        programId: '67406',
      },
    ]))

    const runResult = listContentSets.run(['--programId', '5'])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toHaveLength(2)
    await expect(runResult).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '7202',
          name: 'AIO Lib test 1',
        }),
        expect.objectContaining({
          id: '7203',
          description: 'Test AIO library 3',
        }),
      ]),
    )

    await expect(mockSdk.listContentSets.mock.calls.length).toEqual(1)
    await expect(mockSdk.listContentSets).toHaveBeenCalledWith('5')
  })
})
