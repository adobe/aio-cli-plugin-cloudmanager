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
const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const { setStore } = require('@adobe/aio-lib-core-config')
const ListEnvironmentVariablesCommand = require('../../../src/commands/cloudmanager/environment/list-variables')

beforeEach(() => {
  resetCurrentOrgId()
})

test('list-environment-variables - missing arg', async () => {
  expect.assertions(2)

  const runResult = ListEnvironmentVariablesCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Missing 1 required arg') > -1)
})

test('list-environment-variables - missing programId', async () => {
  expect.assertions(2)

  const runResult = ListEnvironmentVariablesCommand.run(['1'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message === '[CloudManagerCLI:MISSING_PROGRAM_ID] Program ID must be specified either as --programId flag or through cloudmanager_programid config value.')
})

test('list-environment-variables - missing config', async () => {
  expect.assertions(2)

  const runResult = ListEnvironmentVariablesCommand.run(['1', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message === '[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
})

test('list-environment-variables - success', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(11)

  const runResult = ListEnvironmentVariablesCommand.run(['1'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.getEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.getEnvironmentVariables).toHaveBeenCalledWith('4', '1')
  await expect(cli.table.mock.calls[0][1].value.get({
    name: 'I_AM_A_SECRET',
    type: 'secretString',
  })).toBe('****')
  await expect(cli.table.mock.calls[0][1].value.get({
    name: 'KEY',
    type: 'string',
    value: 'value',
  })).toBe('value')
  await expect(cli.table.mock.calls[0][1].service.get({
    name: 'KEY',
    type: 'string',
    value: 'value',
  })).toBe('')
  await expect(cli.table.mock.calls[0][1].service.get({
    name: 'KEY',
    type: 'string',
    value: 'value',
    service: 'author',
  })).toBe('author')
  await expect(cli.table.mock.calls[0][1].status.get({
    name: 'KEY',
    type: 'string',
    value: 'value',
    service: 'author',
  })).toBe('')
  await expect(cli.table.mock.calls[0][1].status.get({
    name: 'KEY',
    type: 'string',
    value: 'value',
    service: 'author',
    status: 'ready',
  })).toBe('ready')
})

test('list-environment-variables for "e" prefixed env id - success', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(2)

  const runResult = ListEnvironmentVariablesCommand.run(['e1'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toMatchObject([{
    name: 'KEY',
    type: 'string',
    value: 'value',
  }, {
    name: 'I_AM_A_SECRET',
    type: 'secretString',
  }, {
    name: 'AUTHOR_SECRET',
    service: 'author',
    type: 'secretString',
    value: 'something',
  },
  {
    name: 'VARIABLE',
    value: 'something',
    type: 'string',
    status: 'created',
  },
  ])
})
