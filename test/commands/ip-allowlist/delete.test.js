/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const DeleteIpAllowlist = require('../../../src/commands/cloudmanager/ip-allowlist/delete')

const { setStore } = require('@adobe/aio-lib-core-config')
const { generateNewMock } = require('@adobe/aio-lib-cloudmanager')

let mockSdk

beforeEach(() => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good',
      },
    }),
  })
  mockSdk = generateNewMock()
})

test('delete -- fail', async () => {
  mockSdk.deleteIpAllowlist = jest.fn(() => { throw new Error('test error') })

  expect.assertions(4)

  const runResult = DeleteIpAllowlist.run(['5', '--programId', '1'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toThrow('test error')
  await expect(mockSdk.deleteIpAllowlist.mock.calls.length).toEqual(1)
  await expect(mockSdk.deleteIpAllowlist).toHaveBeenCalledWith('1', '5')
})

test('delete -- success', async () => {
  mockSdk.deleteIpAllowlist = jest.fn(() => Promise.resolve({}))

  expect.assertions(4)

  const runResult = DeleteIpAllowlist.run(['5', '--programId', '1'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toBeTruthy()
  await expect(mockSdk.deleteIpAllowlist.mock.calls.length).toEqual(1)
  await expect(mockSdk.deleteIpAllowlist).toHaveBeenCalledWith('1', '5')
})
