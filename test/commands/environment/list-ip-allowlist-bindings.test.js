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

const { setCurrentOrgId } = require('@adobe/aio-lib-ims')
const { generateNewMock } = require('@adobe/aio-lib-cloudmanager')
const ListIPAllowlistBindings = require('../../../src/commands/cloudmanager/environment/list-ip-allowlist-bindings')

let mockSdk

beforeEach(() => {
  setCurrentOrgId('good')
  mockSdk = generateNewMock()
})

test('list-ip-allowlist-bindings - normal no bindings', async () => {
  expect.assertions(4)

  mockSdk.listIpAllowlists = jest.fn(() => Promise.resolve([
    {
      id: '1',
      name: 'test1',
      ipCidrSet: ['1.1.1.1/5', '2.2.2.2/5'],
      programId: '4',
      bindings: [],
    },
  ]))

  const runResult = ListIPAllowlistBindings.run(['--programId', '4', '3'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toHaveLength(0)
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
})

test('list-ip-allowlist-bindings - normal with bindings', async () => {
  expect.assertions(5)

  mockSdk.listIpAllowlists = jest.fn(() => Promise.resolve([
    {
      id: '1',
      name: 'test1',
      ipCidrSet: ['1.1.1.1/5', '2.2.2.2/5'],
      programId: '4',
      bindings: [{
        environmentId: '3',
        tier: 'publish',
      }],
    },
  ]))

  const runResult = ListIPAllowlistBindings.run(['--programId', '4', '3'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toHaveLength(1)
  await expect(runResult).resolves.toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        boundServices: ['publish'],
      }),
    ]))
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
})

test('list-ip-allowlist-bindings - binding to differet environment', async () => {
  expect.assertions(4)

  mockSdk.listIpAllowlists = jest.fn(() => Promise.resolve([
    {
      id: '1',
      name: 'test1',
      ipCidrSet: ['1.1.1.1/5', '2.2.2.2/5'],
      programId: '4',
      bindings: [{
        environmentId: 'X',
        tier: 'publish',
      }],
    },
  ]))

  const runResult = ListIPAllowlistBindings.run(['--programId', '4', '3'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toHaveLength(0)
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
})

test('list-ip-allowlist-bindings - fail', async () => {
  expect.assertions(4)

  mockSdk.listIpAllowlists = jest.fn(() => { throw new Error('test error') })

  const runResult = ListIPAllowlistBindings.run(['--programId', '4', '3'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('test error')
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
})
