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
const ListAvailableLogOptionsCommand = require('../../src/commands/cloudmanager/list-available-log-options')

beforeEach(() => {
    setStore({})
})

test('list-available-logs - missing arg', async () => {
    expect.assertions(2)

    let runResult = ListAvailableLogOptionsCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 1 required arg") > -1)
})

test('list-available-logs - missing programId', async () => {
    expect.assertions(2)

    let runResult = ListAvailableLogOptionsCommand.run(["1"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Program ID must be specified either as --programId flag or through cloudmanager_programid") === 0)
})

test('list-available-logs - missing config', async () => {
    expect.assertions(2)

    let runResult = ListAvailableLogOptionsCommand.run(["1", "--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('list-available-logs - failure', async () => {
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

    let runResult = ListAvailableLogOptionsCommand.run(["1"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Cannot retrieve environments: https://cloudmanager.adobe.io/api/program/6/environments (404 Not Found)'))
})

test('list-available-logs - success undefined', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "4"
    })

    expect.assertions(3)

    let runResult = ListAvailableLogOptionsCommand.run(["3"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual([])
    await expect(cli.info.mock.calls[0][0]).toBe("No log options are available for environmentId 3")
})

test('list-available-logs - success empty', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "4"
    })

    expect.assertions(3)

    let runResult = ListAvailableLogOptionsCommand.run(["2"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual([])
    await expect(cli.info.mock.calls[0][0]).toBe("No log options are available for environmentId 2")
})

test('list-available-logs - success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "4"
    })

    expect.assertions(3)

    let runResult = ListAvailableLogOptionsCommand.run(["1"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toMatchObject([{
        "service" : "author",
        "name" : "aemerror"
    },
    {
        "service" : "author",
        "name" : "aemrequest"
    },
    {
        "service" : "author",
        "name" : "aemaccess"
    },
    {
        "service" : "publish",
        "name" : "aemerror"
    },
    {
        "service" : "publish",
        "name" : "aemrequest"
    },
    {
        "service" : "publish",
        "name" : "aemaccess"
    },
    {
        "service" : "dispatcher",
        "name" : "httpdaccess"
    },
    {
        "service" : "dispatcher",
        "name" : "httpderror"
    },
    {
        "service" : "dispatcher",
        "name" : "aemdispatcher"
    }])

    await expect(cli.table.mock.calls[0][1].id.get()).toBe("1")
})


test('list-available-logs - bad program', async () => {
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

    let runResult = ListAvailableLogOptionsCommand.run(["1"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Could not find program 8'))
})

test('list-available-logs - bad environment', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
        'cloudmanager_programid': "4"
    })

    expect.assertions(2)

    let runResult = ListAvailableLogOptionsCommand.run(["5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Could not find environment 5 for program 4'))
})
