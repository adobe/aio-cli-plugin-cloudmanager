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
const { flags } = require('@oclif/command')

module.exports = {
  global: {
    imsContextName: flags.string({ description: 'the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager', common: true }),
  },
  programId: {
    programId: flags.string({ char: 'p', description: "the programId. if not specified, defaults to 'cloudmanager_programid' config value", common: true }),
  },
  outputFormat: {
    json: flags.boolean({ char: 'j', description: 'output in json format', exclusive: ['yaml'], common: true }),
    yaml: flags.boolean({ char: 'y', description: 'output in yaml format', common: true }),
  },
}
