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
const UpdatePipelineCommand = require('../../src/commands/cloudmanager/update-pipeline')

beforeEach(() => {
    setStore({})
})

test('update-pipeline - missing arg', async () => {
    expect.assertions(2)

    let runResult = UpdatePipelineCommand.run([])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).rejects.toSatisfy(err => err.message.indexOf("Missing 1 required arg") === 0)
})

test('update-pipeline - missing config', async () => {
    expect.assertions(3)

    let runResult = UpdatePipelineCommand.run(["--programId", "5", "10"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("missing config data: jwt-auth")
})

test('update-pipeline - bad pipeline', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = UpdatePipelineCommand.run(["--programId", "5", "10"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toEqual(undefined)
    await expect(cli.action.stop.mock.calls[0][0]).toBe("Cannot update pipeline. Pipeline 10 does not exist.")
})

test('update-pipeline - branch success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = UpdatePipelineCommand.run(["--programId", "5", "5", "--branch", "develop"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toMatchObject({
        phases: expect.arrayContaining([{
            name: 'BUILD_1',
            branch: 'develop',
            type: 'BUILD',
            repositoryId: '1'
        }])
    })
    await expect(cli.action.stop.mock.calls[0][0]).toBe("updated pipeline ID 5")
})

test('update-pipeline - repository and branch success', async () => {
    setStore({
        'jwt-auth': JSON.stringify({
            client_id: '1234',
            jwt_payload: {
                iss: "good"
            }
        }),
    })

    expect.assertions(3)

    let runResult = UpdatePipelineCommand.run(["--programId", "5", "5", "--branch", "develop", "--repositoryId", "4"])
    await expect(runResult instanceof Promise).toBeTruthy()
    await expect(runResult).resolves.toMatchObject({
        phases: expect.arrayContaining([{
            name: 'BUILD_1',
            branch: 'develop',
            type: 'BUILD',
            repositoryId: '4'
        }])
    })
    await expect(cli.action.stop.mock.calls[0][0]).toBe("updated pipeline ID 5")
})


