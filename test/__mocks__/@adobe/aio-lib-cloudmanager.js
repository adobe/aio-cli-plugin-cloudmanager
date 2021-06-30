/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const { getCurrentStep } = jest.requireActual('@adobe/aio-lib-cloudmanager')

function createDefaultMock () {
  return {
    listPrograms: jest.fn(() => Promise.resolve([{
      id: '6',
      name: 'test2',
      enabled: false,
      _links: {
        self: {
          href: '/api/program/6',
        },
      },
    }, {
      id: '7',
      name: 'test3',
      enabled: true,
      _links: {
        self: {
          href: '/api/program/7',
        },
      },
    }])),
    listPipelines: jest.fn(() => Promise.resolve([
      {
        id: '10',
      },
    ])),
    createExecution: jest.fn(() => Promise.resolve()),
    getCurrentExecution: jest.fn(() => Promise.resolve()),
    getExecution: jest.fn(() => Promise.resolve()),
    getQualityGateResults: jest.fn(() => Promise.resolve({
      metrics: [],
    })),
    cancelCurrentExecution: jest.fn(() => Promise.resolve()),
    advanceCurrentExecution: jest.fn(() => Promise.resolve()),
    listEnvironments: jest.fn(() => Promise.resolve([{
      id: '1',
      name: 'TestProgram_prod',
      type: 'prod',
    },
    {
      id: '2',
      name: 'TestProgram_stage',
      type: 'stage',
    },
    {
      id: '3',
      name: 'TestProgram_dev',
      type: 'dev',
    },
    {
      id: '10',
      name: 'TestProgram_dev2',
      type: 'dev',
    },
    {
      id: '11',
      name: 'TestProgram_dev3',
      type: 'dev',
    }])),
    getExecutionStepLog: jest.fn(() => Promise.resolve()),
    listAvailableLogOptions: jest.fn(() => Promise.resolve([])),
    downloadLogs: jest.fn(() => Promise.resolve([{
      path: './1-author-aemerror-2019-09-8.log',
    }])),
    deletePipeline: jest.fn(() => Promise.resolve()),
    updatePipeline: jest.fn(() => Promise.resolve()),
    getDeveloperConsoleUrl: jest.fn(() => Promise.resolve('https://github.com/adobe/aio-cli-plugin-cloudmanager')),
    getEnvironmentVariables: jest.fn(() => Promise.resolve([{
      name: 'KEY',
      type: 'string',
      value: 'value',
    }, {
      name: 'I_AM_A_SECRET',
      type: 'secretString',
    }, {
      name: 'AUTHOR_SECRET',
      value: 'something',
      service: 'author',
      type: 'secretString',
    },
    {
      name: 'VARIABLE',
      value: 'something',
      type: 'string',
      status: 'created',
    }])),
    setEnvironmentVariables: jest.fn(() => Promise.resolve()),
    getPipelineVariables: jest.fn(() => Promise.resolve([{
      name: 'KEY',
      type: 'string',
      value: 'value',
    }, {
      name: 'I_AM_A_SECRET',
      type: 'secretString',
    }])),
    setPipelineVariables: jest.fn(() => Promise.resolve()),
    deleteProgram: jest.fn(() => Promise.resolve()),
    deleteEnvironment: jest.fn(() => Promise.resolve()),
    tailLog: jest.fn(() => Promise.resolve()),
    tailExecutionStepLog: jest.fn(() => Promise.resolve()),
  }
}

let mock = createDefaultMock()

module.exports = {
  generateNewMock: () => {
    mock = createDefaultMock()
    return mock
  },
  init: jest.fn(() => mock),
  mockSdk: mock,
  getCurrentStep: getCurrentStep,
}
