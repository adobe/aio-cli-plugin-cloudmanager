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

const { cli } = require('cli-ux')
const { setCurrentOrgId } = require('@adobe/aio-lib-ims')
const { generateNewMock } = require('@adobe/aio-lib-cloudmanager')
const ListIPAllowlistBindingDetails = require('../../../src/commands/cloudmanager/ip-allowlist/get-binding-details')

let mockSdk

beforeEach(() => {
  setCurrentOrgId('good')
  mockSdk = generateNewMock()
})

test('get-binding-details - fails', async () => {
  expect.assertions(2)

  mockSdk.listIpAllowlists = jest.fn(() => Promise.reject(new Error('Cannot get IP Allowlists')))

  const runResult = ListIPAllowlistBindingDetails.run(['--programId', '4', '2'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('Cannot get IP Allowlists')
})

test('get-binding-details - not found', async () => {
  expect.assertions(2)

  mockSdk.listIpAllowlists = jest.fn(() => Promise.resolve([
    {
      id: 1,
      name: 'test1',
      ipCidrSet: ['1.1.1.1/5', '2.2.2.2/5'],
      programId: '4',
      bindings: [],
    },
  ]))

  const runResult = ListIPAllowlistBindingDetails.run(['--programId', '4', '2'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('Could not find IP Allowlist with id 2 in program id 4.')
})

test('get-binding-details - no bindings', async () => {
  expect.assertions(8)

  mockSdk.listIpAllowlists = jest.fn(() => Promise.resolve([
    {
      id: 1,
      name: 'test1',
      ipCidrSet: ['1.1.1.1/5', '2.2.2.2/5'],
      programId: '4',
      bindings: [],
    },
  ]))

  const runResult = ListIPAllowlistBindingDetails.run(['--programId', '4', '1'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toMatchObject({
    id: 1,
    bindings: [],
  })
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')

  await expect(cli.table.mock.calls[0][1].tier.get({ tier: 'publish' })).toEqual('Publish')
  await expect(cli.table.mock.calls[0][1].tier.get({ tier: 'author' })).toEqual('Author')

  await expect(cli.table.mock.calls[0][1].status.get({ status: 'completed' })).toEqual('Completed')
  await expect(cli.table.mock.calls[0][1].status.get({ status: 'test' })).toEqual('Test')
})

test('get-binding-details - normal with bindings', async () => {
  expect.assertions(4)

  mockSdk.listIpAllowlists = jest.fn(() => Promise.resolve([
    {
      id: 1,
      name: 'test1',
      ipCidrSet: ['1.1.1.1/5', '2.2.2.2/5'],
      programId: '4',
      bindings: [{
        environmentId: '3',
        tier: 'publish',
      }],
    },
  ]))

  const runResult = ListIPAllowlistBindingDetails.run(['--programId', '4', '1'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toMatchObject({
    id: 1,
    bindings: [{
      environmentId: '3',
      environmentName: 'TestProgram_dev',
      tier: 'publish',
    }],
  })
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
})

test('get-binding-details - binding to unknown environment (should not ever happen)', async () => {
  expect.assertions(4)

  mockSdk.listIpAllowlists = jest.fn(() => Promise.resolve([
    {
      id: 1,
      name: 'test1',
      ipCidrSet: ['1.1.1.1/5', '2.2.2.2/5'],
      programId: '4',
      bindings: [{
        environmentId: 'X',
        tier: 'publish',
      }],
    },
  ]))

  const runResult = ListIPAllowlistBindingDetails.run(['--programId', '4', '1'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toMatchObject({
    id: 1,
    bindings: [{
      environmentId: 'X',
      environmentName: 'Environment X',
      tier: 'publish',
    }],
  })
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
})

test('get-binding-details - bindings when environment load fails', async () => {
  expect.assertions(4)

  mockSdk.listIpAllowlists = jest.fn(() => Promise.resolve([
    {
      id: 1,
      name: 'test1',
      ipCidrSet: ['1.1.1.1/5', '2.2.2.2/5'],
      programId: '4',
      bindings: [{
        environmentId: 'X',
        tier: 'publish',
      }],
    },
  ]))
  mockSdk.listEnvironments = jest.fn(() => { throw new Error('test error') })

  const runResult = ListIPAllowlistBindingDetails.run(['--programId', '4', '1'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toMatchObject({
    id: 1,
    bindings: [{
      environmentId: 'X',
      environmentName: 'Environment X',
      tier: 'publish',
    }],
  })
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
})
