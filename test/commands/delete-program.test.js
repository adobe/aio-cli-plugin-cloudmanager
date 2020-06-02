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
const { setStore } = require('@adobe/aio-lib-core-config')
const DeleteProgramCommand = require('../../src/commands/cloudmanager/delete-program')

beforeEach(() => {
    setStore({})
})

test('delete-program - missing arg', async () => {
    expect.assertions(2)

    let runResult = DeleteProgramCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 1 required arg") === 0)
})

test('delete-program - missing config', async () => {
    expect.assertions(3)

    let runResult = DeleteProgramCommand.run(["5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("missing config data: jwt-auth")
})

test('delete-program - delete program returns 400', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = DeleteProgramCommand.run(["5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("Cannot delete program: https://cloudmanager.adobe.io/api/program/5 (400 Bad Request)")
})

test('delete-program - bad program', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = DeleteProgramCommand.run(["11"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("Cannot delete program. Program 11 does not exist.")
})

test('delete-program - success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = DeleteProgramCommand.run(["6"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual({})
    await expect(cli.action.stop.mock.calls[0][0]).toBe("deleted program ID 6")
})


