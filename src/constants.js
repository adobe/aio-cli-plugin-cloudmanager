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

module.exports = {
    basePath: '/api/programs',
    rels: {
        self: 'self',
        pipelines: 'http://ns.adobe.com/adobecloud/rel/pipelines',
        execution: 'http://ns.adobe.com/adobecloud/rel/execution',
        metrics: 'http://ns.adobe.com/adobecloud/rel/pipeline/metrics',
        cancel: 'http://ns.adobe.com/adobecloud/rel/pipeline/cancel',
        advance: 'http://ns.adobe.com/adobecloud/rel/pipeline/advance',
        executionId: 'http://ns.adobe.com/adobecloud/rel/execution/id',
        environments: 'http://ns.adobe.com/adobecloud/rel/environments',
        logs: 'http://ns.adobe.com/adobecloud/rel/pipeline/logs'
    },
    config: {
        programId: 'cloudmanager_programid'
    }
}
