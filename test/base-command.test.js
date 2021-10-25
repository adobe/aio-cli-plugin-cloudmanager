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

const { cli } = require('cli-ux')
const BaseCommand = require('../src/base-command')

let fixture
let error

beforeEach(() => {
  fixture = new BaseCommand()
  error = jest.fn()
  fixture.error = error
})

afterEach(() => {
  delete cli.action.running
})

test('catch -- generic (no action running)', async () => {
  const err = new Error('msg')

  await fixture.catch(err)
  await expect(error).toHaveBeenCalledWith('msg', { exit: 1 })
  await expect(cli.action.stop).not.toHaveBeenCalled()
})

test('catch -- generic (action running)', async () => {
  cli.action.running = true
  const err = new Error('msg')

  await fixture.catch(err)
  await expect(error).toHaveBeenCalledWith('msg', { exit: 1 })
  await expect(cli.action.stop).toHaveBeenCalledWith('failed')
})

test('catch -- sdk (no action running)', async () => {
  const err = new Error('msg')
  err.name = 'CloudManagerError'
  err.code = 'ABC'

  await fixture.catch(err)
  await expect(error).toHaveBeenCalledWith('msg', expect.objectContaining({
    exit: 30,
    code: 'ABC',
    ref: expect.stringMatching(/^Timestamp/),
  }))
  await expect(cli.action.stop).not.toHaveBeenCalled()
})

test('catch -- sdk with requestId (no action running)', async () => {
  const err = new Error('msg')
  err.name = 'CloudManagerError'
  err.code = 'ABC'
  err.sdkDetails = {
    requestId: 'abc',
  }

  await fixture.catch(err)
  await expect(error).toHaveBeenCalledWith('msg', expect.objectContaining({
    exit: 30,
    code: 'ABC',
    ref: expect.stringMatching(/^Request Id: abc. Timestamp/),

  }))
  await expect(cli.action.stop).not.toHaveBeenCalled()
})

test('catch -- validation (no action running)', async () => {
  const err = new Error('msg')
  err.name = 'CloudManagerCLIValidationError'

  await fixture.catch(err)
  await expect(error).toHaveBeenCalledWith('msg', { exit: 3 })
  await expect(cli.action.stop).not.toHaveBeenCalled()
})

test('catch -- configuration (no action running)', async () => {
  const err = new Error('msg')
  err.name = 'CloudManagerCLIConfigurationError'

  await fixture.catch(err)
  await expect(error).toHaveBeenCalledWith('msg', { exit: 2 })
  await expect(cli.action.stop).not.toHaveBeenCalled()
})

test('catch -- imssdk (no action running)', async () => {
  const err = new Error('msg')
  err.name = 'IMSSDK'

  await fixture.catch(err)
  await expect(error).toHaveBeenCalledWith('msg', { exit: 10 })
  await expect(cli.action.stop).not.toHaveBeenCalled()
})
