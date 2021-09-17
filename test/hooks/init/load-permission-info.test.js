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

const fetchMock = require('fetch-mock').sandbox()
jest.setMock('node-fetch', fetchMock)

const hook = require('../../../src/hooks/init/load-permission-info')

afterEach(() => {
  fetchMock.reset()
})

test('load permission info -- empty config results in no fetch', async () => {
  await hook()
  expect(fetchMock.calls(true).length).toBe(0)
})

test('load permission info -- other id results in no fetch', async () => {
  await hook({
    id: 'somethingelse',
  })
  expect(fetchMock.calls(true).length).toBe(0)
})

test('load permission info -- correct id but empty argv no fetch', async () => {
  await hook({
    id: 'cloudmanager:something',
    argv: [],
  })
  expect(fetchMock.calls(true).length).toBe(0)
})

test('load permission info -- correct id fetches', async () => {
  fetchMock.mock('https://raw.githubusercontent.com/AdobeDocs/cloudmanager-api-docs/main/src/data/permissions.json', [
    {
      operation: 'test-operation',
    },
  ])
  const hookOptions = {
    id: 'cloudmanager:something',
    argv: ['--permissions'],
    config: {},
  }
  await hook(hookOptions)
  expect(fetchMock.calls(true).length).toBe(1)
  expect(fetchMock.calls('https://raw.githubusercontent.com/AdobeDocs/cloudmanager-api-docs/main/src/data/permissions.json').length).toBe(1)
  expect(hookOptions.config.permissionData).toBeTruthy()
  expect(hookOptions.config.permissionData.length).toBe(1)
  expect(hookOptions.config.permissionData).toEqual(expect.arrayContaining([
    {
      operation: 'test-operation',
    },
  ]))
})

test('load permission info -- wrong response type', async () => {
  fetchMock.mock('https://raw.githubusercontent.com/AdobeDocs/cloudmanager-api-docs/main/src/data/permissions.json', "some text that isn't json")
  const hookOptions = {
    id: 'cloudmanager:something',
    argv: ['--permissions'],
    config: {},
  }
  await hook(hookOptions)
  expect(fetchMock.calls(true).length).toBe(1)
  expect(fetchMock.calls('https://raw.githubusercontent.com/AdobeDocs/cloudmanager-api-docs/main/src/data/permissions.json').length).toBe(1)
  expect(hookOptions.config.permissionData).toBeUndefined()
})

test('load permission info -- error response', async () => {
  fetchMock.mock('https://raw.githubusercontent.com/AdobeDocs/cloudmanager-api-docs/main/src/data/permissions.json', 500)
  const hookOptions = {
    id: 'cloudmanager:something',
    argv: ['--permissions'],
    config: {},
  }
  await hook(hookOptions)
  expect(fetchMock.calls(true).length).toBe(1)
  expect(fetchMock.calls('https://raw.githubusercontent.com/AdobeDocs/cloudmanager-api-docs/main/src/data/permissions.json').length).toBe(1)
  expect(hookOptions.config.permissionData).toBeUndefined()
})

test('load permission info -- fetch throwing', async () => {
  fetchMock.mock('https://raw.githubusercontent.com/AdobeDocs/cloudmanager-api-docs/main/src/data/permissions.json', {
    throws: new Error(),
  })
  const hookOptions = {
    id: 'cloudmanager:something',
    argv: ['--permissions'],
    config: {},
  }
  await hook(hookOptions)
  expect(fetchMock.calls(true).length).toBe(1)
  expect(fetchMock.calls('https://raw.githubusercontent.com/AdobeDocs/cloudmanager-api-docs/main/src/data/permissions.json').length).toBe(1)
  expect(hookOptions.config.permissionData).toBeUndefined()
})
