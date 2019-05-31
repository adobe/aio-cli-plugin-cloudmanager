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
const StartExecutionCommand = require('../../src/commands/cloudmanager/start-execution')

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

test('start-execution - missing arg', async () => {
    expect.assertions(2)

    let runResult = StartExecutionCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 1 required arg") === 0)
})

test('start-execution - missing config', async () => {
    expect.assertions(2)

    let runResult = StartExecutionCommand.run(["--programId", "5", "10"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('start-execution - bad pipeline', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }

    const actionSpy = jest.spyOn(cli.action, 'stop');

    expect.assertions(3)

    let runResult = StartExecutionCommand.run(["--programId", "5", "10"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(actionSpy).toHaveBeenCalledWith("Cannot start execution. Pipeline 10 does not exist.")
})

test('start-execution - failed 412', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }

    const actionSpy = jest.spyOn(cli.action, 'stop');

    expect.assertions(3)

    let runResult = StartExecutionCommand.run(["--programId", "5", "6"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(actionSpy).toHaveBeenCalledWith("Cannot create execution. Pipeline already running.")
})

test('start-execution - success', async () => {
    mockStore = {
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    }

    expect.assertions(2)

    let runResult = StartExecutionCommand.run(["--programId", "5", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual("LOCATION")
})


