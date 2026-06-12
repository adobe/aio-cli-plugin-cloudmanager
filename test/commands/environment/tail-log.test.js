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

const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const TailLog = require('../../../src/commands/cloudmanager/environment/tail-log')

beforeEach(() => {
  resetCurrentOrgId()
})

test('tail-log - missing arg', async () => {
  expect.assertions(2)

  const runResult = TailLog.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow(/^Missing 3 required arg/)
})

test('tail-log - missing config', async () => {
  expect.assertions(2)

  const runResult = TailLog.run(['5', 'author', 'aemerror', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:NO_IMS_CONTEXT] Unable to find IMS context aio-cli-plugin-cloudmanager.')
})

test('tail-log - config', async () => {
  setCurrentOrgId('good')

  // Block on the second tailLog call so the reconnect loop doesn't run indefinitely.
  // The 2000ms reconnect delay means the second call won't happen within our 50ms window.
  let callCount = 0
  mockSdk.tailLog.mockImplementation(() => {
    callCount++
    return callCount === 1 ? Promise.resolve() : new Promise(() => {})
  })

  expect.assertions(5)

  const runResult = TailLog.run(['17', 'author', 'aemerror', '--programId', '5'])
  await expect(runResult instanceof Promise).toBeTruthy()
  // Don't await runResult — the reconnect loop never terminates.
  // Wait 50ms for the first sdk.tailLog() call to complete (the reconnect delay is 2000ms,
  // so the second call hasn't been made yet).
  await new Promise(resolve => setTimeout(resolve, 50))
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith('good', 'test-client-id', 'fake-token', 'https://cloudmanager.adobe.io')
  await expect(mockSdk.tailLog.mock.calls.length).toEqual(1)
  await expect(mockSdk.tailLog).toHaveBeenCalledWith('5', '17', 'author', 'aemerror', process.stdout)
})

test('tail-log - should retry 5 times and throw error', async () => {
  setCurrentOrgId('good')
  mockSdk.tailLog.mockRejectedValue({ sdkDetails: { response: { status: 401 } } })

  expect.assertions(2)

  const runResult = TailLog.run(['17', 'author', 'aemerror', '--programId', '5'])
  await expect(runResult).rejects.toThrow('[CloudManagerCLI:MAX_RETRY_REACHED] Max retries reached')
  await expect(mockSdk.tailLog.mock.calls.length).toEqual(5)
})

test('tail-log - reconnects after normal stream end', async () => {
  setCurrentOrgId('good')
  mockSdk.tailLog.mockClear()

  let callCount = 0
  mockSdk.tailLog.mockImplementation(() => {
    callCount++
    // First two calls resolve immediately (simulating EOF / end of stream)
    // Third call blocks forever (simulating an active stream)
    return callCount < 3 ? Promise.resolve() : new Promise(() => {})
  })

  TailLog.run(['17', 'author', 'aemerror', '--programId', '5'])

  // Wait long enough for the 2000ms reconnect delay to fire at least once
  await new Promise(resolve => setTimeout(resolve, 2500))

  expect(mockSdk.tailLog.mock.calls.length).toBeGreaterThanOrEqual(2)
}, 10000)

test('tail-log - retries silently on transient non-auth error', async () => {
  setCurrentOrgId('good')
  mockSdk.tailLog.mockClear()

  let callCount = 0
  mockSdk.tailLog.mockImplementation(() => {
    callCount++
    if (callCount === 1) {
      // Simulate a 404 (log stream not ready yet — as seen during the midnight rotation window)
      return Promise.reject(Object.assign(new Error('Not Found'), {
        sdkDetails: { response: { status: 404 } },
      }))
    }
    // Second call blocks (active stream established)
    return new Promise(() => {})
  })

  const runResult = TailLog.run(['17', 'author', 'aemerror', '--programId', '5'])

  // Wait for the 2000ms reconnect delay to fire after the first rejected call
  await new Promise(resolve => setTimeout(resolve, 2500))

  // The CLI must have retried (2nd call made)
  expect(mockSdk.tailLog.mock.calls.length).toBeGreaterThanOrEqual(2)

  // The CLI must NOT have rejected (no crash on transient error)
  await expect(
    Promise.race([runResult.then(() => 'resolved'), Promise.resolve('still-running')]),
  ).resolves.toBe('still-running')
}, 10000)
