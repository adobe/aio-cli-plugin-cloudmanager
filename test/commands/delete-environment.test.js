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
const { setStore } = require('@adobe/aio-lib-core-config')
const DeleteEnvironmentCommand = require('../../src/commands/cloudmanager/delete-environment')

beforeEach(() => {
    setStore({})
})

test('delete-environment - missing arg', async () => {
    expect.assertions(2)

    let runResult = DeleteEnvironmentCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 1 required arg") === 0)
})

test('delete-environment - missing config', async () => {
    expect.assertions(3)

    let runResult = DeleteEnvironmentCommand.run(["--programId", "4", "10"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("missing config data: jwt-auth")
})

test('delete-environment - delete environment returns 400', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = DeleteEnvironmentCommand.run(["--programId", "4", "3"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("Cannot delete environment: https://cloudmanager.adobe.io/api/program/4/environment/3 (400 Bad Request)")
})

test('delete-environment - bad environment', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = DeleteEnvironmentCommand.run(["--programId", "4", "12"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("Cannot delete environment. Environment 12 does not exist in program 4.")
})

test('delete-environment - success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = DeleteEnvironmentCommand.run(["--programId", "4", "11"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual({})
    await expect(cli.action.stop.mock.calls[0][0]).toBe("deleted environment ID 11")
})


