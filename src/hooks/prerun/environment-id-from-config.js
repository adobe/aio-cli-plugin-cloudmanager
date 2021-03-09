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

const { getDefaultEnvironmentId } = require('../../cloudmanager-helpers')
const { isThisPlugin } = require('../../cloudmanager-hook-helpers')

const { RequiredArgsError } = require('@oclif/parser/lib/errors')

function hasEnvironmentIdAsFirstArg (options) {
  return options.Command.args && options.Command.args[0].name === 'environmentId'
}

module.exports = async function (hookOptions) {
  if (!isThisPlugin(hookOptions)) {
    return
  }

  if (hasEnvironmentIdAsFirstArg(hookOptions)) {
    const environmentId = await getDefaultEnvironmentId()
    if (environmentId) {
      const originalParse = hookOptions.Command.prototype.parse
      hookOptions.Command.prototype.parse = function (options) {
        try {
          return originalParse.call(this, options)
        } catch (e) {
          if (e instanceof RequiredArgsError && e.args && e.args.length === 1 && e.args[0].name === 'environmentId') {
            return originalParse.call(this, options, [environmentId, ...hookOptions.argv])
          } else {
            throw e
          }
        }
      }
    }
  }
}
