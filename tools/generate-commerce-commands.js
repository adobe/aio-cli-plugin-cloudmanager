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

const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const config = {
  'bin-magento': {
    type: 'bin/magento',
    commands: [
      {
        className: 'MaintenanceStatusCommand',
        command: 'maintenance:status',
        description: 'commerce maintenance status',
        aliases: ['cloudmanager:commerce:maintenance-status'],
        finishedOutput: 'maintenance enabled',
        runningOutput: 'running maintenance status',
      },
    ],
  },
}

const classTemplate = Handlebars.compile(`/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/*
 * THIS FILE IS GENERATED. DO NOT EDIT BY HAND. RUN 'npm run generate' to re-generate.
 */

const BaseCommerceCliCommand = require('../../../../../base-commerce-cli-command')
const { getProgramId } = require('../../../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../../../common-flags')

class {{className}} extends BaseCommerceCliCommand {
  async run () {
    const { args, flags } = this.parse({{className}})

    const programId = getProgramId(flags)

    let result

    try {
      result = await this.runSync(programId, args.environmentId,
        {
          type: '{{type}}',
          command: '{{command}}',
        },
        1000, '{{command}}')
    } catch (error) {
      cli.action.stop(error.message)
      return
    }

    return result
  }
}

{{ className }}.description = '{{ description }}'

{{ className }}.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

{{ className }}.args = [
  { name: 'environmentId', required: true, description: 'the environment id' },
]

{{#if aliases}}
{{ className }}.aliases = [
{{#each aliases}}
  '{{this}}',
{{/each}}
]

{{/if}}
module.exports = {{ className }}
`)

const testTemplate = Handlebars.compile(`/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/*
 * THIS FILE IS GENERATED. DO NOT EDIT BY HAND. RUN 'npm run generate' to re-generate.
 */

const { cli } = require('cli-ux')
const { init, mockSdk } = require('@adobe/aio-lib-cloudmanager')
const { resetCurrentOrgId, setCurrentOrgId } = require('@adobe/aio-lib-ims')
const {{className}} = require('../../../../../src/commands/cloudmanager/{{ outputPath }}')

beforeEach(() => {
  resetCurrentOrgId()
})

test('{{ command }} - missing arg', async () => {
  expect.assertions(2)

  const runResult = {{ className }}.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(
    (err) => err.message.indexOf('Missing 1 required arg') === 0,
  )
})

test('{{ command }} - missing config', async () => {
  expect.assertions(3)

  const runResult = {{ className }}.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).resolves.toEqual(undefined)
  await expect(cli.action.stop.mock.calls[0][0]).toBe(
    'Unable to find IMS context aio-cli-plugin-cloudmanager',
  )
})

test('{{ command }}', async () => {
  let counter = 0
  setCurrentOrgId('good')
  mockSdk.postCLICommand = jest.fn(() =>
    Promise.resolve({
      id: '5000',
    }),
  )
  mockSdk.getCLICommand = jest.fn(() => {
    counter++
    return counter < 3
      ? Promise.resolve({
        status: 'RUNNING',
        message: '{{ runningOutput }}',
      })
      : Promise.resolve({
        status: 'COMPLETE',
        message: '{{ finishedOutput }}',
      })
  })

  expect.assertions(8)

  const runResult = {{ className }}.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(init.mock.calls.length).toEqual(1)
  await expect(init).toHaveBeenCalledWith(
    'good',
    'test-client-id',
    'fake-token',
    'https://cloudmanager.adobe.io',
  )
  await expect(mockSdk.postCLICommand.mock.calls.length).toEqual(1)
  await expect(mockSdk.postCLICommand).toHaveBeenCalledWith('5', '10', {
    type: '{{ type }}',
    command: '{{ command }}',
  })
  await expect(mockSdk.getCLICommand).toHaveBeenCalledWith('5', '10', '5000')
  await expect(mockSdk.getCLICommand).toHaveBeenCalledTimes(3)
  await expect(cli.action.stop.mock.calls[0][0]).toEqual('{{ finishedOutput }}')
})

test('{{ command }} - api error', async () => {
  setCurrentOrgId('good')
  mockSdk.postCLICommand = jest.fn(() =>
    Promise.reject(new Error('Command failed.')),
  )
  mockSdk.getCLICommand = jest.fn()
  const runResult = {{ className }}.run(['--programId', '5', '10'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await runResult
  await expect(cli.action.stop.mock.calls[0][0]).toEqual('Command failed.')
})
`)

Object.keys(config).forEach(configKey => {
  const { type, commands } = config[configKey]
  commands.forEach(command => {
    const outputPath = `commerce/${configKey}/${command.command.replace(':', '/')}`
    const classOutputPath = `src/commands/cloudmanager/${outputPath}.js`
    const classContent = classTemplate({
      ...command,
      type,
    })
    fs.mkdirSync(path.dirname(classOutputPath), { recursive: true })
    fs.writeFileSync(classOutputPath, classContent)

    const testOutputPath = `test/commands/${outputPath}.test.js`
    const testContent = testTemplate({
      ...command,
      outputPath,
      type,
    })
    fs.mkdirSync(path.dirname(testOutputPath), { recursive: true })
    fs.writeFileSync(testOutputPath, testContent)
  })
})
