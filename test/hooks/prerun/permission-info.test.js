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

const hook = require('../../../src/hooks/prerun/permission-info')

let exit
let warn
let log

beforeEach(() => {
  exit = jest.fn()
  warn = jest.fn()
  log = jest.fn()
})

const invoke = (options) => {
  return () => hook.apply({ exit, warn, log }, [{
    Command: Fixture,
    config: {},
    ...options,
  }])
}

test('hook -- command from other plugin', async () => {
  expect(invoke({
    Command: FixtureFromOtherPlugin,
    argv: [],
  })).not.toThrowError()
})

test("hook -- no argv doesn't call exit", async () => {
  invoke({
    argv: [],
  })()
  expect(exit.mock.calls.length).toBe(0)
})

test("hook -- some other argv doesn't call exit", async () => {
  invoke({
    argv: ['--environmentId=3'],
  })()
  expect(exit.mock.calls.length).toBe(0)
})

test('hook -- permissions missing', async () => {
  invoke({
    argv: ['--permissions'],
  })()
  expect(exit.mock.calls.length).toBe(1)
  expect(warn.mock.calls[0][0]).toBe('No permission information available for somecommand.')
})

test('hook -- permissions empty', async () => {
  invoke({
    Command: FixtureWithEmptyPermissions,
    argv: ['--permissions'],
  })()
  expect(exit.mock.calls.length).toBe(1)
  expect(log.mock.calls[0][0]).toBe('somecommand2 does not require any specific permissions.')
})

test('hook -- operation defined but no data', async () => {
  invoke({
    Command: FixtureWithAnOperation,
    argv: ['--permissions'],
  })()
  expect(exit.mock.calls.length).toBe(1)
  expect(warn.mock.calls[0][0]).toBe('Permission data not loaded. Unable to identify permissions for somecommand3.')
})

test('hook -- operation defined but not found', async () => {
  invoke({
    Command: FixtureWithAnOperation,
    argv: ['--permissions'],
    config: {
      permissionData: [],
    },
  })()
  expect(exit.mock.calls.length).toBe(1)
  expect(warn.mock.calls[0][0]).toBe('Unknown operation someoperation for somecommand3. Cannot list permissions required.')
})

test('hook -- operation defined and found', async () => {
  invoke({
    Command: FixtureWithAnOperation,
    argv: ['--permissions'],
    config: {
      permissionData: [{
        operation: 'someoperation',
        profiles: 'Profile1, Profile2',
      }],
    },
  })()
  expect(exit.mock.calls.length).toBe(1)
  expect(log.mock.calls[0][0]).toBe('To execute somecommand3, one of the following product profiles is required: Profile1, Profile2.')
})

class Fixture {
}
Fixture.id = 'somecommand'
Fixture.plugin = {
  name: '@adobe/aio-cli-plugin-cloudmanager',
}

class FixtureWithEmptyPermissions {
}
FixtureWithEmptyPermissions.id = 'somecommand2'
FixtureWithEmptyPermissions.plugin = {
  name: '@adobe/aio-cli-plugin-cloudmanager',
}
FixtureWithEmptyPermissions.permissionInfo = {}

class FixtureWithAnOperation {
}
FixtureWithAnOperation.id = 'somecommand3'
FixtureWithAnOperation.plugin = {
  name: '@adobe/aio-cli-plugin-cloudmanager',
}
FixtureWithAnOperation.permissionInfo = {
  operation: 'someoperation',
}

class FixtureFromOtherPlugin {
}
FixtureFromOtherPlugin.plugin = {
  name: 'something-else',
}
