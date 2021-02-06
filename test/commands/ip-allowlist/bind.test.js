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

const BindIpAllowlist = require('../../../src/commands/cloudmanager/ip-allowlist/bind')

const { cli } = require('cli-ux')
const { setCurrentOrgId } = require('@adobe/aio-lib-ims')
const { generateNewMock } = require('@adobe/aio-lib-cloudmanager')

let mockSdk

beforeEach(() => {
  setCurrentOrgId('good')
  mockSdk = generateNewMock()
})

test('bind -- bad service', async () => {
  mockSdk.addIpAllowlistBinding = jest.fn(() => { throw new Error('test error') }) // should never get called

  expect.assertions(3)

  const runResult = BindIpAllowlist.run(['--programId', '1', '2', '3', 'NONE'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toThrow(/^Expected NONE to be one of: author, publish/)
  await expect(mockSdk.addIpAllowlistBinding.mock.calls.length).toEqual(0)
})

test('bind -- fail', async () => {
  mockSdk.addIpAllowlistBinding = jest.fn(() => { throw new Error('test error') })

  expect.assertions(4)

  const runResult = BindIpAllowlist.run(['--programId', '1', '2', '3', 'author'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toThrow('test error')
  await expect(mockSdk.addIpAllowlistBinding.mock.calls.length).toEqual(1)
  await expect(mockSdk.addIpAllowlistBinding).toHaveBeenCalledWith('1', '2', '3', 'author')
})

test('bind -- success', async () => {
  mockSdk.addIpAllowlistBinding = jest.fn(() => Promise.resolve({
    id: '5',
  }))

  expect.assertions(6)

  const runResult = BindIpAllowlist.run(['--programId', '1', '2', '3', 'author'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toBeTruthy()
  await expect(mockSdk.addIpAllowlistBinding.mock.calls.length).toEqual(1)
  await expect(mockSdk.addIpAllowlistBinding).toHaveBeenCalledWith('1', '2', '3', 'author')
  await expect(cli.action.start.mock.calls[0][0]).toEqual('binding IP allowlist 2 to environment 3 (author)')
  await expect(cli.action.stop.mock.calls[0][0]).toEqual('bound')
})
