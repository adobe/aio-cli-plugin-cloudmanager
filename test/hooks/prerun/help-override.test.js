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

const hook = require('../../../src/hooks/prerun/help-override')

let mockHelp
let mockConstructor

beforeEach(() => {
  mockHelp = jest.fn()
  mockConstructor = jest.fn()
})

const invoke = (options) => {
  return () => hook.apply({}, [{
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

test("hook -- no argv doesn't call help", async () => {
  invoke({
    argv: [],
  })()
  expect(mockHelp.mock.calls.length).toBe(0)
})

test("hook -- some other argv doesn't call help", async () => {
  invoke({
    argv: ['--environmentId=3'],
  })()
  expect(mockHelp.mock.calls.length).toBe(0)
})

test('hook -- -h calls help', async () => {
  invoke({
    argv: ['-h'],
    config: {
      MOCKCONFIG: true,
    },
  })()
  expect(mockHelp.mock.calls.length).toBe(1)
  expect(mockConstructor.mock.calls.length).toBe(1)
  expect(mockConstructor.mock.calls[0][0]).toEqual(['-h'])
  expect(mockConstructor.mock.calls[0][1]).toEqual({
    MOCKCONFIG: true,
  })
})

class Fixture {
  constructor (argv, config) {
    mockConstructor(argv, config)
  }

  _help () {
    mockHelp()
  }
}
Fixture.id = 'somecommand'
Fixture.plugin = {
  name: '@adobe/aio-cli-plugin-cloudmanager',
}

class FixtureFromOtherPlugin {
}
FixtureFromOtherPlugin.plugin = {
  name: 'something-else',
}
