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

const Config = require('@adobe/aio-lib-core-config')
const {getApiKey, getOrgId, isWithinFiveMinutesOfUTCMidnight} = require('../src/cloudmanager-helpers')

beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
})

test('getApiKey', async () => {
    expect.assertions(3)

    // no jwt-auth key
    jest.spyOn(Config, 'get').mockImplementation(() => null)
    await expect(getApiKey()).rejects.toEqual(new Error('missing config data: jwt-auth'))

    // jwt-auth available
    jest.spyOn(Config, 'get').mockImplementation(() => '{ "jwt-auth": {} }')
    await expect(getApiKey()).rejects.toEqual(new Error('missing config data: jwt-auth.client_id'))

    // jwt-auth, client_id available
    jest.spyOn(Config, 'get').mockImplementation(k => {
      if (k === 'jwt-auth') {
        return JSON.stringify({
          client_id: '...',
        })
      }
    })
    await expect(getApiKey()).resolves.toEqual('...')
  })

  test('getOrgId', async () => {
    expect.assertions(3)

    // no jwt-auth key
    jest.spyOn(Config, 'get').mockImplementation(() => null)
    await expect(getOrgId()).rejects.toEqual(new Error('missing config data: jwt-auth'))

    // jwt-auth available
    jest.spyOn(Config, 'get').mockImplementation(() => '{ "jwt-auth": {} }')
    await expect(getOrgId()).rejects.toEqual(new Error('missing config data: jwt-auth.jwt_payload.iss'))

    // jwt-auth, client_id available
    jest.spyOn(Config, 'get').mockImplementation(k => {
      if (k === 'jwt-auth') {
        return JSON.stringify({
            jwt_payload: {
                iss: '...',
            }
        })
      }
    })
    await expect(getOrgId()).resolves.toEqual('...')
  })

  test('isWithinFiveMinutesOfUTCMidnight', async () => {
    const utcDate1 = new Date(Date.UTC(2019, 9, 12, 23, 55, 14));
    expect(isWithinFiveMinutesOfUTCMidnight(utcDate1)).toEqual(true)
    const utcDate2 = new Date(Date.UTC(2019, 9, 12, 23, 53, 14));
    expect(isWithinFiveMinutesOfUTCMidnight(utcDate2)).toEqual(false)
    const utcDate3 = new Date(Date.UTC(2019, 9, 12, 0, 4, 14));
    expect(isWithinFiveMinutesOfUTCMidnight(utcDate3)).toEqual(true)
    const utcDate4 = new Date(Date.UTC(2019, 9, 12, 0, 6, 0));
    expect(isWithinFiveMinutesOfUTCMidnight(utcDate4)).toEqual(false)
  })
