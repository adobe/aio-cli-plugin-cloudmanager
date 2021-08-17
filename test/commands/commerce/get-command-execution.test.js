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
const GetCommandExecutionCommand = require('../../../src/commands/cloudmanager/commerce/get-command-execution')

beforeEach(() => {
  resetCurrentOrgId()
})

test('get-command (commerce) - missing arg', async () => {
  expect.assertions(4)

  const runResultOne = GetCommandExecutionCommand.run([])
  await expect(runResultOne instanceof Promise).toBeTruthy()
  await expect(runResultOne).rejects.toSatisfy(
    (err) => err.message.indexOf('Missing 2 required args') === 0,
  )
  const runResultTwo = GetCommandExecutionCommand.run(['12345'])
  await expect(runResultTwo instanceof Promise).toBeTruthy()
  await expect(runResultTwo).rejects.toSatisfy(
    (err) => err.message.indexOf('Missing 1 required arg') === 0,
  )
})

test('get-command (commerce) - missing config', async () => {
  expect.assertions(2)

  const runResult = GetCommandExecutionCommand.run(['--programId', '5', '10', '20'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message === '[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
})

test('get-command (commerce)', async () => {
  setCurrentOrgId('good')
  mockSdk.getCommerceCommandExecution = jest.fn(() => {
    return Promise.resolve({
      id: 100,
      type: 'bin/magento',
      command: 'maintenance:status',
      options: [],
      startedBy: 'E64A64C360706AD20A494012@techacct.adobe.com',
      startedAt: '2021-08-17T17:03:18.858+0000',
      completedAt: '2021-08-17T17:03:43.000+0000',
      name: 'magento-cli-952',
      status: 'COMPLETED',
      environmentId: 177253,
    })
  })

  // expect.assertions(9)

  const runResult = GetCommandExecutionCommand.run(['--programId', '5', '10', '100'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith(
    'good',
    'test-client-id',
    'fake-token',
    'https://cloudmanager.adobe.io',
  )
  await expect(mockSdk.getCommerceCommandExecution.mock.calls.length).toEqual(1)
  await expect(mockSdk.getCommerceCommandExecution).toHaveBeenCalledWith('5', '10', '100')
  await expect(cli.action.start.mock.calls[0][0]).toEqual('Getting Status for Command ID# 100')
  await expect(cli.action.start.mock.calls[1][0]).toEqual('Status for Command ID# 100')
  await expect(cli.table.mock.calls[0][0]).toEqual([{ command: 'maintenance:status', completedAt: '2021-08-17T17:03:43.000+0000', id: 100, startedAt: '2021-08-17T17:03:18.858+0000', startedBy: 'E64A64C360706AD20A494012@techacct.adobe.com', status: 'COMPLETED', type: 'bin/magento' }])
  await expect(cli.action.stop).toHaveBeenCalled()
})

test('get-command (commerce) - api error', async () => {
  setCurrentOrgId('good')
  mockSdk.getCommerceCommandExecution = jest.fn(() =>
    Promise.reject(new Error('Command failed.')),
  )
  const runResult = GetCommandExecutionCommand.run(['--programId', '5', '10', '20'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('Command failed.'))
})
