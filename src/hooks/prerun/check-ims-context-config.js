/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const Config = require('@adobe/aio-lib-core-config')
const { defaultContextName } = require('../../cloudmanager-helpers')
const { isThisPlugin } = require('../../cloudmanager-hook-helpers')

const requiredKeys = ['client_id', 'client_secret', 'technical_account_id', 'meta_scopes', 'ims_org_id', 'private_key']

const requiredMetaScope = 'ent_cloudmgr_sdk'

function getContextName (options) {
  if (options.Command.flags && options.Command.flags.imsContextName) {
    return options.Command.prototype.parse.call(this, options.Command, options.argv).flags.imsContextName
  }
}

module.exports = function (hookOptions) {
  if (!isThisPlugin(hookOptions)) {
    return
  }
  const contextName = getContextName(hookOptions) || defaultContextName

  const configKey = `ims.contexts.${contextName}`

  const config = Config.get(configKey)

  if (!config) {
    // in the future we might have a command that doesn't require configuration in which case this should change
    this.error(`There is no IMS context configuration defined for ${configKey}.`)
  }

  const missingKeys = []

  requiredKeys.forEach(key => {
    if (!config[key]) {
      missingKeys.push(key)
    }
  })

  if (missingKeys.length > 0) {
    this.error(`One or more of the required fields in ${configKey} were not set. Missing keys were ${missingKeys.join(', ')}.`)
  }

  const metaScopes = config.meta_scopes
  if (!metaScopes.includes || !metaScopes.includes(requiredMetaScope)) {
    this.error(`The configuration ${configKey} is missing the required metascope ${requiredMetaScope}.`)
  }
}
