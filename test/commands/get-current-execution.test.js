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
const GetCurrentExecution = require('../../src/commands/cloudmanager/get-current-execution')

beforeEach(() => {
    setStore({})
})

test('get-current-execution - missing arg', async () => {
    expect.assertions(2)

    let runResult = GetCurrentExecution.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 1 required arg") === 0)
})

test('get-current-execution - missing config', async () => {
    expect.assertions(2)

    let runResult = GetCurrentExecution.run(["5", "--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('get-current-execution - failure', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(2)

    let runResult = GetCurrentExecution.run(["5", "--programId", "5"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Cannot get current execution: https://cloudmanager.adobe.io/api/program/5/pipeline/5/execution (404 Not Found)'))
})

test('get-current-execution - success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(2)

    let runResult = GetCurrentExecution.run(["--programId", "5", "6"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toMatchObject({
        "id": "1000",
        "programId": "5",
        "pipelineId": "6",
    })
})
