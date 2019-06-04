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

const { cli } = require('cli-ux')
const GetQualityGateResults = require('../../src/commands/cloudmanager/get-quality-gate-results')

let mockStore = {}

jest.mock('conf', () => {
    return function () { // constructor
        // set properties and functions for object
        // this is how you can get the call stats on the mock instance,
        // see https://github.com/facebook/jest/issues/2982
        Object.defineProperty(this, 'store',
            {
                get: jest.fn(() => mockStore),
            })

        this.get = jest.fn(k => mockStore[k])
        this.set = jest.fn()
        this.delete = jest.fn()
        this.clear = jest.fn()
    }
})

jest.mock('@adobe/aio-cli-plugin-jwt-auth', () => {
    return {
        accessToken: () => {
            return Promise.resolve('fake-token')
        },
    }
})

beforeEach(() => {
    mockStore = {}
})

test('get-quality-gate-results - missing arg', async () => {
    expect.assertions(2)

    let runResult = GetQualityGateResults.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 3 required args") === 0)
})

test('get-quality-gate-results - missing config', async () => {
    expect.assertions(2)

    let runResult = GetQualityGateResults.run(["5", "--programId", "7", "1001", "codeQuality"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('get-quality-gate-results - failure', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }

    expect.assertions(2)

    let runResult = GetQualityGateResults.run(["5", "--programId", "5", "1002", "codeQuality"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Cannot get execution: https://cloudmanager.adobe.io/api/program/5/pipeline/5/execution/1002 (404 Not Found)'))
})

test('get-quality-gate-results - success', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }

    expect.assertions(8)

    let runResult = GetQualityGateResults.run(["--programId", "5", "7", "1001", "codeQuality"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toMatchObject(expect.arrayContaining([{
        "actualValue": "A",
        "comparator": "GTE",
        "expectedValue": "B",
        "id": "69602",
        "kpi": "security_rating",
        "override": false,
        "passed": true,
        "severity": "critical"
    }]))
    await expect(runResult).resolves.toHaveLength(8)

    const columns = cli.table.mock.calls[0][1];

    expect(columns.severity.get({ "severity" : "critical" })).toBe("Critical")

    expect(columns.kpi.get({ "kpi" : "some_thing" })).toBe("Some Thing")
    expect(columns.kpi.get({ "kpi" : "sqale_rating" })).toBe("Maintainability Rating")


    expect(columns.passed.get({ "passed" : true })).toBe("Yes")
    expect(columns.passed.get({ "passed" : false })).toBe("No")
})
