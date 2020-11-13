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
const { setStore } = require('@adobe/aio-lib-core-config')
const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const GetCurrentExecution = require('../../../src/commands/cloudmanager/current-execution/get')
const execution1010 = require('../../data/execution1010.json')

beforeEach(() => {
  setStore({})
})

test('get-current-execution - missing arg', async () => {
  expect.assertions(2)

  const runResult = GetCurrentExecution.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Missing 1 required arg') === 0)
})

test('get-current-execution - missing config', async () => {
  expect.assertions(2)

  const runResult = GetCurrentExecution.run(['5', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('get-current-execution - configured', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    })
  })

  expect.assertions(7)

  const runResult = GetCurrentExecution.run(['5', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.getCurrentExecution.mock.calls.length).toEqual(1)
  await expect(mockSdk.getCurrentExecution).toHaveBeenCalledWith('5', '5')

  await expect(cli.table.mock.calls[0][1].currentStep.get(execution1010)).toEqual('deploy')
  await expect(cli.table.mock.calls[0][1].currentStepStatus.get(execution1010)).toEqual('WAITING')
})
