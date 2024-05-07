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
const { CLI } = require('@adobe/aio-lib-ims/src/context')
const { enableCliAuth, getCliOrgId } = require('../../cloudmanager-helpers')
const { isThisPlugin } = require('../../cloudmanager-hook-helpers')
const { defaultImsContextName: defaultContextName } = require('../../constants')
const { codes: configurationCodes } = require('../../ConfigurationErrors')

const requiredKeysForJWTIntegration = ['client_id', 'client_secret', 'technical_account_id', 'meta_scopes', 'ims_org_id', 'private_key']
const requiredKeysForOAuthIntegration = ['client_id', 'client_secrets', 'technical_account_email', 'technical_account_id', 'scopes', 'ims_org_id']
const requiredMetaScopeForJWTIntegration = 'ent_cloudmgr_sdk'
const requiredScopesForOAuthIntegration = ['openid', 'AdobeID', 'read_organizations', 'additional_info.projectedProductContext', 'read_pc.dma_aem_ams']

function getContextName (options) {
  if (options.Command.flags && options.Command.flags.imsContextName) {
    return options.Command.prototype.parse.call({ argv: options.argv }, options.Command).flags.imsContextName
  }
}

module.exports = function (hookOptions) {
  const checkContext = (contextName, isDefault, isCliConfigAvailable) => {
    const configKey = `ims.contexts.${contextName}`

    const config = Config.get(configKey)

    if (!config) {
      // in the future we might have a command that doesn't require configuration in which case this should change
      if (isDefault) {
        if (isCliConfigAvailable) {
          throw new configurationCodes.CLI_AUTH_NO_ORG({ messageValues: configKey })
        } else {
          throw new configurationCodes.NO_DEFAULT_IMS_CONTEXT({ messageValues: configKey })
        }
      } else {
        throw new configurationCodes.NO_IMS_CONTEXT({ messageValues: configKey })
      }
    }

    const missingKeys = []
    const requiredKeys = config.oauth_enabled ? requiredKeysForOAuthIntegration : requiredKeysForJWTIntegration

    requiredKeys.forEach(key => {
      if (!config[key]) {
        missingKeys.push(key)
      }
    })

    if (missingKeys.length > 0) {
      throw new configurationCodes.IMS_CONTEXT_MISSING_FIELDS({ messageValues: [configKey, missingKeys.join(', ')] })
    }

    if (config.oauth_enabled) {
      const oauthScopes = config.scopes
      if (!oauthScopes.includes || !requiredScopesForOAuthIntegration.every(scope => oauthScopes.includes(scope))) {
        throw new configurationCodes.IMS_CONTEXT_MISSING_OAUTH_SCOPES({ messageValues: [configKey, requiredScopesForOAuthIntegration.join(', ')] })
      }
    } else {
      const metaScopes = config.meta_scopes
      if (!metaScopes.includes || !metaScopes.includes(requiredMetaScopeForJWTIntegration)) {
        throw new configurationCodes.IMS_CONTEXT_MISSING_METASCOPE({ messageValues: [configKey, requiredMetaScopeForJWTIntegration] })
      }
    }
  }

  if (!isThisPlugin(hookOptions)) {
    return
  }
  const contextName = getContextName(hookOptions)

  if (contextName) {
    if (contextName === CLI) {
      const cliConfig = Config.get(`ims.contexts.${CLI}`)
      if (!cliConfig || !cliConfig.access_token) {
        throw new configurationCodes.CLI_AUTH_EXPLICIT_NO_AUTH()
      }
      const orgId = getCliOrgId()
      if (!orgId) {
        throw new configurationCodes.CLI_AUTH_EXPLICIT_NO_ORG()
      }
      enableCliAuth()
    } else {
      checkContext(contextName)
    }
  } else {
    const cliConfig = Config.get(`ims.contexts.${CLI}`)
    const orgId = getCliOrgId()
    const isCliConfigAvailable = cliConfig && cliConfig.access_token

    if (hookOptions.Command.skipOrgIdCheck) {
      if (isCliConfigAvailable) {
        enableCliAuth()
      } else {
        checkContext(defaultContextName, true, isCliConfigAvailable)
      }
    } else {
      if (isCliConfigAvailable && orgId) {
        enableCliAuth()
        return
      }

      checkContext(defaultContextName, true, isCliConfigAvailable)
    }
  }
}
