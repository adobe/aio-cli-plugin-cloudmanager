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

const fs = require("fs")
const nodeFetch = jest.requireActual('node-fetch');
const fetchMock = require('fetch-mock').sandbox();
const { Readable } = require('stream');
Object.assign(fetchMock.config, nodeFetch, {
    fetch: nodeFetch
});
const _ = require('lodash')
module.exports = fetchMock;

function mockResponseWithOrgId(url, orgId, response) {
    fetchMock.mock({ url, headers: {"x-gw-ims-org-id" : orgId }, name: `${url}-org-id-${orgId}` }, response)
}

function mockResponseWithMethod(url, method, response) {
    fetchMock.mock({ url, method, name: `${method}-${url}` }, response)
}

mockResponseWithOrgId('https://cloudmanager.adobe.io/api/programs', 'forbidden', {
    status: 403,
    headers: {
        'content-type': 'application/json'
    },
    body: {
        error_code: "1234",
        message: "some message"
    }
})
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
            },
            {
                id: "7",
                name: "test3",
                enabled: true,
                _links: {
                    self: {
                        href: '/api/program/7'
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
        },
        'http://ns.adobe.com/adobecloud/rel/environments': {
            href: '/api/program/4/environments'
        }
    }
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/4/pipelines', {
    _embedded: {
        pipelines: []
    }
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/4/environments', {
    "_embedded": {
        "environments": [
            {
                "_links": {
                    "self": {
                        "href": "/api/program/4/environment/1",
                        "templated": false
                    },
                    "http://ns.adobe.com/adobecloud/rel/logs": {
                        "href": "/api/program/4/environment/1/logs?service={service}&name={name}&days={days}",
                        "templated": true
                    },
                    "http://ns.adobe.com/adobecloud/rel/variables": {
                        "href": "/api/program/4/environment/1/variables"
                    },
                    "http://ns.adobe.com/adobecloud/rel/developerConsole" : {
                        "href": "https://github.com/adobe/aio-cli-plugin-cloudmanager"
                    }
                },
                "id": "1",
                "programId": "4",
                "name": "TestProgram_prod",
                "description": "description for TestProgram_prod",
                "type": "prod",
                "availableLogOptions": [
                    {
                        "service" : "author",
                        "name" : "aemerror"
                    },
                    {
                        "service" : "author",
                        "name" : "aemrequest"
                    },
                    {
                        "service" : "author",
                        "name" : "aemaccess"
                    },
                    {
                        "service" : "publish",
                        "name" : "aemerror"
                    },
                    {
                        "service" : "publish",
                        "name" : "aemrequest"
                    },
                    {
                        "service" : "publish",
                        "name" : "aemaccess"
                    },
                    {
                        "service" : "dispatcher",
                        "name" : "httpdaccess"
                    },
                    {
                        "service" : "dispatcher",
                        "name" : "httpderror"
                    },
                    {
                        "service" : "dispatcher",
                        "name" : "aemdispatcher"
                    }
                ]
            },
            {
                "_links": {
                    "self": {
                        "href": "/api/program/4/environment/2",
                        "templated": false
                    }
                },
                "id": "2",
                "programId": "4",
                "name": "TestProgram_stage",
                "description": "description for TestProgram_stage",
                "type": "stage",
                "availableLogs" : [],
                "namespace" : "ns",
                "cluster" : "cs"
            },
            {
                "_links": {
                    "self": {
                        "href": "/api/program/4/environment/3",
                        "templated": false
                    },
                    "http://ns.adobe.com/adobecloud/rel/variables": {
                        "href": "/api/program/4/environment/3/variables"
                    }
                },
                "id": "3",
                "programId": "4",
                "name": "TestProgram_dev",
                "description": "description for TestProgram_dev",
                "type": "dev"
            },
            {
                "_links": {
                    "self": {
                        "href": "/api/program/4/environment/10",
                        "templated": false
                    },
                    "http://ns.adobe.com/adobecloud/rel/variables": {
                        "href": "/api/program/4/environment/10/variables"
                    }
                },
                "id": "10",
                "programId": "4",
                "name": "TestProgram_dev2",
                "description": "description for TestProgram_dev2",
                "type": "dev"
            },
            {
                "_links": {
                    "self": {
                        "href": "/api/program/4/environment/11",
                        "templated": false
                    },
                    "http://ns.adobe.com/adobecloud/rel/variables": {
                        "href": "/api/program/4/environment/11/variables"
                    }
                },
                "id": "11",
                "programId": "4",
                "name": "TestProgram_dev3",
                "description": "description for TestProgram_dev3",
                "type": "dev"
            }
        ]
    },
    "_totalNumberOfItems": 3

})
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/4/environment/3', 'DELETE', 400)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/4/environment/11', 'DELETE', 204)


