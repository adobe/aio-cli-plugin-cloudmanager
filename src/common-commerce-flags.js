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
const { getDefaultEnvironmentId } = require('./cloudmanager-helpers')

module.exports = {
  environmentId: {
    environmentId: flags.string({ char: 'e', description: 'the environment id', required: true, default: getDefaultEnvironmentId(), common: true }),
  },
  quiet: {
    quiet: flags.boolean({ char: 'q', description: 'do not output any message' }),
  },
  verbose: {
    verbose: flags.boolean({ char: 'v', description: 'increase the verbosity of messages for debugging' }),
  },
  version: {
    version: flags.boolean({ char: 'V', description: 'displays this applications version' }),
  },
  ansi: {
    ansi: flags.boolean({ allowNo: true, description: 'force/disable ANSI output' }),
  },
}
