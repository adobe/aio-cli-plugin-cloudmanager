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
const fetchMock = require('node-fetch')
const CancelCurrentExecution = require('../../src/commands/cloudmanager/cancel-current-execution')

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

test('cancel-current-execution - missing arg', async () => {
    expect.assertions(2)

    let runResult = CancelCurrentExecution.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 1 required arg") === 0)
})

test('cancel-current-execution - missing config', async () => {
    expect.assertions(3)

    let runResult = CancelCurrentExecution.run(["--programId", "5", "10"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("missing config data: jwt-auth")
})

test('cancel-current-execution - bad pipeline', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }

    expect.assertions(3)

    let runResult = CancelCurrentExecution.run(["--programId", "5", "10"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("Cannot get execution. Pipeline 10 does not exist.")
})

test('cancel-current-execution - build running', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }
    fetchMock.setPipeline7Execution("1005")

    expect.assertions(3)

    let runResult = CancelCurrentExecution.run(["--programId", "5", "7"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual({})
    await expect(fetchMock.called('cancel-1005')).toBeTruthy()
})

test('cancel-current-execution - code quality waiting', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }
    fetchMock.setPipeline7Execution("1006")

    expect.assertions(3)

    let runResult = CancelCurrentExecution.run(["--programId", "5", "7"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual({})
    await expect(fetchMock.called('cancel-1006')).toBe(true)
})

test('cancel-current-execution - approval waiting', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }
    fetchMock.setPipeline7Execution("1007")

    expect.assertions(3)

    let runResult = CancelCurrentExecution.run(["--programId", "5", "7"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual({})
    await expect(fetchMock.called('cancel-1007')).toBe(true)
})
