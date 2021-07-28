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
const { setOrganizations, setCurrentOrgId, resetCurrentOrgId, setProfile } = require('@adobe/aio-lib-ims')
const { setStore } = require('@adobe/aio-lib-core-config')
const OrgListCommand = require('../../../src/commands/cloudmanager/org/list')
const { enableCliAuth, disableCliAuth } = require('../../../src/cloudmanager-helpers')

beforeEach(() => {
  setOrganizations([])
  setProfile({})
  disableCliAuth()
  resetCurrentOrgId()
})

test('org-list - cli auth', async () => {
  setStore({
    cloudmanager_orgid: 'abc@AdobeOrg',
  })
  enableCliAuth()
  const runResult = OrgListCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toEqual([])

  expect(cli.table.mock.calls[0][1].orgId.get({
    orgName: 'myorg',
    orgRef: {
      ident: 'abc',
      authSrc: 'AdobeOrg',
    },
  })).toEqual('abc@AdobeOrg')

  expect(cli.table.mock.calls[0][1].roles.get({
    orgName: 'myorg',
    orgRef: {
      ident: 'abc',
      authSrc: 'AdobeOrg',
    },
  })).toEqual('')

  expect(cli.table.mock.calls[0][1].roles.get({
    orgName: 'myorg',
    orgRef: {
      ident: 'abc',
      authSrc: 'AdobeOrg',
    },
    groups: [
      {
        groupDisplayName: 'CM_BUSINESS_OWNER_ROLE_PROFILE',
      },
      {
        groupDisplayName: 'CM_CS_DEPLOYMENT_MANAGER_ROLE_PROFILE',
      },
      {
        groupDisplayName: 'SOMETHING_ELSE',
      },
    ],
  })).toEqual('Business Owner, Deployment Manager')

  expect(cli.table.mock.calls[0][1].active.get({
    orgName: 'myorg',
    orgRef: {
      ident: 'abc',
      authSrc: 'AdobeOrg',
    },
  })).toBeTruthy()

  expect(cli.table.mock.calls[0][1].active.get({
    orgName: 'myorg',
    orgRef: {
      ident: 'def',
      authSrc: 'AdobeOrg',
    },
  })).not.toBeTruthy()
})

test('org-list - service account auth', async () => {
  setCurrentOrgId('abc@AdobeOrg')
  const runResult = OrgListCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()

  await expect(runResult).resolves.toEqual([])

  expect(cli.table.mock.calls[0][1].active.get({
    orgName: 'myorg',
    orgRef: {
      ident: 'abc',
      authSrc: 'AdobeOrg',
    },
  })).toBeTruthy()

  expect(cli.table.mock.calls[0][1].active.get({
    orgName: 'myorg',
    orgRef: {
      ident: 'def',
      authSrc: 'AdobeOrg',
    },
  })).not.toBeTruthy()
})

test('org-list - no org', async () => {
  const runResult = OrgListCommand.run([])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message === 'Unable to find IMS context aio-cli-plugin-cloudmanager')
})

test('org-list - alt context', async () => {
  const runResult = OrgListCommand.run(['--imsContextName', 'something-else'])
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(runResult).rejects.toSatisfy(err => err.message === 'Unable to find IMS context something-else')
})
