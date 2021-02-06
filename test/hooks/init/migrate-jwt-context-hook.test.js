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

const { setLocalStore, setGlobalStore, set } = require('@adobe/aio-lib-core-config')
const migrate = require('../../../src/hooks/init/migrate-jwt-context-hook')

const oldConfig = {
  client_id: 'test-client-id',
  client_secret: '5678',
  jwt_payload: {
    iss: 'someorg@AdobeOrg',
    sub: '4321@techacct.adobe.com',
    'https://ims-na1.adobelogin.com/s/ent_adobeio_sdk': true,
    'https://ims-na1.adobelogin.com/s/ent_cloudmgr_sdk': true,
    aud: 'https://ims-na1.adobelogin.com/c/4bc4f99554834477a0de0244d46a575f',
  },
  jwt_private_key: '-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----\n',
}

const newConfig = {
  client_id: 'test-client-id',
  client_secret: '5678',
  ims_org_id: 'someorg@AdobeOrg',
  technical_account_id: '4321@techacct.adobe.com',
  technical_account_email: 'unused',
  meta_scopes: [
    'ent_adobeio_sdk',
    'ent_cloudmgr_sdk',
  ],
  private_key: '-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----\n',
}

beforeEach(() => {
  setLocalStore({})
  setGlobalStore({})
})

test('migrate -- no existing jwt', async () => {
  const runResult = migrate()
  await expect(runResult instanceof Promise).toBeTruthy()
  await expect(set.mock.calls.length).toBe(0)
})

test('migrate -- existing jwt and existing CM context in local only', async () => {
  setLocalStore({
    'jwt-auth': {},
    'ims.contexts.aio-cli-plugin-cloudmanager': {},
  })
  const result = migrate()
  await expect(result instanceof Promise).toBeTruthy()
  await expect(result).resolves.toEqual(undefined)
  await expect(set.mock.calls.length).toBe(0)
})

test('migrate -- existing jwt and existing CM context in global only', async () => {
  setGlobalStore({
    'jwt-auth': {},
    'ims.contexts.aio-cli-plugin-cloudmanager': {},
  })
  const result = migrate()
  await expect(result instanceof Promise).toBeTruthy()
  await expect(result).resolves.toEqual(undefined)
  await expect(set.mock.calls.length).toBe(0)
})

test('migrate -- existing jwt in local and no existing CM context', async () => {
  setLocalStore({
    'jwt-auth': oldConfig,
    'ims.contexts.something-else': {},
  })
  const result = migrate()
  await expect(result instanceof Promise).toBeTruthy()
  await expect(result).resolves.toEqual(undefined)
  await expect(set.mock.calls.length).toBe(1)
  await expect(set.mock.calls[0][0]).toEqual('ims.contexts.aio-cli-plugin-cloudmanager')
  await expect(set.mock.calls[0][1]).toEqual(newConfig)
  await expect(set.mock.calls[0][2]).toEqual(true)
})

test('migrate -- existing jwt in global and no existing CM context', async () => {
  setGlobalStore({
    'jwt-auth': oldConfig,
    'ims.contexts.something-else': {},
  })
  const result = migrate()
  await expect(result instanceof Promise).toBeTruthy()
  await expect(result).resolves.toEqual(undefined)
  await expect(set.mock.calls.length).toBe(1)
  await expect(set.mock.calls[0][0]).toEqual('ims.contexts.aio-cli-plugin-cloudmanager')
  await expect(set.mock.calls[0][1]).toEqual(newConfig)
  await expect(set.mock.calls[0][2]).toEqual(false)
})

test('migrate -- existing context in local and jwt in global (no-op)', async () => {
  setLocalStore({
    'ims.contexts.aio-cli-plugin-cloudmanager': newConfig,
  })
  setGlobalStore({
    'jwt-auth': oldConfig,
  })
  const result = migrate()
  await expect(result instanceof Promise).toBeTruthy()
  await expect(result).resolves.toEqual(undefined)
  await expect(set.mock.calls.length).toBe(0)
})
