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

const { initSdk, sanitizeEnvironmentId } = require('./cloudmanager-helpers')
const BaseVariablesCommand = require('./base-variables-command')

class BaseEnvironmentVariablesCommand extends BaseVariablesCommand {
  outputTable (result, flags) {
    super.outputTable(result, flags, {
      service: {
        get: (item) => item.service || '',
      },
      status: {
        get: (item) => item.status || '',
      }
    })
  }

  async getVariables (programId, args, imsContextName = null) {
    const environmentId = sanitizeEnvironmentId(args.environmentId)
    const sdk = await initSdk(imsContextName)
    return sdk.getEnvironmentVariables(programId, environmentId)
  }
}

module.exports = BaseEnvironmentVariablesCommand
