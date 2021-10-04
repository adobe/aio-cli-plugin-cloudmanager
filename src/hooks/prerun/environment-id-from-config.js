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

function hasEnvironmentIdAsFirstArg (options) {
  return options.Command.args && options.Command.args[0].name === 'environmentId'
}

function isValidEnvId (value) {
  try {
    const appearsValid = Number.isInteger(Number(value))
    return appearsValid
  } catch {
    return false
  }
} 

module.exports = function (hookOptions) {
  if (!isThisPlugin(hookOptions)) {
    return
  }

  if (hasEnvironmentIdAsFirstArg(hookOptions)) {
    const defaultEnvironmentId = getDefaultEnvironmentId()

    if(!isValidEnvId(hookOptions.argv[0])) {
      if(defaultEnvironmentId) {
        hookOptions.argv.unshift(defaultEnvironmentId)
      }
    } 
  }
}
