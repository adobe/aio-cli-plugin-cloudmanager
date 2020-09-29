/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { setStore } = require('@adobe/aio-lib-core-config')
const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const ListProgramsCommand = require('../../src/commands/cloudmanager/list-programs')

beforeEach(() => {
  setStore({})
})

test('list-programs - missing config', async () => {
  expect.assertions(3)

  const runResult = ListProgramsCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
  expect(init.mock.calls.length).toEqual(0)
})

test('list-programs - args', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    })
  })
  expect.assertions(5)

  const runResult = ListProgramsCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toHaveLength(2)
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.listPrograms.mock.calls.length).toEqual(1)
})

test('list-programs - enabled only', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    })
  })
  expect.assertions(5)

  const runResult = ListProgramsCommand.run(['--enabledonly'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toHaveLength(1)
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.listPrograms.mock.calls.length).toEqual(1)
})
