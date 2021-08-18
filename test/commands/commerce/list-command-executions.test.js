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
const ListCommandExecutionsCommand = require('../../../src/commands/cloudmanager/commerce/list-command-executions')

beforeEach(() => {
  resetCurrentOrgId()
})

test('list-command-executions (commerce) - missing arg', async () => {
  expect.assertions(2)

  const runResult = ListCommandExecutionsCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(
    (err) => err.message.indexOf('Missing 1 required arg') === 0,
  )
})

test('list-command-executions (commerce) - missing config', async () => {
  expect.assertions(2)

  const runResult = ListCommandExecutionsCommand.run([
    '--programId',
    '5',
    '10',
  ])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(
    (err) =>
      err.message ===
      '[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.',
  )
})

test('list-command-executions (commerce)', async () => {
  setCurrentOrgId('good')
  const result = [
    {
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
    },
    {
      id: 101,
      type: 'bin/magento',
      command: 'cache:clean',
      options: [],
      startedBy: 'E64A64C360706AD20A494012@techacct.adobe.com',
      startedAt: '2021-08-17T17:03:18.858+0000',
      completedAt: '2021-08-17T17:03:43.000+0000',
      name: 'magento-cli-952',
      status: 'COMPLETED',
      environmentId: 177253,
    },
  ]
  mockSdk.getCommerceCommandExecutions = jest.fn(() => {
    return Promise.resolve(result)
  })

  // expect.assertions(9)

  const runResult = ListCommandExecutionsCommand.run([
    '--programId',
    '5',
    '10',
  ])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith(
    'good',
    'test-client-id',
    'fake-token',
    'https://cloudmanager.adobe.io',
  )
  await expect(mockSdk.getCommerceCommandExecutions.mock.calls.length).toEqual(
    1,
  )
  await expect(mockSdk.getCommerceCommandExecutions).toHaveBeenCalledWith(
    '5',
    '10',
    undefined,
    undefined,
    undefined,
  )
  await expect(cli.action.start.mock.calls[0][0]).toEqual(
    'Getting Commerce Command Executions',
  )
  await expect(cli.action.start.mock.calls[1][0]).toEqual(
    'Retrieved Commerce Command Executions',
  )
  await expect(cli.table.mock.calls[0][0]).toEqual(result)
  await expect(cli.action.stop).toHaveBeenCalled()
})

test('list-command-executions (commerce) - api error', async () => {
  setCurrentOrgId('good')
  mockSdk.getCommerceCommandExecutions = jest.fn(() =>
    Promise.reject(new Error('Command failed.')),
  )
  const runResult = ListCommandExecutionsCommand.run([
    '--programId',
    '5',
    '10',
  ])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('Command failed.'))
})
