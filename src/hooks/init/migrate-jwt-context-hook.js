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
const loggerNamespace = '@adobe/aio-cli-plugin-cloudmanager:migrate-jwt-context-hook'
const logger = require('@adobe/aio-lib-core-logging')(loggerNamespace, { level: process.env.LOG_LEVEL })
const { defaultContextName } = require('../../cloudmanager-helpers')

const oldConfigKey = 'jwt-auth'
const newConfigKey = `ims.contexts.${defaultContextName}`

function generateNewConfig (oldConfig) {
  const newConfigData = {
    client_id: oldConfig.client_id,
    client_secret: oldConfig.client_secret,
    technical_account_id: oldConfig.jwt_payload.sub,
    technical_account_email: 'unused',
    ims_org_id: oldConfig.jwt_payload.iss,
    private_key: oldConfig.jwt_private_key,
    meta_scopes: [],
  }
  Object.keys(oldConfig.jwt_payload)
    .filter(key => key.startsWith('https://ims-na1.adobelogin.com/s/') && typeof oldConfig.jwt_payload[key] === 'boolean' && oldConfig.jwt_payload[key])
    .forEach(key => newConfigData.meta_scopes.push(key.substring(33)))

  return newConfigData
}

// if necessary, migrate the old configuration from the local store. return true if the local config has the new config key or false otherwise.
function migrateLocal () {
  const oldConfig = Config.get(oldConfigKey, 'local')
  const newConfig = Config.get(newConfigKey, 'local')

  if (newConfig) {
    logger.debug('New IMS configuration detected in local. No need to migrate.')
    return true
  }

  if (oldConfig && !newConfig) {
    logger.debug(`Migrating local JWT configuration from '${oldConfigKey}' to '${newConfigKey}'.`)

    const newConfigData = generateNewConfig(oldConfig)

    Config.set(newConfigKey, newConfigData, true)
    logger.debug(`Your JWT configuration has been migrated. The original configuration has been left in place. If it is no longer needed, you may remove it using 'aio config:delete --local ${oldConfigKey}'`)
    return true
  }

  return false
}
function migrateGlobal () {
  const oldConfig = Config.get(oldConfigKey, 'global')
  const newConfig = Config.get(newConfigKey, 'global')

  if (newConfig) {
    logger.debug('New IMS configuration detected in global. No need to migrate.')
    return true
  }

  if (oldConfig && !newConfig) {
    logger.debug(`Migrating global JWT configuration from '${oldConfigKey}' to '${newConfigKey}'.`)

    const newConfigData = generateNewConfig(oldConfig)

    Config.set(newConfigKey, newConfigData, false)
    logger.debug(`Your JWT configuration has been migrated. The original configuration has been left in place. If it is no longer needed, you may remove it using 'aio config:delete --global ${oldConfigKey}'`)
    return true
  }

  return false
}

const migrate = async () => {
  logger.debug('start jwt-auth migration hook')
  if (!migrateLocal()) {
    migrateGlobal()
  }
  logger.debug('end jwt-auth migration hook')
}

module.exports = migrate
