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

const UnunbindIpAllowlist = require('../../../src/commands/cloudmanager/ip-allowlist/unbind')

const { cli } = require('cli-ux')
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

test('unbind -- bad service', async () => {
  mockSdk.removeIpAllowlistBinding = jest.fn(() => { throw new Error('test error') }) // should never get called

  expect.assertions(3)

  const runResult = UnunbindIpAllowlist.run(['--programId', '1', '2', '3', 'NONE'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toThrow(/^Expected NONE to be one of: author, publish/)
  await expect(mockSdk.removeIpAllowlistBinding.mock.calls.length).toEqual(0)
})

test('unbind -- fail', async () => {
  mockSdk.removeIpAllowlistBinding = jest.fn(() => { throw new Error('test error') })

  expect.assertions(4)

  const runResult = UnunbindIpAllowlist.run(['--programId', '1', '2', '3', 'author'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toThrow('test error')
  await expect(mockSdk.removeIpAllowlistBinding.mock.calls.length).toEqual(1)
  await expect(mockSdk.removeIpAllowlistBinding).toHaveBeenCalledWith('1', '2', '3', 'author')
})

test('unbind -- success', async () => {
  mockSdk.removeIpAllowlistBinding = jest.fn(() => Promise.resolve({
    id: '5',
  }))

  expect.assertions(6)

  const runResult = UnunbindIpAllowlist.run(['--programId', '1', '2', '3', 'author'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toBeTruthy()
  await expect(mockSdk.removeIpAllowlistBinding.mock.calls.length).toEqual(1)
  await expect(mockSdk.removeIpAllowlistBinding).toHaveBeenCalledWith('1', '2', '3', 'author')
  await expect(cli.action.start.mock.calls[0][0]).toEqual('removing IP allowlist 2 binding from environment 3 (author)')
  await expect(cli.action.stop.mock.calls[0][0]).toEqual('removed')
})
