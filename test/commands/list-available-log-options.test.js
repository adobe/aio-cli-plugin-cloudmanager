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

const { cli } = require('cli-ux')
const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const { setStore } = require('@adobe/aio-lib-core-config')
const ListAvailableLogOptionsCommand = require('../../src/commands/cloudmanager/list-available-log-options')

beforeEach(() => {
  setStore({})
})

test('list-available-logs - missing arg', async () => {
  expect.assertions(2)

  const runResult = ListAvailableLogOptionsCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Missing 1 required arg') > -1)
})

test('list-available-logs - missing programId', async () => {
  expect.assertions(2)

  const runResult = ListAvailableLogOptionsCommand.run(['1'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Program ID must be specified either as --programId flag or through cloudmanager_programid') === 0)
})

test('list-available-logs - missing config', async () => {
  expect.assertions(2)

  const runResult = ListAvailableLogOptionsCommand.run(['1', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('list-available-logs - empty', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '6'
  })

  expect.assertions(6)

  const runResult = ListAvailableLogOptionsCommand.run(['1'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.listAvailableLogOptions.mock.calls.length).toEqual(1)
  await expect(mockSdk.listAvailableLogOptions).toHaveBeenCalledWith('6', '1')
  await expect(cli.info.mock.calls[0][0]).toBe('No log options are available for environmentId 1')
})
