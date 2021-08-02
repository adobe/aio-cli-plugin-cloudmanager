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

const Config = require('@adobe/aio-lib-core-config')
const { setOrganizations, setProfile } = require('@adobe/aio-lib-ims')
const { prompt, setAnswers } = require('inquirer')
const { enableCliAuth, disableCliAuth } = require('../../../src/cloudmanager-helpers')
const OrgSelectCommand = require('../../../src/commands/cloudmanager/org/select')

beforeEach(() => {
  enableCliAuth()
  setOrganizations([])
  setProfile({})
})

test('org-select -- nonCliMode', async () => {
  disableCliAuth()

  const runResult = OrgSelectCommand.run(['abc'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toSatisfy(err => err.message === '[CloudManagerCLI:CLI_ONLY_COMMAND] This command is only intended to be used with a user token, not a service account. The org id for a service account must be provided in the service account configuration.')
})

test('org-select -- orgId arg', async () => {
  const runResult = OrgSelectCommand.run(['abc'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toEqual('abc')

  expect(Config.set.mock.calls.length).toEqual(1)
  expect(Config.set).toBeCalledWith('cloudmanager_orgid', 'abc', true)
})

test('org-select -- orgId arg and global flag', async () => {
  const runResult = OrgSelectCommand.run(['abc', '--global'])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toEqual('abc')

  expect(Config.set.mock.calls.length).toEqual(1)
  expect(Config.set).toBeCalledWith('cloudmanager_orgid', 'abc', false)
})

test('org-select -- no organizations', async () => {
  const runResult = OrgSelectCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).rejects.toSatisfy(err => err.message === '[CloudManagerCLI:NO_CM_ORGS] No Cloud Manager authorized organizations found.')
})

test('org-select -- some organizations', async () => {
  setOrganizations([
    {
      orgName: 'myorg-nogroups',
      orgRef: {
        ident: 'abc',
        authSrc: 'AdobeOrg',
      },
    },
    {
      orgName: 'myorg-auth1',
      orgRef: {
        ident: 'def',
        authSrc: 'AdobeOrg',
      },
    },
    {
      orgName: 'myorg-auth2',
      orgRef: {
        ident: 'ghi',
        authSrc: 'AdobeOrg',
      },
    },
  ])
  setProfile({
    projectedProductContext: [
      {
        prodCtx: {
          owningEntity: 'abc@AdobeOrg',
          serviceCode: 'dma_analytics',
        },
      },
      {
        prodCtx: {
          owningEntity: 'def@AdobeOrg',
          serviceCode: 'dma_aem_ams',
        },
      },
      {
        prodCtx: {
          owningEntity: 'ghi@AdobeOrg',
          serviceCode: 'dma_aem_cloud',
        },
      },
    ],
  })
  setAnswers({
    orgId: 'ghi@AdobeOrg',
  })

  const runResult = OrgSelectCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toBe('ghi@AdobeOrg')

  expect(Config.set.mock.calls.length).toEqual(1)
  expect(Config.set).toBeCalledWith('cloudmanager_orgid', 'ghi@AdobeOrg', true)

  expect(prompt.mock.calls.length).toEqual(1)
  expect(prompt.mock.calls[0][0][0].choices).toEqual([
    {
      name: 'myorg-auth1',
      value: 'def@AdobeOrg',
    },
    {
      name: 'myorg-auth2',
      value: 'ghi@AdobeOrg',
    },
  ])
})
