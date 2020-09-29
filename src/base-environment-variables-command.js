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

const { accessToken: getAccessToken } = require('@adobe/aio-cli-plugin-jwt-auth')
const { getApiKey, getBaseUrl, getOrgId, sanitizeEnvironmentId } = require('./cloudmanager-helpers')
const BaseVariablesCommand = require('./base-variables-command')
const { init } = require('@adobe/aio-lib-cloudmanager')

async function _getEnvironmentVariables (programId, environmentId, passphrase) {
  const apiKey = await getApiKey()
  const accessToken = await getAccessToken(passphrase)
  const orgId = await getOrgId()
  const baseUrl = await getBaseUrl()
  const sdk = await init(orgId, apiKey, accessToken, baseUrl)
  return sdk.getEnvironmentVariables(programId, environmentId)
}

class BaseEnvironmentVariablesCommand extends BaseVariablesCommand {
  async getVariables (programId, args, passphrase = null) {
    const environmentId = sanitizeEnvironmentId(args.environmentId)
    return _getEnvironmentVariables(programId, environmentId, passphrase)
  }
}

module.exports = BaseEnvironmentVariablesCommand
