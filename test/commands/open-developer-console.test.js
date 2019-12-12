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
const OpenDeveloperConsoleCommand = require('../../src/commands/cloudmanager/open-developer-console')

beforeEach(() => {
    setStore({})
})

test('open-developer-console - missing arg', async () => {
    expect.assertions(2)

    let runResult = OpenDeveloperConsoleCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 1 required arg") > -1)
})

test('open-developer-console - missing programId', async () => {
    expect.assertions(2)

    let runResult = OpenDeveloperConsoleCommand.run(["1"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Program ID must be specified either as --programId flag or through cloudmanager_programid") === 0)
})

test('open-developer-console - missing config', async () => {
    expect.assertions(2)

    let runResult = OpenDeveloperConsoleCommand.run(["1", "--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('open-developer-console - failure', async () => {
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

    let runResult = OpenDeveloperConsoleCommand.run(["1"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Cannot retrieve environments: https://cloudmanager.adobe.io/api/program/6/environments (404 Not Found)'))
})

test('open-developer-console - missing properties', async () => {
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

    let runResult = OpenDeveloperConsoleCommand.run(["3"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Environment 3 does not appear to support Developer Console.'))
})

test('open-developer-console - success hal', async () => {
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

    let runResult = OpenDeveloperConsoleCommand.run(["1"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual("https://github.com/adobe/aio-cli-plugin-cloudmanager")
    await expect(cli.open.mock.calls[0][0]).toBe("https://github.com/adobe/aio-cli-plugin-cloudmanager")
})

test('open-developer-console - success props', async () => {
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

    let runResult = OpenDeveloperConsoleCommand.run(["2"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual("https://dev-console-ns.cs.dev.adobeaemcloud.com/dc/")
    await expect(cli.open.mock.calls[0][0]).toBe("https://dev-console-ns.cs.dev.adobeaemcloud.com/dc/")
})

test('open-developer-console - bad program', async () => {
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

    let runResult = OpenDeveloperConsoleCommand.run(["1"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Could not find program 8'))
})

test('open-developer-console - bad environment', async () => {
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

    let runResult = OpenDeveloperConsoleCommand.run(["5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Could not find environment 5 for program 4'))
})
