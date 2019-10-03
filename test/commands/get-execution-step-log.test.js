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
const GetExecutionStepLog = require('../../src/commands/cloudmanager/get-execution-step-log')

let capturedStdout
let stdoutWriteToRestore;

beforeEach(() => {
    setStore({})
    capturedStdout = ''
    stdoutWriteToRestore = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk) => {
        if (typeof chunk === 'string') {
            capturedStdout += chunk;
        } else if (Buffer.isBuffer(chunk)) {
            capturedStdout += chunk.toString()
        }
    };
})

afterEach(() => {
    process.stdout.write = stdoutWriteToRestore
})

test('get-execution-step-log - missing arg', async () => {
    expect.assertions(2)

    let runResult = GetExecutionStepLog.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 3 required args") === 0)
})

test('get-execution-step-log - missing config', async () => {
    expect.assertions(2)

    let runResult = GetExecutionStepLog.run(["5", "--programId", "7", "1001", "codeQuality"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('get-execution-step-log - failure', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(2)

    let runResult = GetExecutionStepLog.run(["5", "--programId", "5", "1002", "codeQuality"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Cannot get execution: https://cloudmanager.adobe.io/api/program/5/pipeline/5/execution/1002 (404 Not Found)'))
})

test('get-execution-step-log - success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = GetExecutionStepLog.run(["--programId", "5", "7", "1001", "codeQuality"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual({})
    expect(capturedStdout).toEqual("some log line\nsome other log line\n")
})

test('get-execution-step-log - not found', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(2)

    let runResult = GetExecutionStepLog.run(["--programId", "5", "7", "1001", "stageDeploy"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error("Cannot get log: https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4597/step/8494/logs (404 Not Found)"))
})

test('get-execution-step-log - empty', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(2)

    let runResult = GetExecutionStepLog.run(["--programId", "5", "7", "1001", "prodDeploy"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error("Log https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4598/step/8500/logs did not contain a redirect. Was {}."))
})

test('get-execution-step-log - missing step', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(2)

    let runResult = GetExecutionStepLog.run(["--programId", "5", "7", "1003", "devDeploy"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error("Cannot find step state for action devDeploy on execution 1003."))
})

test('get-execution-step-log - bad pipeline', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(2)

    let runResult = GetExecutionStepLog.run(["--programId", "5", "100", "1001", "build"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error("Cannot get execution. Pipeline 100 does not exist."))
})

