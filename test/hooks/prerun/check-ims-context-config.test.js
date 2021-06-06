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
const { isCliAuthEnabled } = require('../../../src/cloudmanager-helpers')
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
  expect(invoke()).toThrowError(new Error('There is no IMS context configuration defined for ims.contexts.aio-cli-plugin-cloudmanager. Either define this context configuration or authenticate using "aio auth:login".'))
})

test('hook -- different flag command, custom context and no config', async () => {
  expect(invoke({
    Command: FixtureWithADifferentFlag,
    argv: [],
  })).toThrowError(new Error('There is no IMS context configuration defined for ims.contexts.aio-cli-plugin-cloudmanager. Either define this context configuration or authenticate using "aio auth:login".'))
})

test('hook -- flag command, custom context and no config', async () => {
  expect(invoke({
    Command: FixtureWithAContextFlag,
    argv: [],
  })).toThrowError(new Error('There is no IMS context configuration defined for ims.contexts.testContext.'))
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

test('hook -- fully configured cli auth enables cli auth mode', async () => {
  setStore({
    'ims.contexts.cli': {
      access_token: {
        token: 'something',
      },
    },
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
    cloudmanager_orgid: 'someorg',
  })
  expect(invoke()).not.toThrowError()
  expect(isCliAuthEnabled()).toBe(true)
})

test('hook -- no config and skipping org command still produces error', async () => {
  expect(invoke({
    Command: FixtureWithSkippingOrgCheck,
    argv: [],
  })).toThrowError(new Error('There is no IMS context configuration defined for ims.contexts.aio-cli-plugin-cloudmanager. Either define this context configuration or authenticate using "aio auth:login".'))
})

test('hook -- fully configured cli auth enables cli auth mode for command with skipping org', async () => {
  setStore({
    'ims.contexts.cli': {
      access_token: {
        token: 'something',
      },
    },
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
  expect(invoke({
    Command: FixtureWithSkippingOrgCheck,
    argv: [],
  })).not.toThrowError()
  expect(isCliAuthEnabled()).toBe(true)
})

test('hook -- fully configured cli auth implicitly enables cli auth mode; org id from console select', async () => {
  setStore({
    'ims.contexts.cli': {
      access_token: {
        token: 'something',
      },
    },
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
    'console.org.code': 'someorg',
  })
  expect(invoke()).not.toThrowError()
  expect(isCliAuthEnabled()).toBe(true)
})

test('hook -- explicitly enabled cli validates that context exists', async () => {
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
    'console.org.code': 'someorg',
  })
  expect(invoke({
    Command: FixtureWithCliContext,
    argv: [],
  })).toThrowError(new Error('cli context explicitly enabled, but not authenticated. You must run "aio auth:login" first.'))
})

test('hook -- explicitly enabled cli validates that access token exists', async () => {
  setStore({
    'ims.contexts.cli': {},
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
    'console.org.code': 'someorg',
  })
  expect(invoke({
    Command: FixtureWithCliContext,
    argv: [],
  })).toThrowError(new Error('cli context explicitly enabled, but not authenticated. You must run "aio auth:login" first.'))
})

test('hook -- explicitly enabled cli validates the org id is set', async () => {
  setStore({
    'ims.contexts.cli': {
      access_token: {
        token: 'something',
      },
    },
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
  expect(invoke({
    Command: FixtureWithCliContext,
    argv: [],
  })).toThrowError(new Error('cli context explicitly enabled but no org id specified. Configure using either "cloudmanager_orgid" or by running "aio cloudmanager:org:select"'))
})

test('hook -- explicitly enabled cli and set org id works', async () => {
  setStore({
    'ims.contexts.cli': {
      access_token: {
        token: 'something',
      },
    },
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
    'console.org.code': 'someorg',
  })
  expect(invoke({
    Command: FixtureWithCliContext,
    argv: [],
  })).not.toThrowError()
  expect(isCliAuthEnabled()).toBe(true)
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

class FixtureWithCliContext {
  parse (options, argv) {
    return {
      args: {},
      flags: {
        imsContextName: 'cli',
      },
    }
  }
}

FixtureWithCliContext.flags = {
  imsContextName: {},
}
FixtureWithCliContext.plugin = thisPlugin

class FixtureWithSkippingOrgCheck {
  parse (options, argv) {
    return {
      args: {},
      flags: {},
    }
  }
}
FixtureWithSkippingOrgCheck.plugin = thisPlugin
FixtureWithSkippingOrgCheck.skipOrgIdCheck = true
