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
const TailLog = require('../../../src/commands/cloudmanager/environment/tail-log')

beforeEach(() => {
  setStore({})
})

test('tail-log - missing arg', async () => {
  expect.assertions(2)

  const runResult = TailLog.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Missing 3 required args') === 0)
})

test('tail-log - missing config', async () => {
  expect.assertions(2)

  const runResult = TailLog.run(['5', 'author', 'aemerror', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('tail-log - config', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    })
  })

  expect.assertions(5)

  const runResult = TailLog.run(['17', 'author', 'aemerror', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.tailLog.mock.calls.length).toEqual(1)
  await expect(mockSdk.tailLog).toHaveBeenCalledWith('5', '17', 'author', 'aemerror', process.stdout)
})
