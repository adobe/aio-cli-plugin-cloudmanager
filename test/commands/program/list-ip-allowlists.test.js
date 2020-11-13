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
const { setStore } = require('@adobe/aio-lib-core-config')
const { generateNewMock } = require('@adobe/aio-lib-cloudmanager')
const ListIPAllowlists = require('../../../src/commands/cloudmanager/program/list-ip-allowlists')

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

test('list-ip-allowlists - normal no bindings', async () => {
  expect.assertions(5)

  mockSdk.listIpAllowlists = jest.fn(() => Promise.resolve([
    {
      id: '1',
      name: 'test1',
      ipCidrSet: ['1.1.1.1/5', '2.2.2.2/5'],
      programId: '4',
      bindings: [],
    },
  ]))

  const runResult = ListIPAllowlists.run(['--programId', '4'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toHaveLength(1)
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
  await expect(cli.table.mock.calls[0][1].bindings.header).toEqual('Bound Services')
})

test('list-ip-allowlists - normal with bindings', async () => {
  expect.assertions(6)

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

  const runResult = ListIPAllowlists.run(['--programId', '4'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toHaveLength(1)
  await expect(runResult).resolves.toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        boundServices: ['TestProgram_dev (publish)'],
      }),
    ]))
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
  await expect(cli.table.mock.calls[0][1].bindings.header).toEqual('Bound Services')
})

test('list-ip-allowlists - binding to unknown environment (should not ever happen)', async () => {
  expect.assertions(6)

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

  const runResult = ListIPAllowlists.run(['--programId', '4'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toHaveLength(1)
  await expect(runResult).resolves.toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        boundServices: ['Environment X (publish)'],
      }),
    ]))
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
  await expect(cli.table.mock.calls[0][1].bindings.header).toEqual('Bound Services')
})

test('list-ip-allowlists - bindings when environment load fails', async () => {
  expect.assertions(7)

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
  mockSdk.listEnvironments = jest.fn(() => { throw new Error('test error') })

  const runResult = ListIPAllowlists.run(['--programId', '4'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toHaveLength(1)
  await expect(runResult).resolves.toEqual(
    expect.arrayContaining([
      expect.not.objectContaining({
        boundServices: expect.anything(),
      }),
    ]))
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
  await expect(cli.table.mock.calls[0][1].bindings.header).toEqual('Binding Count')
  await expect(cli.table.mock.calls[0][1].bindings.get({ bindings: [1, 2, 3] })).toEqual(3)
})

test('list-ip-allowlists - fail', async () => {
  expect.assertions(4)

  mockSdk.listIpAllowlists = jest.fn(() => { throw new Error('test error') })

  const runResult = ListIPAllowlists.run(['--programId', '4'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('test error')
  await expect(mockSdk.listIpAllowlists.mock.calls.length).toEqual(1)
  await expect(mockSdk.listIpAllowlists).toHaveBeenCalledWith('4')
})