fetchMock.mock('https://cloudmanager.adobe.io/api/program/4/environment/1/logs?service=author&name=aemerror&days=1', {
    "_links": {
        "self": {
            "href": `/api/program/4/environment/1/logs?service=author&type=aemerror&days=1`
        },
        "http://ns.adobe.com/adobecloud/rel/program": {
            "href": `/api/program/4`,
            "templated": false
        },
        "http://ns.adobe.com/adobecloud/rel/environment": {
            "href": `/api/program/4/environment/1`,
            "templated": false
        }
    },
    "service": ["author"],
    "name": ["aemerror"],
    "days": 1,
    "_embedded": {
        "downloads": [
            {
                "_links": {
                    "http://ns.adobe.com/adobecloud/rel/logs/download": {
                        "href": "/api/program/4/environment/1/logs/download?service=author&name=aemerror&date=2019-09-8",
                        "templated": false
                    },
                    "http://ns.adobe.com/adobecloud/rel/logs/tail": {
                        "href": "https://filestore/logs/author_aemerror_2019-09-8.log"
                    }
                },
                "service": "author",
                "name": "aemerror",
                "date": "2019-09-8",
                "programId": 4,
                "environmentId": 1
            },
            {
                "_links": {
                    "http://ns.adobe.com/adobecloud/rel/logs/download": {
                        "href": "/api/program/4/environment/1/logs/download?service=author&name=aemerror&date=2019-09-7",
                        "templated": false
                    }
                },
                "service": "author",
                "name": "aemerror",
                "date": "2019-09-7",
                "programId": 4,
                "environmentId": 1
            }
        ]
    }
})

fetchMock.mock('https://cloudmanager.adobe.io/api/program/4/environment/1/logs?service=publish&name=aemerror&days=1', {
    "_links": {
        "self": {
            "href": `/api/program/4/environment/1/logs?service=publish&type=aemerror&days=1`
        },
        "http://ns.adobe.com/adobecloud/rel/program": {
            "href": `/api/program/4`,
            "templated": false
        },
        "http://ns.adobe.com/adobecloud/rel/environment": {
            "href": `/api/program/4/environment/1`,
            "templated": false
        }
    },
    "service": ["publish"],
    "name": ["aemerror"],
    "days": 1,
    "_embedded": {
        "downloads": [
            {
                "_links": {
                    "http://ns.adobe.com/adobecloud/rel/logs/download": {
                        "href": "/api/program/4/environment/2/logs/download?service=publish&name=aemerror&date=2019-09-7",
                        "templated": false
                    }
                },
                "service": "publish",
                "name": "aemerror",
                "date": "2019-09-8",
                "programId": 4,
                "environmentId": 2
            }
        ]
    }
})

fetchMock.mock("https://cloudmanager.adobe.io/api/program/4/environment/1/logs/download?service=author&name=aemerror&date=2019-09-8", {
    "redirect": "https://filestore/logs/author_aemerror_2019-09-8.log.gz"
})
fetchMock.mock("https://cloudmanager.adobe.io/api/program/4/environment/1/logs/download?service=author&name=aemerror&date=2019-09-7", {
    "redirect": "https://filestore/logs/author_aemerror_2019-09-7.log.gz"
})

