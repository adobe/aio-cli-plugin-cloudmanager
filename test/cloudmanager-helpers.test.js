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

const { setCurrentOrgId, context } = require('@adobe/aio-lib-ims')
const { setStore } = require('@adobe/aio-lib-core-config')
const { initSdk, getOutputFormat, columnWithArray, disableCliAuth, enableCliAuth, formatDuration, executeWithRetries, executeWithRetry } = require('../src/cloudmanager-helpers')
const { init } = require('@adobe/aio-lib-cloudmanager')
const { setDecodedToken, resetDecodedToken } = require('jsonwebtoken')

beforeEach(() => {
  disableCliAuth()
  setStore({})
  resetDecodedToken()
})

test('initSdk - base url config -- no config', async () => {
  setCurrentOrgId('good')

  await initSdk()
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
})

test('initSdk - base url config -- number config', async () => {
  setCurrentOrgId('good')
  // cloudmanager key available, but not a string
  setStore({
    cloudmanager: 42,
  })
  await initSdk()
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
})
test('initSdk - base url config -- no base url config', async () => {
  setCurrentOrgId('good')
  // cloudmanager key available, but not a string
  setStore({
    cloudmanager: JSON.stringify({ foo: 'bar' }),
  })
  await initSdk()
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
})

test('initSdk - base url config -- good config', async () => {
  setCurrentOrgId('good')
  // cloudmanager key available, but not a string
  setStore({
    cloudmanager: JSON.stringify({ base_url: 'https://www.adobe.com' }),
  })
  await initSdk()
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://www.adobe.com')
})

test('getOutputFormat', () => {
  expect(getOutputFormat({})).toBeUndefined()
  expect(getOutputFormat({ json: true })).toBe('json')
  expect(getOutputFormat({ yaml: true })).toBe('yaml')
})

test('columnWithArray', () => {
  expect(
    columnWithArray('key', { header: 'Test' }, {}).get({ key: ['foo', 'bar'] }),
  ).toEqual('foo, bar')
  expect(columnWithArray('key', { header: 'Test' }, { json: true })).not.toHaveProperty('get')
  expect(columnWithArray('key', { header: 'Test' }, { yaml: true })).not.toHaveProperty('get')
})

test('initSdk - check context name -- default', async () => {
  setCurrentOrgId('good')

  await initSdk()
  await expect(context.get).toHaveBeenCalledWith('aio-cli-plugin-cloudmanager')
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
})

test('initSdk - check context name -- non-default', async () => {
  setCurrentOrgId('good')

  await initSdk('somethingelse')
  await expect(context.get).toHaveBeenCalledWith('somethingelse')
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
})

test('initSdk - cli context', async () => {
  enableCliAuth()

  setStore({
    cloudmanager_orgid: 'something',
  })
  await initSdk()
  await expect(init).toHaveBeenCalledWith('something', 'fake-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
})

test('initSdk - cli cannot decode token', async () => {
  enableCliAuth()
  setDecodedToken(null)

  setStore({
    cloudmanager_orgid: 'something',
  })
  await expect(initSdk).rejects.toThrow('[CloudManagerCLI:CLI_AUTH_CONTEXT_CANNOT_DECODE] The access token configured for cli authentication cannot be decoded.')
})

test('initSdk - decoded token does not have client_id', async () => {
  enableCliAuth()
  setDecodedToken({})

  setStore({
    cloudmanager_orgid: 'something',
  })
  await expect(initSdk).rejects.toThrow('[CloudManagerCLI:CLI_AUTH_CONTEXT_NO_CLIENT_ID] The decoded access token configured for cli authentication does not have a client_id.')
})

test('formatDuration -- empty', async () => {
  expect(formatDuration({})).toEqual('')
})

test('formatDuration -- only started', async () => {
  expect(formatDuration({
    startedAt: '2021-05-01',
  })).toEqual('')
})

test('formatDuration -- only finished', async () => {
  expect(formatDuration({
    finishedAt: '2021-05-01',
  })).toEqual('')
})

describe('executeWithRetries', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should not retry when no 401, 403 thrown', async () => {
    const mockFn = jest.fn().mockResolvedValue('success')

    executeWithRetries(mockFn)

    expect(mockFn.mock.calls.length).toEqual(1)
  })

  test('should retry when 401 thrown', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce({ sdkDetails: { response: { status: 401 } } })
      .mockResolvedValue('success')

    await executeWithRetries(mockFn)

    expect(mockFn.mock.calls.length).toEqual(2)
  })

  test('should retry when 403 thrown', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce({ sdkDetails: { response: { status: 401 } } })
      .mockResolvedValue('success')

    await executeWithRetries(mockFn)

    expect(mockFn.mock.calls.length).toEqual(2)
  })

  test('should throw error when no 401, 403 thrown', async () => {
    const mockFn = jest.fn()
      .mockRejectedValue(new Error())

    await expect(executeWithRetries(mockFn)).rejects.toThrow()

    expect(mockFn.mock.calls.length).toEqual(1)
  })

  test('should retry 5 times and throw exception', async () => {
    const mockFn = jest.fn().mockRejectedValue({ sdkDetails: { response: { status: 401 } } })

    await expect(executeWithRetries(mockFn)).rejects.toThrow('[CloudManagerCLI:MAX_RETRY_REACHED] Max retries')

    expect(mockFn.mock.calls.length).toEqual(5)
  })

  test('should reset retry counter after 1 hour', async () => {
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(new Date(Date.UTC(2024, 11, 1, 0, 0, 0)))
      .mockReturnValueOnce(new Date(Date.UTC(2024, 11, 1, 0, 0, 0)))
      .mockReturnValue(new Date(Date.UTC(2024, 11, 1, 1, 0, 0)))
    const mockFn = jest.fn().mockRejectedValue({ sdkDetails: { response: { status: 401 } } })

    await expect(executeWithRetries(mockFn)).rejects.toThrow('[CloudManagerCLI:MAX_RETRY_REACHED] Max retries')

    expect(mockFn.mock.calls.length).toEqual(6)
  })
})

describe('executeWithRetry', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should not retry when function succeed', async () => {
    const mockFn = jest.fn().mockResolvedValue('success')

    executeWithRetry(mockFn)

    expect(mockFn.mock.calls.length).toEqual(1)
  })

  test('should retry when error thrown', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce({})
      .mockResolvedValue('success')

    await executeWithRetry(mockFn)

    expect(mockFn.mock.calls.length).toEqual(2)
  })

  test('should throw error after 3 attempts', async () => {
    const mockFn = jest.fn()
      .mockRejectedValue(new Error())

    await expect(executeWithRetry(mockFn)).rejects.toThrow()

    expect(mockFn.mock.calls.length).toEqual(3)
  })
})
