/*
Copyright 2021 Adobe. All rights reserved.
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
const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const MaintenanceStatusCommand = require('../../../../../src/commands/cloudmanager/commerce/bin-magento/maintenance/status')

beforeEach(() => {
  resetCurrentOrgId()
})

test('maintenance:status - missing arg', async () => {
  expect.assertions(2)

  const runResult = MaintenanceStatusCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(
    (err) => err.message.indexOf('Missing 1 required arg') === 0,
  )
})

test('maintenance:status - missing config', async () => {
  expect.assertions(3)

  const runResult = MaintenanceStatusCommand.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toEqual(undefined)
  await expect(cli.action.stop.mock.calls[0][0]).toBe(
    'Unable to find IMS context aio-cli-plugin-cloudmanager',
  )
})

test('maintenance:status', async () => {
  let counter = 0
  setCurrentOrgId('good')
  mockSdk.postCLICommand = jest.fn(() =>
    Promise.resolve({
      id: '5000',
    }),
  )
  mockSdk.getCLICommand = jest.fn(() => {
    counter++
    return counter < 3
      ? Promise.resolve({
        status: 'RUNNING',
        message: 'running maintenance status',
      })
      : Promise.resolve({
        status: 'COMPLETE',
        message: 'maintenance enabled',
      })
  })

  expect.assertions(8)

  const runResult = MaintenanceStatusCommand.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith(
    'good',
    'test-client-id',
    'fake-token',
    'https://cloudmanager.adobe.io',
  )
  await expect(mockSdk.postCLICommand.mock.calls.length).toEqual(1)
  await expect(mockSdk.postCLICommand).toHaveBeenCalledWith('5', '10', {
    type: 'bin/magento',
    command: 'maintenance:status',
  })
  await expect(mockSdk.getCLICommand).toHaveBeenCalledWith('5', '10', '5000')
  await expect(mockSdk.getCLICommand).toHaveBeenCalledTimes(3)
  await expect(cli.action.stop.mock.calls[0][0]).toEqual('maintenance enabled')
})

test('maintenance:status - api error', async () => {
  setCurrentOrgId('good')
  mockSdk.postCLICommand = jest.fn(() =>
    Promise.reject(new Error('Command failed.')),
  )
  mockSdk.getCLICommand = jest.fn()
  const runResult = MaintenanceStatusCommand.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(cli.action.stop.mock.calls[0][0]).toEqual('Command failed.')
})
