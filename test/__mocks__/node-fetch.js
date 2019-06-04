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
        location: 'LOCATION'
    }
});

mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/6/execution', 'GET', require('./data/execution1.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/6/execution', 'PUT', 412)

mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution', 'GET', require('./data/execution2.json'))

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

mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/5/execution/1002', 'GET', 404)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001', 'GET', require('./data/execution2.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1004', 'GET', require('./data/execution3.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4596/step/8493/metrics', 'GET', require('./data/metrics.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4597/step/8494/metrics', 'GET', {})
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4597/step/8495/metrics', 'GET', 404)
