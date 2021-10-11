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

const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const CacheCleanCommand = require('../../../../../src/commands/cloudmanager/commerce/bin-magento/cache/clean')

let warn
let log

beforeEach(() => {
  resetCurrentOrgId()
  warn = jest.fn()
  log = jest.fn()
})

const run = (argv) => {
  const cmd = new CacheCleanCommand(argv)
  cmd.warn = warn
  cmd.log = log
  return cmd.run()
}

test('cache:clean - missing arg', async () => {
  expect.assertions(2)

  const runResult = run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow(/^Missing required flag/)
})

test('maintenance:status - missing config', async () => {
  expect.assertions(2)

  const runResult = run(['--programId', '5', '--environmentId', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
})

test('maintenance:status', async () => {
  let counter = 0
  setCurrentOrgId('good')
  mockSdk.postCommerceCommandExecution = jest.fn(() =>
    Promise.resolve({
      id: '5000',
    }),
  )
  mockSdk.getCommerceCommandExecution = jest.fn(() => {
    counter++
    if (counter === 1) {
      return Promise.resolve({
        status: 'PENDING',
        message: 'running cache clean',
      })
    } else if (counter < 3) {
      return Promise.resolve({
        status: 'RUNNING',
        message: 'running cache clean',
      })
    }
    return Promise.resolve({
      status: 'COMPLETE',
      message: 'done',
    })
  })

  expect.assertions(11)

  const runResult = run(['--programId', '5', '--environmentId', '10', '-V', '--ansi'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith(
    'good',
    'test-client-id',
    'fake-token',
    'https://cloudmanager.adobe.io',
  )
  await expect(mockSdk.postCommerceCommandExecution.mock.calls.length).toEqual(1)
  await expect(mockSdk.postCommerceCommandExecution).toHaveBeenCalledWith('5', '10', {
    type: 'bin/magento',
    command: 'cache:clean',
    options: ['-n', '--version', '--ansi'],
  })
  await expect(mockSdk.getCommerceCommandExecution).toHaveBeenCalledWith('5', '10', '5000')
  await expect(mockSdk.getCommerceCommandExecution).toHaveBeenCalledTimes(3)
  await expect(log.mock.calls[0]).toEqual(['To stream logs : aio cloudmanager:commerce:tail-command-execution-log 10 5000'])
  await expect(log.mock.calls[1]).toEqual(['STATUS: ', 'PENDING'])
  await expect(log.mock.calls[2]).toEqual(['STATUS: ', 'RUNNING'])
  await expect(log.mock.calls[3]).toEqual(['STATUS: ', 'COMPLETE'])
})

test('cache:clean - api error', async () => {
  setCurrentOrgId('good')
  mockSdk.postCommerceCommandExecution = jest.fn(() =>
    Promise.reject(new Error('Command failed.')),
  )
  mockSdk.getCommerceCommandExecution = jest.fn()
  const runResult = run(['--programId', '5', '--environmentId', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toEqual(new Error('Command failed.'))
})
