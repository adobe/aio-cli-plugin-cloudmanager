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
const { setStore } = require('@adobe/aio-cna-core-config')
const StartExecutionCommand = require('../../src/commands/cloudmanager/start-execution')

beforeEach(() => {
    setStore({})
})

test('start-execution - missing arg', async () => {
    expect.assertions(2)

    let runResult = StartExecutionCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 1 required arg") === 0)
})

test('start-execution - missing config', async () => {
    expect.assertions(3)

    let runResult = StartExecutionCommand.run(["--programId", "5", "10"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("missing config data: jwt-auth")
})

test('start-execution - bad pipeline', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = StartExecutionCommand.run(["--programId", "5", "10"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("Cannot start execution. Pipeline 10 does not exist.")
})

test('start-execution - failed 412', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = StartExecutionCommand.run(["--programId", "5", "6"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("Cannot create execution. Pipeline already running.")
})

test('start-execution - success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = StartExecutionCommand.run(["--programId", "5", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual("https://cloudmanager.adobe.io/api/program/4/pipeline/8555/execution/12742")
    await expect(cli.action.stop.mock.calls[0][0]).toBe("started execution ID 12742")
})