fetchMock.mock("https://filestore/logs/author_aemerror_2019-09-8.log.gz", () => {
    return new nodeFetch.Response(fs.createReadStream(__dirname + "/file.log.gz"));
})
fetchMock.mock("https://filestore/logs/author_aemerror_2019-09-7.log.gz", () => {
    return new nodeFetch.Response(fs.createReadStream(__dirname + "/file.log.gz"));
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/4/environment/1/variables', {
    "_links": {
        "http://ns.adobe.com/adobecloud/rel/environment": {
            "href": "/api/program/4/environment/1",
            "templated": false
        },
        "http://ns.adobe.com/adobecloud/rel/program": {
            "href": "/api/program/4",
            "templated": false
        },
        "self": {
            "href": "/api/program/4/environment/1/variables",
            "templated": false
        }
    },
    "_embedded": {
        "variables": [
            {
                "name": "KEY",
                "value": "value",
                "type": "string"
            },
            {
                "name": "I_AM_A_SECRET",
                "type": "secretString"
            }
        ]
    },
    "_totalNumberOfItems": 2
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/4/environment/3/variables', {
    "_links": {
        "http://ns.adobe.com/adobecloud/rel/environment": {
            "href": "/api/program/4/environment/1",
            "templated": false
        },
        "http://ns.adobe.com/adobecloud/rel/program": {
            "href": "/api/program/4",
            "templated": false
        },
        "self": {
            "href": "/api/program/4/environment/3/variables",
            "templated": false
        }
    },
    "_embedded": {
        "variables": [
        ]
    },
    "_totalNumberOfItems": 0
})

mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5', 'DELETE', 400)

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
        },
        'http://ns.adobe.com/adobecloud/rel/environments': {
            href: '/api/program/5/environments'
        }
    }
})
const pipeline5 = {
    id: "5",
    name: "test1",
    status: "IDLE",
    phases: [
        {
            "name": "VALIDATE",
            "type": "VALIDATE"
        },
        {
            "name": "BUILD_1",
            "type": "BUILD",
            "repositoryId": "1",
            "branch": "yellow"
        }
    ],
    _links: {
        self: {
            href: '/api/program/5/pipeline/5'
        },
        'http://ns.adobe.com/adobecloud/rel/execution': {
            href: '/api/program/5/pipeline/5/execution'
        },
        'http://ns.adobe.com/adobecloud/rel/execution/id': {
            href: '/api/program/5/pipeline/5/execution/{executionId}',
            templated: true
        },
        'http://ns.adobe.com/adobecloud/rel/variables': {
            href: '/api/program/5/pipeline/5/variables'
        }
    }
}
fetchMock.mock('https://cloudmanager.adobe.io/api/program/5/pipelines', {
    _embedded: {
        pipelines: [
            pipeline5,
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
                    },
                    'http://ns.adobe.com/adobecloud/rel/execution/id': {
                        href: '/api/program/5/pipeline/6/execution/{executionId}',
                        templated: true
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
                    },
                    'http://ns.adobe.com/adobecloud/rel/execution/id': {
                        href: '/api/program/5/pipeline/7/execution/{executionId}',
                        templated: true
                    },
                    'http://ns.adobe.com/adobecloud/rel/variables': {
                        href: '/api/program/5/pipeline/7/variables'
                    }
                }
            },
            {
                id: "8",
                name: "test4",
                status: "IDLE",
                _links: {
                    self: {
                        href: '/api/program/5/pipeline/8'
                    },
                    'http://ns.adobe.com/adobecloud/rel/execution': {
                        href: '/api/program/5/pipeline/8/execution'
                    },
                    'http://ns.adobe.com/adobecloud/rel/execution/id': {
                        href: '/api/program/5/pipeline/8/execution/{executionId}',
                        templated: true
                    },
                    'http://ns.adobe.com/adobecloud/rel/variables': {
                        href: '/api/program/5/pipeline/8/variables'
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
fetchMock.mock('https://cloudmanager.adobe.io/api/program/5/environments', {
    _embedded: {
        environments: []
    }
})
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/5', 'DELETE', 204)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/5', 'PATCH', (url, opts) => {
    const parsed = JSON.parse(opts.body)
    const newPipeline = _.cloneDeep(pipeline5)
    const buildPhase = newPipeline.phases.find(phase => phase.type === 'BUILD')
    buildPhase.branch = parsed.phases[0].branch
    if (parsed.phases[0].repositoryId) {
        buildPhase.repositoryId = parsed.phases[0].repositoryId
    }
    return newPipeline
})

mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/6/execution', 'GET', require('./data/execution1000.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/6/execution', 'PUT', 412)

mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7', 'DELETE', 400)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution', 'PUT', 404)
fetchMock.mock('https://cloudmanager.adobe.io/api/program/5/pipeline/5/variables', {
    "_links": {
        "http://ns.adobe.com/adobecloud/rel/pipeline": {
            "href": "/api/program/5/pipeline/5",
            "templated": false
        },
        "http://ns.adobe.com/adobecloud/rel/program": {
            "href": "/api/program/5",
            "templated": false
        },
        "self": {
            "href": "/api/program/5/pipeline/5/variables",
            "templated": false
        }
    },
    "_embedded": {
        "variables": [
            {
                "name": "KEY",
                "value": "value",
                "type": "string"
            },
            {
                "name": "I_AM_A_SECRET",
                "type": "secretString"
            }
        ]
    },
    "_totalNumberOfItems": 2
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/5/pipeline/7/variables', 404)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/8/variables', 'GET', {
    "_links": {
        "http://ns.adobe.com/adobecloud/rel/pipeline": {
            "href": "/api/program/5/pipeline/8",
            "templated": false
        },
        "http://ns.adobe.com/adobecloud/rel/program": {
            "href": "/api/program/5",
            "templated": false
        },
        "self": {
            "href": "/api/program/5/pipeline/8/variables",
            "templated": false
        }
    },
    "_embedded": {
        "variables": [
        ]
    },
    "_totalNumberOfItems": 0
})
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/8/variables', 'PATCH', 400)

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
        },
        'http://ns.adobe.com/adobecloud/rel/environments': {
            href: '/api/program/6/environments'
        }
    }
})
fetchMock.mock('https://cloudmanager.adobe.io/api/program/6/pipelines', 404)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/6/environments', 'GET', 404)

mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001', 'GET', require('./data/execution1001.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/5/execution/1002', 'GET', 404)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1003', 'GET', require('./data/execution1003.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1004', 'GET', require('./data/execution1004.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4596/step/8493/metrics', 'GET', require('./data/metrics.json'))
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4597/step/8494/metrics', 'GET', {})
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4597/step/8495/metrics', 'GET', 404)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4596/step/8493/logs', 'GET', {
    redirect: 'https://somesite.com/log.txt'
})
const logResponse = new Readable()
logResponse.push('some log line\n')
logResponse.push('some other log line\n')
logResponse.push(null)
fetchMock.mock('https://somesite.com/log.txt', logResponse, { sendAsJson: false })
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4596/step/8493/logs?file=somethingspecial', 'GET', {
    redirect: 'https://somesite.com/special.txt'
})
const specialLogResponse = new Readable()
specialLogResponse.push('some special log line\n')
specialLogResponse.push('some other special log line\n')
specialLogResponse.push(null)
fetchMock.mock('https://somesite.com/special.txt', specialLogResponse, { sendAsJson: false })
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4597/step/8494/logs', 'GET', 404)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1001/phase/4598/step/8500/logs', 'GET', {})


let executionForPipeline7 = "1001"
const pipeline7Executions = {
    "1001": require(`./data/execution1001.json`),
    "1005": require('./data/execution1005.json'),
    "1006": require('./data/execution1006.json'),
    "1007": require('./data/execution1007.json'),
    "1008": require('./data/execution1008.json'),
    "1009": require('./data/execution1009.json'),
    "1010": require('./data/execution1010.json')
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
fetchMock.mock((url, opts) => url === 'https://cloudmanager.adobe.io/api/program/5/pipeline/7/execution/1007/phase/8567/step/15492/advance' &&
        opts.method === 'PUT' && opts.body === JSON.stringify({resume: false}),
    202, {
        name: 'cancel-1008'
    });

fetchMock.mock('https://cloudmanager.adobe.io/api/program/7', 404)
fetchMock.mock('https://cloudmanager.adobe.io/api/program/4/environment/10/variables', 404)
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/4/environment/11/variables', 'GET', {
    "_links": {
        "http://ns.adobe.com/adobecloud/rel/environment": {
            "href": "/api/program/4/environment/1",
            "templated": false
        },
        "http://ns.adobe.com/adobecloud/rel/program": {
            "href": "/api/program/4",
            "templated": false
        },
        "self": {
            "href": "/api/program/4/environment/3/variables",
            "templated": false
        }
    },
    "_embedded": {
        "variables": [
        ]
    },
    "_totalNumberOfItems": 0
})
mockResponseWithMethod('https://cloudmanager.adobe.io/api/program/4/environment/11/variables', 'PATCH', {
    status: 400,
    headers: {
        'content-type': 'application/problem+json'
    },
    body: {
        type: 'http://ns.adobe.com/adobecloud/validation-exception',
        errors: [
            'some error'
        ]
    }
})
