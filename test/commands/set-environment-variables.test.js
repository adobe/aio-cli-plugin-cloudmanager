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
const { setStore } = require('@adobe/aio-lib-core-config')
const SetEnvironmentVariablesCommand = require('../../src/commands/cloudmanager/set-environment-variables')

beforeEach(() => {
  setStore({})
})

test('set-environment-variables - missing arg', async () => {
  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Missing 1 required arg') > -1)
})

test('set-environment-variables - missing programId', async () => {
  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message.indexOf('Program ID must be specified either as --programId flag or through cloudmanager_programid') === 0)
})

test('set-environment-variables - missing config', async () => {
  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('set-environment-variables - bad variable flag', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '4'
  })

  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--variable', 'foo'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('Please provide correct values for flags'))
})

test('set-environment-variables - bad secret flag', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '4'
  })

  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--secret', 'foo'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('Please provide correct values for flags'))
})

test('set-environment-variables - config', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '6'
  })

  expect.assertions(4)

  const runResult = SetEnvironmentVariablesCommand.run(['1'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(2)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(0)
})

test('set-environment-variables - variables only', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '4'
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--variable', 'foo', 'bar', '--variable', 'foo2', 'bar2'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar'
  }, {
    name: 'foo2',
    type: 'string',
    value: 'bar2'
  }])
})

test('set-environment-variables - secrets only', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '4'
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--secret', 'foo', 'bar', '--secret', 'foo2', 'bar2'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'secretString',
    value: 'bar'
  }, {
    name: 'foo2',
    type: 'secretString',
    value: 'bar2'
  }])
})

test('set-environment-variables - secret and variable', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '4'
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--variable', 'foo', 'bar', '--secret', 'foo2', 'bar2'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar'
  }, {
    name: 'foo2',
    type: 'secretString',
    value: 'bar2'
  }])
})

test('set-environment-variables - delete', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '4'
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--delete', 'KEY'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'KEY',
    type: 'string',
    value: ''
  }])
})

test('set-environment-variables - delete secret', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '4'
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--delete', 'I_AM_A_SECRET'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'I_AM_A_SECRET',
    type: 'secretString',
    value: ''
  }])
})

test('set-environment-variables - delete not found', async () => {
  setStore({
    'jwt-auth': JSON.stringify({
      client_id: '1234',
      jwt_payload: {
        iss: 'good'
      }
    }),
    cloudmanager_programid: '4'
  })

  expect.assertions(4)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--delete', 'foo'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(2)
  await expect(init).toHaveBeenCalledWith('good', '1234', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(0)
})
