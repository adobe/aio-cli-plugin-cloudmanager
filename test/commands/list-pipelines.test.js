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

const ListPipelinesCommand = require('../../src/commands/cloudmanager/list-pipelines')

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

test('list-pipelines - missing arg', async () => {
    expect.assertions(2)

    let runResult = ListPipelinesCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Program ID must be specified either as --programId flag or through cloudmanager_programid") === 0)
})

test('list-pipelines - missing config', async () => {
    expect.assertions(2)

    let runResult = ListPipelinesCommand.run(["--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('list-pipelines - failure', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "6"
    }

    expect.assertions(2)

    let runResult = ListPipelinesCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Cannot retrieve pipelines: https://cloudmanager.adobe.io/api/program/6/pipelines (404 Not Found)'))
})

test('list-pipelines - success empty', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "4"
    }

    expect.assertions(2)

    let runResult = ListPipelinesCommand.run([])
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
        'cloudmanager_programid': "5"
    }

    expect.assertions(2)

    let runResult = ListPipelinesCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toMatchObject([{
        id: "5",
        name: "test1",
        status: "IDLE"
    },
    {
        id: "6",
        name: "test2",
        status: "BUSY"
    },
    {
        id: "7",
        name: "test3",
        status: "BUSY"
    }])
})


test('list-pipelines - bad program', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "8"
    }

    expect.assertions(2)

    let runResult = ListPipelinesCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Could not find program 8'))
})
