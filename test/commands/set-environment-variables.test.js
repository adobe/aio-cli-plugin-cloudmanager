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
const SetEnvironmentVariablesCommand = require('../../src/commands/cloudmanager/set-environment-variables')

beforeEach(() => {
    setStore({})
})

afterEach(fetchMock.resetHistory)

test('set-environment-variables - missing arg', async () => {
    expect.assertions(2)

    let runResult = SetEnvironmentVariablesCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 1 required arg") > -1)
})

test('set-environment-variables - missing programId', async () => {
    expect.assertions(2)

    let runResult = SetEnvironmentVariablesCommand.run(["1"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Program ID must be specified either as --programId flag or through cloudmanager_programid") === 0)
})

test('set-environment-variables - missing config', async () => {
    expect.assertions(2)

    let runResult = SetEnvironmentVariablesCommand.run(["1", "--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('set-environment-variables - bad variable flag', async () => {
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

    let runResult = SetEnvironmentVariablesCommand.run(["1", "--variable", "foo"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Please provide correct values for flags'))
})

test('set-environment-variables - bad secret flag', async () => {
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

    let runResult = SetEnvironmentVariablesCommand.run(["1", "--secret", "foo"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Please provide correct values for flags'))
})

test('set-environment-variables - environments not found', async () => {
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

    let runResult = SetEnvironmentVariablesCommand.run(["1"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Cannot retrieve environments: https://cloudmanager.adobe.io/api/program/6/environments (404 Not Found)'))
})

test('set-environment-variables - no environment', async () => {
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

    let runResult = SetEnvironmentVariablesCommand.run(["4"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Could not find environment 4 for program 4'))
})

test('set-environment-variables - no variables link', async () => {
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

    let runResult = SetEnvironmentVariablesCommand.run(["2"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Could not find variables link for environment 2 for program 4'))
})

test('set-environment-variables - success empty', async () => {
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

    let runResult = SetEnvironmentVariablesCommand.run(["3"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual([])
})

test('set-environment-variables - variables only', async () => {
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

    let runResult = SetEnvironmentVariablesCommand.run(["1", "--variable", "foo", "bar", "--variable", "foo2", "bar2"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toBeTruthy()
    const patchCall = fetchMock.calls().find(call => call[0] === 'https://cloudmanager.adobe.io/api/program/4/environment/1/variables' && call[1].method === 'PATCH')
    await expect(JSON.parse(patchCall[1].body)).toMatchObject([{
        "name" : "foo",
        "type": "string",
        "value" : "bar"
    }, {
        "name" : "foo2",
        "type": "string",
        "value" : "bar2"
    }])
})

test('set-environment-variables - secrets only', async () => {
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

    let runResult = SetEnvironmentVariablesCommand.run(["1", "--secret", "foo", "bar", "--secret", "foo2", "bar2"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toBeTruthy()
    const patchCall = fetchMock.calls().find(call => call[0] === 'https://cloudmanager.adobe.io/api/program/4/environment/1/variables' && call[1].method === 'PATCH')
    await expect(JSON.parse(patchCall[1].body)).toMatchObject([{
        "name" : "foo",
        "type": "secretString",
        "value" : "bar"
    }, {
        "name" : "foo2",
        "type": "secretString",
        "value" : "bar2"
    }])
})

test('set-environment-variables - secret and variable', async () => {
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

    let runResult = SetEnvironmentVariablesCommand.run(["1", "--variable", "foo", "bar", "--secret", "foo2", "bar2"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toBeTruthy()
    const patchCall = fetchMock.calls().find(call => call[0] === 'https://cloudmanager.adobe.io/api/program/4/environment/1/variables' && call[1].method === 'PATCH')
    await expect(JSON.parse(patchCall[1].body)).toMatchObject([{
        "name" : "foo",
        "type": "string",
        "value" : "bar"
    }, {
        "name" : "foo2",
        "type": "secretString",
        "value" : "bar2"
    }])
    await expect(cli.table.mock.calls[0][1].value.get({
        "name" : "I_AM_A_SECRET",
        "type": "secretString"
    })).toBe("****")
})

test('set-environment-variables - delete', async () => {
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

    let runResult = SetEnvironmentVariablesCommand.run(["1", "--delete", "foo"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toBeTruthy()
    const patchCall = fetchMock.calls().find(call => call[0] === 'https://cloudmanager.adobe.io/api/program/4/environment/1/variables' && call[1].method === 'PATCH')
    await expect(JSON.parse(patchCall[1].body)).toMatchObject([{
        "name" : "foo",
        "value" : ""
    }])
})
