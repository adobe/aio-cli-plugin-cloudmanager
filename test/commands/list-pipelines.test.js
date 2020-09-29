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
const ListPipelinesCommand = require('../../src/commands/cloudmanager/list-pipelines')

beforeEach(() => {
  setStore({})
})

test('list-pipelines - missing arg', async () => {
  expect.assertions(2)

  const runResult = ListPipelinesCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Program ID must be specified either as --programId flag or through cloudmanager_programid') === 0)
})

test('list-pipelines - missing config', async () => {
  expect.assertions(2)

  const runResult = ListPipelinesCommand.run(['--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('list-pipelines - normal', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '6'
  })

  expect.assertions(5)

  const runResult = ListPipelinesCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.listPipelines.mock.calls.length).toEqual(1)
  await expect(mockSdk.listPipelines).toHaveBeenCalledWith('6')
})
