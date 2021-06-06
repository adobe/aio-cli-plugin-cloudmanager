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
const { initSdk, getOutputFormat, columnWithArray, disableCliAuth, enableCliAuth, formatDuration } = require('../src/cloudmanager-helpers')
const { init } = require('@adobe/aio-lib-cloudmanager')

beforeEach(() => {
  disableCliAuth()
  setStore({})
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
  await expect(init).toHaveBeenCalledWith('something', 'aio-cli-console-auth', 'fake-token', 'https://cloudmanager.adobe.io')
})

test('initSdk - cli context stage env', async () => {
  enableCliAuth()

  setStore({
    cloudmanager_orgid: 'something',
    'cli.env': 'stage',
  })
  await initSdk()
  await expect(init).toHaveBeenCalledWith('something', 'aio-cli-console-auth-stage', 'fake-token', 'https://cloudmanager.adobe.io')
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
