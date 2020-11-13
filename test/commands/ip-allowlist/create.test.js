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

const CreateIpAllowlist = require('../../../src/commands/cloudmanager/ip-allowlist/create')

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

test('create -- fail', async () => {
  mockSdk.createIpAllowlist = jest.fn(() => { throw new Error('test error') })

  expect.assertions(4)

  const runResult = CreateIpAllowlist.run(['--programId', '1', 'test1', '-c', '1.1.1.1/5', '-c', '2.2.2.2/5'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toThrow('test error')
  await expect(mockSdk.createIpAllowlist.mock.calls.length).toEqual(1)
  await expect(mockSdk.createIpAllowlist).toHaveBeenCalledWith('1', 'test1', ['1.1.1.1/5', '2.2.2.2/5'])
})

test('create -- no cidrs', async () => {
  mockSdk.createIpAllowlist = jest.fn(() => Promise.resolve({
    id: '5',
  }))

  expect.assertions(3)

  const runResult = CreateIpAllowlist.run(['--programId', '1', 'test1'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toThrow(/CIDR/)
  await expect(mockSdk.createIpAllowlist.mock.calls.length).toEqual(0)
})

test('create -- success multiple', async () => {
  mockSdk.createIpAllowlist = jest.fn(() => Promise.resolve({
    id: '5',
  }))

  expect.assertions(5)

  const runResult = CreateIpAllowlist.run(['--programId', '1', 'test1', '-c', '1.1.1.1/5', '-c', '2.2.2.2/5'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toBeTruthy()
  await expect(mockSdk.createIpAllowlist.mock.calls.length).toEqual(1)
  await expect(mockSdk.createIpAllowlist).toHaveBeenCalledWith('1', 'test1', ['1.1.1.1/5', '2.2.2.2/5'])
  await expect(cli.action.stop.mock.calls[0][0]).toEqual('created IP Allowlist 5')
})

test('create -- success single', async () => {
  mockSdk.createIpAllowlist = jest.fn(() => Promise.resolve({
    id: '5',
  }))

  expect.assertions(5)

  const runResult = CreateIpAllowlist.run(['--programId', '1', 'test1', '-c', '1.1.1.1/5'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toBeTruthy()
  await expect(mockSdk.createIpAllowlist.mock.calls.length).toEqual(1)
  await expect(mockSdk.createIpAllowlist).toHaveBeenCalledWith('1', 'test1', ['1.1.1.1/5'])
  await expect(cli.action.stop.mock.calls[0][0]).toEqual('created IP Allowlist 5')
})
