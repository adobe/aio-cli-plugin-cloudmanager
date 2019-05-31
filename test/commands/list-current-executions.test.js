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

const ListCurrentExecutions = require('../../src/commands/cloudmanager/list-current-executions')

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

test('list-current-executions - missing arg', async () => {
    expect.assertions(2)

    let runResult = ListCurrentExecutions.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Program ID must be specified") === 0)
})

test('list-current-executions - missing config', async () => {
    expect.assertions(2)

    let runResult = ListCurrentExecutions.run(["--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('list-current-executions - success', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }

    expect.assertions(2)

    let runResult = ListCurrentExecutions.run(["--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toMatchObject([{
        "id": "1000",
        "programId": "5",
        "pipelineId": "6",
    },{
        "id": "1001",
        "programId": "5",
        "pipelineId": "7",
    }])
})
