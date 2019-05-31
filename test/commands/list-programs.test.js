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

const ListProgramsCommand = require('../../src/commands/cloudmanager/list-programs')

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

test('list-programs - missing config', async () => {
    expect.assertions(2)

    let runResult = ListProgramsCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('list-programs - failure', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "not-found"
            }
        }),
    }
    expect.assertions(2)

    let runResult = ListProgramsCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Cannot retrieve programs: https://cloudmanager.adobe.io/api/programs (404 Not Found)'))
})

test('list-programs - success empty', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "empty"
            }
        }),
    }

    expect.assertions(2)

    let runResult = ListProgramsCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual([])
})

test('list-programs - success', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }

    expect.assertions(2)

    let runResult = ListProgramsCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toMatchObject([{
        id: "4",
        name: "test0",
        enabled: true
    },{
        id: "5",
        name: "test1",
        enabled: true
    },
    {
        id: "6",
        name: "test2",
        enabled: false
    }])
})

test('list-programs - filtered', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }

    expect.assertions(2)

    let runResult = ListProgramsCommand.run(["-e"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toMatchObject([{
        id: "4",
        name: "test0",
        enabled: true
    },{
        id: "5",
        name: "test1",
        enabled: true
    }])
})
