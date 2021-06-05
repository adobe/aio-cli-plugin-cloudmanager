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

const fs = require('fs')
const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const { setStore, getPipedData } = require('@adobe/aio-lib-core-config')
const SetEnvironmentVariablesCommand = require('../../../src/commands/cloudmanager/environment/set-variables')

const mockFileName = 'test-input'
let mockFileContent = ''

const originalReadFile = fs.readFile

let warn

beforeAll(() => {
  fs.readFile = jest.fn((fileName, encoding, callback) => {
    if (fileName === mockFileName) {
      if (!callback) {
        callback = encoding
        encoding = undefined
      }
      callback(null, mockFileContent)
    } else {
      originalReadFile(fileName, encoding, callback)
    }
  })
})

beforeEach(() => {
  resetCurrentOrgId()
  warn = jest.fn()
  SetEnvironmentVariablesCommand.prototype.warn = warn
})

afterAll(() => {
  fs.readFile = originalReadFile
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
  await expect(runResult).rejects.toEqual(new Error('Unable to find IMS context aio-cli-plugin-cloudmanager'))
})

test('set-environment-variables - bad variable flag', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--variable', 'foo'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('Please provide correct values for flags'))
})

test('set-environment-variables - bad secret flag', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--secret', 'foo'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('Please provide correct values for flags'))
})

test('set-environment-variables - config', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '6',
  })

  expect.assertions(4)

  const runResult = SetEnvironmentVariablesCommand.run(['1'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(2)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(0)
})

test('set-environment-variables - variables only', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--variable', 'foo', 'bar', '--variable', 'foo2', 'bar2'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar',
  }, {
    name: 'foo2',
    type: 'string',
    value: 'bar2',
  }])
})

test('set-environment-variables - long numeric value', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--variable', 'foo', '4566206088344615922'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: '4566206088344615922',
  }])
})

test('set-environment-variables - secrets only', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--secret', 'foo', 'bar', '--secret', 'foo2', 'bar2'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'secretString',
    value: 'bar',
  }, {
    name: 'foo2',
    type: 'secretString',
    value: 'bar2',
  }])
})

test('set-environment-variables - secret and variable', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--variable', 'foo', 'bar', '--secret', 'foo2', 'bar2'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar',
  }, {
    name: 'foo2',
    type: 'secretString',
    value: 'bar2',
  }])
})

test('set-environment-variables - delete', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--delete', 'KEY'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'KEY',
    type: 'string',
    value: '',
  }])
})

test('set-environment-variables - delete secret', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--delete', 'I_AM_A_SECRET'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'I_AM_A_SECRET',
    type: 'secretString',
    value: '',
  }])
})

test('set-environment-variables - delete not found', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(4)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--delete', 'foo'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(2)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(0)
})

test('set-environment-variables - stdin - not JSON', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  getPipedData.mockResolvedValue('garbage')

  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonStdin'])

  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('Unable to parse variables from provided data.')
})

test('set-environment-variables - file - not JSON', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  mockFileContent = 'garbage'

  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonFile', mockFileName])

  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('Unable to parse variables from provided data.')
})

test('set-environment-variables - stdin - not array', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  getPipedData.mockResolvedValue(JSON.stringify({ foo: 'bar' }))

  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonStdin'])

  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('Provided variables input was not an array.')
})

test('set-environment-variables - stdin - secret and variable', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  getPipedData.mockResolvedValue(JSON.stringify([
    {
      name: 'foo',
      value: 'bar',
    },
    {
      name: 'foo2',
      value: 'bar2',
      type: 'secretString',
    },
  ]))

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonStdin'])

  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar',
  }, {
    name: 'foo2',
    type: 'secretString',
    value: 'bar2',
  }])
})

test('set-environment-variables - file - secret and variable', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  mockFileContent = JSON.stringify([
    {
      name: 'foo',
      value: 'bar',
    },
    {
      name: 'foo2',
      value: 'bar2',
      type: 'secretString',
    },
  ])

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonFile', mockFileName])

  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar',
  }, {
    name: 'foo2',
    type: 'secretString',
    value: 'bar2',
  }])
})

test('set-environment-variables - stdin - variable in flag overrides stdin', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  getPipedData.mockResolvedValue(JSON.stringify([
    {
      name: 'foo',
      value: 'baz',
    },
  ]))

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonStdin', '--variable', 'foo', 'bar'])

  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar',
  }])
})

