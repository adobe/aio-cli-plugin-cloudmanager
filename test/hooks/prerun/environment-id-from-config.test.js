/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { setStore } = require('@adobe/aio-lib-core-config')
const { RequiredArgsError, RequiredFlagError } = require('@oclif/parser/lib/errors')
const hook = require('../../../src/hooks/prerun/environment-id-from-config')

let parse

beforeEach(() => {
  setStore({})
  parse = jest.fn()
})

test('hook -- no args and no config', async () => {
  expect.assertions(1)

  await hook({
    Command: FixtureWithNoArgs,
    argv: [],
  })
  new FixtureWithNoArgs().parse(FixtureWithNoArgs, [])
  expect(parse.mock.calls.length).toEqual(1)
})

test('hook -- environmentId args and no config', async () => {
  expect.assertions(1)

  await hook({
    Command: FixtureWithEnvironmentIdArg,
    argv: [],
  })
  new FixtureWithNoArgs().parse(FixtureWithEnvironmentIdArg, [])
  expect(parse.mock.calls.length).toEqual(1)
})

test('hook -- environmentId args with config', async () => {
  setStore({
    cloudmanager_environmentid: '4321',
  })

  parse = jest.fn().mockImplementationOnce(() => {
    throw new RequiredArgsError({ args: [{ name: 'environmentId' }] })
  }).mockImplementationOnce(() => true)

  expect.assertions(2)

  await hook({
    Command: FixtureWithEnvironmentIdArg,
    argv: [],
  })
  new FixtureWithEnvironmentIdArg().parse(FixtureWithEnvironmentIdArg, [])
  expect(parse.mock.calls.length).toEqual(2)
  expect(parse.mock.calls[1][1]).toEqual(['4321'])
})

test('hook -- multiple missing args with config', async () => {
  setStore({
    cloudmanager_environmentid: '4321',
  })

  parse = jest.fn().mockImplementationOnce(() => {
    throw new RequiredArgsError({ args: [{ name: 'environmentId' }, { name: 'pipelineId' }] })
  })

  expect.assertions(2)

  await hook({
    Command: FixtureWithOtherArgs,
    argv: [],
  })
  expect(() => new FixtureWithOtherArgs().parse(FixtureWithOtherArgs, [])).toThrow(RequiredArgsError)
  expect(parse.mock.calls.length).toEqual(1)
})

test('hook -- different error', async () => {
  setStore({
    cloudmanager_environmentid: '4321',
  })

  parse = jest.fn().mockImplementationOnce(() => {
    throw new RequiredFlagError({ flag: { name: 'test' } })
  })

  expect.assertions(2)

  await hook({
    Command: FixtureWithEnvironmentIdArg,
    argv: [],
  })
  expect(() => new FixtureWithEnvironmentIdArg().parse(FixtureWithEnvironmentIdArg, [])).toThrow(RequiredFlagError)
  expect(parse.mock.calls.length).toEqual(1)
})

test('hook -- environmentId args but wrong plugin with config', async () => {
  setStore({
    cloudmanager_environmentid: '4321',
  })

  expect.assertions(2)

  await hook({
    Command: FixtureWithEnvironmentIdArgFromOtherPlugin,
    argv: [],
  })
  new FixtureWithEnvironmentIdArgFromOtherPlugin().parse(FixtureWithEnvironmentIdArgFromOtherPlugin, [])
  expect(parse.mock.calls.length).toEqual(1)
  expect(parse.mock.calls[0][1]).toEqual([])
})

const thisPlugin = {
  name: '@adobe/aio-cli-plugin-cloudmanager',
}

class FixtureWithNoArgs {
  parse (options, argv) {
    parse(options, argv)
  }
}
FixtureWithNoArgs.plugin = thisPlugin

class FixtureWithEnvironmentIdArg {
  parse (options, argv) {
    parse(options, argv)
  }
}

FixtureWithEnvironmentIdArg.args = [
  { name: 'environmentId' },
]
FixtureWithEnvironmentIdArg.plugin = thisPlugin

class FixtureWithEnvironmentIdArgFromOtherPlugin {
  parse (options, argv) {
    parse(options, argv)
  }
}

FixtureWithEnvironmentIdArgFromOtherPlugin.args = [
  { name: 'environmentId' },
]
FixtureWithEnvironmentIdArgFromOtherPlugin.plugin = {
  name: 'somethingelse',
}

class FixtureWithOtherArgs {
  parse (options, argv) {
    parse(options, argv)
  }
}

FixtureWithOtherArgs.args = [
  { name: 'pipelineId' },
  { name: 'environmentId' },
]
FixtureWithOtherArgs.plugin = thisPlugin
