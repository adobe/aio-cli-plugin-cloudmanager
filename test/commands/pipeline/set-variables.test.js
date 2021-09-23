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

const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const { setStore } = require('@adobe/aio-lib-core-config')
const SetPipelineVariablesCommand = require('../../../src/commands/cloudmanager/pipeline/set-variables')

let warn
let info

beforeEach(() => {
  resetCurrentOrgId()
  warn = jest.fn()
  info = jest.fn()
})

const run = (argv) => {
  const cmd = new SetPipelineVariablesCommand(argv)
  cmd.warn = warn
  cmd.info = info
  return cmd.run()
}

test('set-pipeline-variables - missing arg', async () => {
  expect.assertions(2)

  const runResult = run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow(/^Missing 1 required arg/)
})

test('set-pipeline-variables - missing programId', async () => {
  expect.assertions(2)

  const runResult = run(['1'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:MISSING_PROGRAM_ID] Program ID must be specified either as --programId flag or through cloudmanager_programid config value.')
})

test('set-pipeline-variables - missing config', async () => {
  expect.assertions(2)

  const runResult = run(['1', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
})

test('set-pipeline-variables - bad variable flag', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '5',
  })

  expect.assertions(2)

  const runResult = run(['8', '--variable', 'foo'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:MALFORMED_NAME_VALUE_PAIR] Please provide correct values for flags')
})

test('set-pipeline-variables - empty variable flag', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '5',
  })

  expect.assertions(2)

  const runResult = run(['8', '--variable', 'foo', ''])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:BLANK_VARIABLE_VALUE] Blank variable values are not allowed. Use the proper flag if you intend to delete a variable.')
})

test('set-pipeline-variables - bad secret flag', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '5',
  })

  expect.assertions(2)

  const runResult = run(['8', '--secret', 'foo'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:MALFORMED_NAME_VALUE_PAIR] Please provide correct values for flags')
})
test('set-pipeline-variables - config', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '6',
  })

  expect.assertions(4)

  const runResult = run(['1'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(2)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setPipelineVariables.mock.calls.length).toEqual(0)
})

test('set-pipeline-variables - variables only', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = run(['1', '--variable', 'foo', 'bar', '--variable', 'foo2', 'bar2'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setPipelineVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setPipelineVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar',
  }, {
    name: 'foo2',
    type: 'string',
    value: 'bar2',
  }])
})

test('set-pipeline-variables - secrets only', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = run(['1', '--secret', 'foo', 'bar', '--secret', 'foo2', 'bar2'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setPipelineVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setPipelineVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'secretString',
    value: 'bar',
  }, {
    name: 'foo2',
    type: 'secretString',
    value: 'bar2',
  }])
})

test('set-pipeline-variables - secret and variable', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = run(['1', '--variable', 'foo', 'bar', '--secret', 'foo2', 'bar2'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setPipelineVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setPipelineVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar',
  }, {
    name: 'foo2',
    type: 'secretString',
    value: 'bar2',
  }])
})

test('set-pipeline-variables - delete', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = run(['1', '--delete', 'KEY'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setPipelineVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setPipelineVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'KEY',
    type: 'string',
    value: '',
  }])
})

test('set-pipeline-variables - delete secret', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = run(['1', '--delete', 'I_AM_A_SECRET'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setPipelineVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setPipelineVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'I_AM_A_SECRET',
    type: 'secretString',
    value: '',
  }])
})

test('set-pipeline-variables - delete not found', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(4)

  const runResult = run(['1', '--delete', 'foo'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(2)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setPipelineVariables.mock.calls.length).toEqual(0)
})

test('set-pipeline-variables - second get fails', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(2)

  mockSdk.getPipelineVariables = jest.fn(() => Promise.resolve([]))
    .mockImplementationOnce(() => Promise.resolve([]))
    .mockImplementationOnce(() => { throw new Error('fail') })

  let thrown = false

  try {
    await run(['1', '--variable', 'foo', 'bar', '--variable', 'foo2', 'bar2'])
  } catch (err) {
    thrown = err
  }
  await expect(thrown).toBeTruthy()
  await expect(thrown.message).toEqual('fail')
})
