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
const ListEnvironmentsCommand = require('../../src/commands/cloudmanager/list-environments')

beforeEach(() => {
    setStore({})
})

test('list-environments - missing arg', async () => {
    expect.assertions(2)

    let runResult = ListEnvironmentsCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Program ID must be specified either as --programId flag or through cloudmanager_programid") === 0)
})

test('list-environments - missing config', async () => {
    expect.assertions(2)

    let runResult = ListEnvironmentsCommand.run(["--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('list-environments - failure', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "6"
    })

    expect.assertions(2)

    let runResult = ListEnvironmentsCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Cannot retrieve environments: https://cloudmanager.adobe.io/api/program/6/environments (404 Not Found)'))
})

test('list-environments - success empty', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "5"
    })

    expect.assertions(2)

    let runResult = ListEnvironmentsCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual([])
})

test('list-environments - success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "4"
    })

    expect.assertions(4)

    let runResult = ListEnvironmentsCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toMatchObject([{
        id: "1",
        name: "TestProgram_prod",
        type: "prod"
    },
    {
        id: "2",
        name: "TestProgram_stage",
        type: "stage"
    },
    {
        id: "3",
        name: "TestProgram_dev",
        type: "dev"
    }])
    await expect(cli.table.mock.calls[0][1].description.get({})).toBe("")
    await expect(cli.table.mock.calls[0][1].description.get({description: "foo"})).toBe("foo")
})


test('list-environments - bad program', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "8"
    })

    expect.assertions(2)

    let runResult = ListEnvironmentsCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Could not find program 8'))
})
