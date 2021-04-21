const { setStore } = require('@adobe/aio-lib-core-config')
const { RequiredArgsError } = require('@oclif/parser/lib/errors')
const hook = require('../../../src/hooks/prerun/prerun-all')

let parse

beforeEach(() => {
  setStore({})
  parse = jest.fn()
})

test('hook -- environmentId args with config', async () => {
  setStore({
    cloudmanager_environmentid: '4321',
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

const thisPlugin = {
  name: '@adobe/aio-cli-plugin-cloudmanager',
}

class FixtureWithEnvironmentIdArg {
  parse (options, argv) {
    parse(options, argv)
  }
}

FixtureWithEnvironmentIdArg.args = [
  { name: 'environmentId' },
]
FixtureWithEnvironmentIdArg.plugin = thisPlugin
