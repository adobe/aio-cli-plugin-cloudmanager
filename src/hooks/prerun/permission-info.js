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

const { isThisPlugin, isPermissionsRequest } = require('../../cloudmanager-hook-helpers')

module.exports = function (hookOptions) {
  if (!isThisPlugin(hookOptions)) {
    return
  }

  if (isPermissionsRequest(hookOptions)) {
    const permissionInfo = hookOptions.Command.permissionInfo
    if (!permissionInfo) {
      this.warn(`No permission information available for ${hookOptions.Command.id}.`)
    } else if (!permissionInfo.operation) {
      this.log(`${hookOptions.Command.id} does not require any specific permissions.`)
    } else if (!hookOptions.config.permissionData) {
      this.warn(`Permission data not loaded. Unable to identify permissions for ${hookOptions.Command.id}.`)
    } else {
      const data = hookOptions.config.permissionData
      const operation = permissionInfo.operation
      const info = data.find(item => item.operation === operation)
      if (!info) {
        this.warn(`Unknown operation ${operation} for ${hookOptions.Command.id}. Cannot list permissions required.`)
      } else {
        this.log(`To execute ${hookOptions.Command.id}, one of the following product profiles is required: ${info.profiles}.`)
      }
    }
    this.exit()
  }
}
