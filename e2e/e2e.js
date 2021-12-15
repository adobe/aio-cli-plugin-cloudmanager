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

jest.unmock('@adobe/aio-lib-ims')
jest.unmock('@adobe/aio-lib-core-config')

const execa = require('execa')
const chalk = require('chalk')
const { context } = require('@adobe/aio-lib-ims')
const fs = require('fs')

const CONTEXT_NAME = 'aio-cli-plugin-cloudmanager-e2e'

const CONTEXT_ARGS = ['--imsContextName', CONTEXT_NAME]

beforeEach(async () => {
  await clearAuthContext()
})

const clearAuthContext = async () => {
  await context.set(CONTEXT_NAME, {})
}

const exec = (cmd, args) => {
  try {
    const result = execa.sync(cmd, args)
    console.log('result of %s %s: %s', cmd, args, result.stdout)
    return result
  } catch (e) {
    console.error('result of %s %s: (stdout): %s; (stderr): %s', cmd, args, e.stdout, e.stderr)
    throw e
  }
}

const bootstrapAuthContext = async () => {
  const contextObj = {
    client_id: process.env.E2E_CLIENT_ID,
    client_secret: process.env.E2E_CLIENT_SECRET,
    technical_account_id: process.env.E2E_TA_EMAIL,
    ims_org_id: process.env.E2E_IMS_ORG_ID,
    meta_scopes: [
      'ent_cloudmgr_sdk',
    ],
    private_key: Buffer.from(process.env.E2E_PRIVATE_KEY_B64, 'base64').toString(),
  }

  await context.set(CONTEXT_NAME, contextObj)
}

test('plugin-cloudmanager help test', async () => {
  const packagejson = JSON.parse(fs.readFileSync('package.json').toString())
  const name = `${packagejson.name}`
  console.log(chalk.blue(`> e2e tests for ${chalk.bold(name)}`))

  console.log(chalk.dim('    - plugin-cloudmanager help ..'))
  expect(() => { exec('./bin/run', ['--help']) }).not.toThrow()

  console.log(chalk.green(`    - done for ${chalk.bold(name)}`))
})

test('plugin-cloudmanager list-programs', async () => {
  await bootstrapAuthContext()
  const packagejson = JSON.parse(fs.readFileSync('package.json').toString())
  const name = `${packagejson.name}`
  console.log(chalk.blue(`> e2e tests for ${chalk.bold(name)}`))

  console.log(chalk.dim('    - plugin-cloudmanager list-programs ..'))

  let result
  expect(() => { result = exec('./bin/run', ['cloudmanager:list-programs', ...CONTEXT_ARGS, '--json']) }).not.toThrow()
  const parsed = JSON.parse(result.stdout)
  expect(parsed).toSatisfy(arr => arr.length > 0)

  console.log(chalk.green(`    - done for ${chalk.bold(name)}`))
})
