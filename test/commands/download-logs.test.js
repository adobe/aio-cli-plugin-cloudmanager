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

const { setStore } = require('@adobe/aio-cna-core-config')
const DownloadLogs = require('../../src/commands/cloudmanager/download-logs')

beforeEach(() => {
    setStore({})
})

test('download-logs - missing arg', async () => {
    expect.assertions(2)

    let runResult = DownloadLogs.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 3 required args") === 0)
})

test('download-logs - missing config', async () => {
    expect.assertions(2)

    let runResult = DownloadLogs.run(["5", "author", "aemerror", "--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('download-logs - failure', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(2)

    let runResult = DownloadLogs.run(["17", "author", "aemerror", "--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Could not find environment 17 for program 5'))
})

test('download-logs - success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = DownloadLogs.run(["1", "author", "aemerror", "--programId", "4"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toHaveLength(2)
    await expect(runResult).resolves.toMatchObject([{
        "path": "./1-author-aemerror-2019-09-8.log"
    },
    {
        "path": "./1-author-aemerror-2019-09-7.log"
    }])
})
