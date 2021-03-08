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
const { setStore } = require('@adobe/aio-lib-core-config')
const hook = require('../../../src/hooks/prerun/check-ims-context-config')

beforeEach(() => {
  setStore({})
})

const invoke = (options) => {
  return () => hook.apply({ error: (msg) => { throw new Error(msg) } }, [{
    Command: FixtureWithNoFlags,
    ...options,
  }])
}

test('hook -- no config', async () => {
  expect(invoke()).toThrowError('There is no IMS context configuration defined for ims.contexts.aio-cli-plugin-cloudmanager.')
})

test('hook -- different flag command, custom context and no config', async () => {
  expect(invoke({
    Command: FixtureWithADifferentFlag,
    argv: [],
  })).toThrowError('There is no IMS context configuration defined for ims.contexts.aio-cli-plugin-cloudmanager.')
})

test('hook -- flag command, custom context and no config', async () => {
  expect(invoke({
    Command: FixtureWithAContextFlag,
    argv: [],
  })).toThrowError('There is no IMS context configuration defined for ims.contexts.testContext.')
})

test('hook -- command from other plugin', async () => {
  expect(invoke({
    Command: FixtureWithNoFlagsInADifferentPlugin,
    argv: [],
  })).not.toThrowError()
})

test('hook -- ok', async () => {
  setStore({
    'ims.contexts.aio-cli-plugin-cloudmanager': {
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
    },
  })
  expect(invoke()).not.toThrowError()
})

test('hook -- missing some fields', async () => {
  setStore({
    'ims.contexts.aio-cli-plugin-cloudmanager': {
      client_id: 'test-client-id',
      client_secret: '5678',
      ims_org_id: 'someorg@AdobeOrg',
    },
  })
  expect(invoke()).toThrowError('One or more of the required fields in ims.contexts.aio-cli-plugin-cloudmanager were not set. Missing keys were technical_account_id, meta_scopes, private_key.')
})

test('hook -- missing scope', async () => {
  setStore({
    'ims.contexts.aio-cli-plugin-cloudmanager': {
      client_id: 'test-client-id',
      client_secret: '5678',
      ims_org_id: 'someorg@AdobeOrg',
      technical_account_id: '4321@techacct.adobe.com',
      technical_account_email: 'unused',
      meta_scopes: [
        'ent_adobeio_sdk',
      ],
      private_key: '-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----\n',
    },
  })
  expect(invoke()).toThrowError('The configuration ims.contexts.aio-cli-plugin-cloudmanager is missing the required metascope ent_cloudmgr_sdk.')
})

test('hook -- scope is a number', async () => {
  setStore({
    'ims.contexts.aio-cli-plugin-cloudmanager': {
      client_id: 'test-client-id',
      client_secret: '5678',
      ims_org_id: 'someorg@AdobeOrg',
      technical_account_id: '4321@techacct.adobe.com',
      technical_account_email: 'unused',
      meta_scopes: 5,
      private_key: '-----BEGIN PRIVATE KEY-----\n-----END PRIVATE KEY-----\n',
    },
  })
  expect(invoke()).toThrowError('The configuration ims.contexts.aio-cli-plugin-cloudmanager is missing the required metascope ent_cloudmgr_sdk.')
})

const thisPlugin = {
  name: '@adobe/aio-cli-plugin-cloudmanager',
}

class FixtureWithNoFlags {
  parse (options, argv) {
    return {
      args: {},
      flags: {},
    }
  }
}
FixtureWithNoFlags.plugin = thisPlugin

class FixtureWithADifferentFlag {
  parse (options, argv) {
    return {
      args: {},
      flags: {
        foo: 'bar',
      },
    }
  }
}

FixtureWithADifferentFlag.flags = {
  foo: {},
}
FixtureWithADifferentFlag.plugin = thisPlugin

class FixtureWithAContextFlag {
  parse (options, argv) {
    return {
      args: {},
      flags: {
        imsContextName: 'testContext',
      },
    }
  }
}

FixtureWithAContextFlag.flags = {
  imsContextName: {},
}
FixtureWithAContextFlag.plugin = thisPlugin

class FixtureWithNoFlagsInADifferentPlugin {
  parse (options, argv) {
    return {
      args: {},
      flags: {
        imsContextName: 'testContext',
      },
    }
  }
}

FixtureWithNoFlagsInADifferentPlugin.plugin = {
  name: 'somethingelse',
}
