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
const AppConfigImportCommand = require('../../../../../../src/commands/cloudmanager/commerce/bin-magento/app/config/import')

beforeEach(() => {
  resetCurrentOrgId()
})

test('app:config:import - missing environmentId', async () => {
  expect.assertions(2)

  const runResult = AppConfigImportCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow(/^Missing 1 required arg/)
})

test('app:config:import - missing IMS Context', async () => {
  expect.assertions(2)

  const runResult = AppConfigImportCommand.run(['--programId', '3', '60'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
})

test('app:config:import - api error', async () => {
  setCurrentOrgId('valid-org-id')
  mockSdk.postCommerceCommandExecution = jest.fn(() =>
    Promise.reject(new Error('Command failed.')),
  )
  mockSdk.getCommerceCommandExecution = jest.fn()
  const runResult = AppConfigImportCommand.run(['--programId', '3', '60'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('Command failed.'))
})

test('app:config:import - success', async () => {
  let counter = 0
  setCurrentOrgId('valid-org-id')
  mockSdk.postCommerceCommandExecution = jest.fn(() =>
    Promise.resolve({
      id: '6000',
    }),
  )
  mockSdk.getCommerceCommandExecution = jest.fn(() => {
    counter++
    if (counter === 1) {
      return Promise.resolve({
        status: 'PENDING',
        message: 'running config import',
      })
    } else if (counter < 3) {
      return Promise.resolve({
        status: 'RUNNING',
        message: 'running config import',
      })
    }
    return Promise.resolve({
      status: 'COMPLETE',
      message: 'done',
    })
  })

  expect.assertions(11)

  const runResult = AppConfigImportCommand.run(['--programId', '3', '60'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith(
    'valid-org-id',
    'test-client-id',
    'fake-token',
    'https://cloudmanager.adobe.io',
  )
  await expect(mockSdk.postCommerceCommandExecution.mock.calls.length).toEqual(1)
  await expect(mockSdk.postCommerceCommandExecution).toHaveBeenCalledWith('3', '60', {
    type: 'bin/magento',
    command: 'app:config:import',
    options: ['-n'],
  })
  await expect(mockSdk.getCommerceCommandExecution).toHaveBeenCalledWith('3', '60', '6000')
  await expect(mockSdk.getCommerceCommandExecution).toHaveBeenCalledTimes(3)
  await expect(cli.action.start.mock.calls[0][0]).toEqual('Starting app:config:import')
  await expect(cli.action.start.mock.calls[1][0]).toEqual('Starting app:config:import')
  await expect(cli.action.start.mock.calls[2][0]).toEqual('Running app:config:import')
  await expect(cli.action.stop.mock.calls[0][0]).toEqual('done')
})