test('set-environment-variables - stdin - delete from stream', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  getPipedData.mockResolvedValue(JSON.stringify([
    {
      name: 'I_AM_A_SECRET',
      value: '',
    },
  ]))

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonStdin'])

  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'I_AM_A_SECRET',
    type: 'secretString',
    value: '',
  }])
})

test('set-environment-variables - stdin - missing name', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  getPipedData.mockResolvedValue(JSON.stringify([
    {
      value: 'somesecret',
    },
  ]))

  expect.assertions(4)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonStdin'])

  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(2)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(0)
})

test('set-environment-variables - both jsonStdin and jsonFile', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })
  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonStdin', '--jsonFile', mockFileContent])

  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toThrow('--jsonStdin= cannot also be provided when using --jsonFile=')
})

test('set-environment-variables - author variable', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--authorVariable', 'foo', 'bar'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    service: 'author',
    type: 'string',
    value: 'bar',
  }])
})

test('set-environment-variables - delete author secret', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--authorDelete', 'AUTHOR_SECRET'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'AUTHOR_SECRET',
    type: 'secretString',
    value: '',
    service: 'author',
  }])
})

test('set-environment-variables - file - author secret and variable', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  mockFileContent = JSON.stringify([
    {
      name: 'foo',
      value: 'bar',
      service: 'author',
    },
    {
      name: 'foo2',
      value: 'bar2',
      type: 'secretString',
      service: 'author',
    },
  ])

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonFile', mockFileName])

  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar',
    service: 'author',
  }, {
    name: 'foo2',
    type: 'secretString',
    value: 'bar2',
    service: 'author',
  }])
})

test('set-environment-variables - stdin - variable in flag does not overwrite stdin when different services', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  getPipedData.mockResolvedValue(JSON.stringify([
    {
      name: 'foo',
      value: 'baz',
      service: 'publish',
    },
  ]))

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonStdin', '--authorVariable', 'foo', 'bar'])

  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'foo',
    type: 'string',
    value: 'bar',
    service: 'author',
  }, {
    name: 'foo',
    type: 'string',
    value: 'baz',
    service: 'publish',
  }])
})

test('set-environment-variables - stdin - delete from stream without service does not delete service variable', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  getPipedData.mockResolvedValue(JSON.stringify([
    {
      name: 'AUTHOR_SECRET',
      value: '',
    },
  ]))

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonStdin'])

  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'AUTHOR_SECRET',
    type: 'string',
    value: '',
  }])
})

test('set-environment-variables - stdin - delete from stream with service deletes service variable', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  getPipedData.mockResolvedValue(JSON.stringify([
    {
      name: 'AUTHOR_SECRET',
      value: '',
      service: 'author',
    },
  ]))

  expect.assertions(5)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--jsonStdin'])

  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'AUTHOR_SECRET',
    type: 'secretString',
    value: '',
    service: 'author',
  }])
})

test('set-environment-variables - internal name strict mode off', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(7)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--variable', 'INTERNAL_foo', 'bar'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await runResult
  await expect(init.mock.calls.length).toEqual(3)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.setEnvironmentVariables.mock.calls.length).toEqual(1)
  await expect(mockSdk.setEnvironmentVariables).toHaveBeenCalledWith('4', '1', [{
    name: 'INTERNAL_foo',
    type: 'string',
    value: 'bar',
  }])
  await expect(warn.mock.calls.length).toEqual(1)
  await expect(warn).toHaveBeenCalledWith('The variable name INTERNAL_foo is reserved for internal usage and will be ignored.')
})

test('set-environment-variables - internal name strict mode on via flag', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
  })

  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--variable', 'INTERNAL_foo', 'bar', '--strict'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toSatisfy(err => err.message === 'The variable name INTERNAL_foo is reserved for internal usage and will be ignored.')
})

test('set-environment-variables - internal name strict mode on via config', async () => {
  setCurrentOrgId('good')
  setStore({
    cloudmanager_programid: '4',
    'cloudmanager.environmentVariables.strictValidation': true,
  })

  expect.assertions(2)

  const runResult = SetEnvironmentVariablesCommand.run(['1', '--variable', 'INTERNAL_foo', 'bar'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toSatisfy(err => err.message === 'The variable name INTERNAL_foo is reserved for internal usage and will be ignored.')
})
