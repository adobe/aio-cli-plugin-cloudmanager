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

const nodeFetch = jest.requireActual('node-fetch');
const fetchMock = require('fetch-mock').sandbox();
Object.assign(fetchMock.config, nodeFetch, {
    fetch: nodeFetch
});
module.exports = fetchMock;

function mockResponseWithOrgId(url, orgId, response) {
    fetchMock.mock((u, { headers }) => u === url && headers['x-gw-ims-org-id'] === orgId, response)
}

function mockResponseWithMethod(url, method, response) {
    fetchMock.mock((u, opts) => u === url && opts.method === method, response);
}

mockResponseWithOrgId('https://cloudmanager.adobe.io/api/programs', 'not-found', 404)
mockResponseWithOrgId('https://cloudmanager.adobe.io/api/programs', 'empty', {})
mockResponseWithOrgId('https://cloudmanager.adobe.io/api/programs', 'good', {
    _embedded: {
        programs: [
            {
                id: "4",
                name: "test0",
                enabled: true,
                _links: {
                    self: {
                        href: '/api/program/4'
                    }
                }
            },
            {
                id: "5",
                name: "test1",
                enabled: true,
                _links: {
                    self: {
                        href: '/api/program/5'
                    }
                }
            },
            {
                id: "6",
                name: "test2",
                enabled: false,
                _links: {
                    self: {
                        href: '/api/program/6'
                    }
                }
            }
        ]
    }
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/4', {
    id: "4",
    name: "test0",
    enabled: true,
    _links: {
        self: {
            href: '/api/program/4'
        },
        'http://ns.adobe.com/adobecloud/rel/pipelines': {
            href: '/api/program/4/pipelines'
        }
    }
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/4/pipelines', {
    _embedded: {
        pipelines: []
    }
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/5', {
    id: "5",
    name: "test1",
    enabled: true,
    _links: {
        self: {
            href: '/api/program/5'
        },
        'http://ns.adobe.com/adobecloud/rel/pipelines': {
            href: '/api/program/5/pipelines'
        }
    }
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/5/pipelines', {
    _embedded: {
        pipelines: [
            {
                id: "5",
                name: "test1",
                status: "IDLE",
                _links: {
                    self: {
                        href: '/api/program/5/pipeline/5'
                    },
                    'http://ns.adobe.com/adobecloud/rel/execution': {
                        href: '/api/program/5/pipeline/5/execution'
                    }
                }
            },
            {
                id: "6",
                name: "test2",
                status: "BUSY",
                _links: {
                    self: {
                        href: '/api/program/5/pipeline/6'
                    },
                    'http://ns.adobe.com/adobecloud/rel/execution': {
                        href: '/api/program/5/pipeline/6/execution'
                    }
                }
            },
            {
                id: "7",
                name: "test3",
                status: "BUSY",
                _links: {
                    self: {
                        href: '/api/program/5/pipeline/7'
                    },
                    'http://ns.adobe.com/adobecloud/rel/execution': {
                        href: '/api/program/5/pipeline/7/execution'
                    }
                }
            }
        ]
    }
})
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/5/execution', 'GET', 404)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/5/execution', 'PUT', {
    status: 201,
    headers: {
        location: 'https://cloudmanager.adobe.io/api/program/4/pipeline/8555/execution/12742'
    }
});

mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/6/execution', 'GET', require('./data/execution1000.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/6/execution', 'PUT', 412)

fetchMock.mock('https://cloudmanager.adobe.io/api/program/6', {
    id: "6",
    name: "test2",
    enabled: false,
    _links: {
        self: {
            href: '/api/program/6'
        },
        'http://ns.adobe.com/adobecloud/rel/pipelines': {
            href: '/api/program/6/pipelines'
        }
    }
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/6/pipelines', 404)

mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001', 'GET', require('./data/execution1001.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/5/execution/1002', 'GET', 404)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1003', 'GET', require('./data/execution1003.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1004', 'GET', require('./data/execution1004.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4596/step/8493/metrics', 'GET', require('./data/metrics.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4597/step/8494/metrics', 'GET', {})
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4597/step/8495/metrics', 'GET', 404)

let executionForPipeline7 = "1001"
const pipeline7Executions = {
    "1001": require(`./data/execution1001.json`),
    "1005": require('./data/execution1005.json'),
    "1006": require('./data/execution1006.json'),
    "1007": require('./data/execution1007.json')
}
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution', 'GET', () => pipeline7Executions[executionForPipeline7])
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1006/phase/4596/step/8493/metrics', 'GET', require('./data/metrics.json'))

fetchMock.setPipeline7Execution = function(id) {
    executionForPipeline7 = id
}
fetchMock.mock((url, opts) => url === 'https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1005/phase/4596/step/8492/cancel' &&
        opts.method === 'PUT' && opts.body === JSON.stringify({cancel: true}),
    202, {
        name: 'cancel-1005'
    });
fetchMock.mock((url, opts) => url === 'https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1006/phase/4596/step/8493/cancel' &&
        opts.method === 'PUT' && opts.body === JSON.stringify({override: false}),
    202, {
        name: 'cancel-1006'
    });
fetchMock.mock((url, opts) => url === 'https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1007/phase/8567/step/15490/cancel' &&
        opts.method === 'PUT' && opts.body === JSON.stringify({approved: false}),
    202, {
        name: 'cancel-1007'
    });
fetchMock.mock((url, opts) => url === 'https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1007/phase/8567/step/15490/advance' &&
        opts.method === 'PUT' && opts.body === JSON.stringify({approved: true}),
    202, {
        name: 'advance-1007'
    });
fetchMock.mock((url, opts) => url === 'https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1006/phase/4596/step/8493/advance' &&
        opts.method === 'PUT' && JSON.parse(opts.body).metrics.length === 1 && JSON.parse(opts.body).metrics[0].override === true,
    202, {
        name: 'advance-1006'
    });
