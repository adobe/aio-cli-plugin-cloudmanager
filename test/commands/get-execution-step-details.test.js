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
const GetExecutionStepDetails = require('../../src/commands/cloudmanager/get-execution-step-details')

beforeEach(() => {
    setStore({})
})

test('get-execution-step-details - missing arg', async () => {
    expect.assertions(2)

    let runResult = GetExecutionStepDetails.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 2 required args") === 0)
})

test('get-execution-step-details - missing config', async () => {
    expect.assertions(2)

    let runResult = GetExecutionStepDetails.run(["5", "--programId", "7", "1001"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('missing config data: jwt-auth'))
})

test('get-execution-step-details - failure', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(2)

    let runResult = GetExecutionStepDetails.run(["5", "--programId", "5", "1002"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error('Cannot get execution: https://cloudmanager.adobe.io/api/program/5/pipeline/5/execution/1002 (404 Not Found)'))
})

test('get-execution-step-details - success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(4)

    let runResult = GetExecutionStepDetails.run(["--programId", "5", "7", "1001"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toHaveLength(11)

    const tableCall = cli.table.mock.calls[0];
    const tableData = tableCall[0];
    const columns = tableCall[1];

    const columnResults = tableData.map(row => {
        const rowMapped = {};
        Object.keys(columns).forEach(column => {
            rowMapped[column] = columns[column].get(row)
        })
        return rowMapped;
    })

    expect(columnResults).toMatchObject([{
        "action": "Validate",
        "status": "Finished"
    },{
        "action": "Build",
        "status": "Finished"
    },{
        "action": "Code Quality",
        "status": "Finished"
    },{
        "action": "Stage Deploy",
        "status": "Finished"
    },{
        "action": "Security Test",
        "status": "Finished"
    },{
        "action": "Load Test",
        "status": "Finished"
    },{
        "action": "Assets Test",
        "status": "Finished"
    },{
        "action": "Report Performance Test",
        "status": "Finished"
    },{
        "action": "Approval",
        "status": "Finished"
    },{
        "action": "Managed",
        "status": "Waiting"
    },{
        "action": "Prod Deploy",
        "status": "Not Started"
    }])

    expect(columnResults[2].startedAt).toBeTruthy()
})

test('get-execution-step-details - bad pipeline', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(2)

    let runResult = GetExecutionStepDetails.run(["--programId", "5", "100", "1001"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toEqual(new Error("Cannot get execution. Pipeline 100 does not exist."))
})
