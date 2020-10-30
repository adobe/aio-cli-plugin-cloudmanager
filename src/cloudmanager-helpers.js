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

const Config = require('@adobe/aio-lib-core-config')

function toJson (item) {
  let c = item
  if (typeof c === 'string') {
    c = JSON.parse(c)
  }

  return c
}

async function getOrgId () {
  const configData = await getJwtAuth()
  if (!configData.jwt_payload || !configData.jwt_payload.iss) {
    throw new Error('missing config data: jwt-auth.jwt_payload.iss')
  }
  return configData.jwt_payload.iss
}

async function getJwtAuth () {
  const configStr = await Config.get('jwt-auth')
  if (!configStr) {
    return Promise.reject(new Error('missing config data: jwt-auth'))
  }

  const configData = toJson(configStr)

  return configData
}

async function getApiKey () {
  const configData = await getJwtAuth()
  if (!configData.client_id) {
    throw new Error('missing config data: jwt-auth.client_id')
  }
  return configData.client_id
}

async function getBaseUrl () {
  const configStr = await Config.get('cloudmanager')

  return (configStr && toJson(configStr).base_url) || 'https://cloudmanager.adobe.io'
}

async function getProgramId (flags) {
  const programId = flags.programId || await Config.get('cloudmanager_programid')
  if (!programId) {
    throw new Error('Program ID must be specified either as --programId flag or through cloudmanager_programid config value')
  }
  return programId
}

function getOutputFormat (flags) {
  if (flags.json) {
    return 'json'
  }
  if (flags.yaml) {
    return 'yaml'
  }
}

function createKeyValueObjectFromFlag (flag) {
  if (flag.length % 2 === 0) {
    let i
    const tempObj = {}
    for (i = 0; i < flag.length; i += 2) {
      try {
        // assume it is JSON, there is only 1 way to find out
        tempObj[flag[i]] = JSON.parse(flag[i + 1])
      } catch (ex) {
        // hmm ... not json, treat as string
        tempObj[flag[i]] = flag[i + 1]
      }
    }
    return tempObj
  } else {
    throw (new Error('Please provide correct values for flags'))
  }
}

function sanitizeEnvironmentId (environmentId) {
  let envId = environmentId
  if (envId && envId.startsWith('e')) {
    envId = envId.substring(1)
  }
  return envId
}

module.exports = {
  getBaseUrl,
  getApiKey,
  getOrgId,
  getProgramId,
  getOutputFormat,
  createKeyValueObjectFromFlag,
  sanitizeEnvironmentId
}
