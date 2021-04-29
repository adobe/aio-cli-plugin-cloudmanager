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
const { init } = require('@adobe/aio-lib-cloudmanager')
const { context, getToken } = require('@adobe/aio-lib-ims')
const moment = require('moment')
const _ = require('lodash')

const defaultContextName = 'aio-cli-plugin-cloudmanager'

function toJson (item) {
  let c = item
  if (typeof c === 'string') {
    c = JSON.parse(c)
  }

  return c
}

function getBaseUrl () {
  const configStr = Config.get('cloudmanager')

  return (configStr && toJson(configStr).base_url) || 'https://cloudmanager.adobe.io'
}

function getProgramId (flags) {
  const programId = flags.programId || Config.get('cloudmanager_programid')
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

/*
 * This doesn't work quite correctly -- when output in both JSON and YAML, the result is a JSON-encoded array in a string whereas one
 * would expect a JSON or YAML. This seems like a bug in oclif that will hopefully get addressed.
 */
function columnWithArray (key, options, flags) {
  const mapperFunction = options.mapperFunction || (i => i)
  if (flags.json || flags.yaml) {
    return options
  } else {
    return {
      ...options,
      get: item => item[key].map(mapperFunction).join(', '),
    }
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
        if (typeof tempObj[flag[i]] === 'number') {
          throw new Error('parsed flag value as a number')
        }
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

function getDefaultEnvironmentId (flags) {
  return Config.get('cloudmanager_environmentid')
}

async function initSdk (contextName) {
  contextName = contextName || defaultContextName
  const contextData = await context.get(contextName)
  if (!contextData || !contextData.data) {
    throw new Error(`Unable to find IMS context ${contextName}`)
  }

  const apiKey = contextData.data.client_id
  const orgId = contextData.data.ims_org_id

  const accessToken = await getToken(contextName)

  const baseUrl = getBaseUrl()
  return await init(orgId, apiKey, accessToken, baseUrl)
}

function formatAction (stepState) {
  if (stepState.action === 'deploy') {
    return `${_.startCase(stepState.environmentType)} ${_.startCase(stepState.action)}`
  } else if (stepState.action === 'contentAudit') {
    return 'Experience Audit'
  } else {
    return _.startCase(stepState.action)
  }
}

function formatTime (property) {
  return (object) => object[property] ? moment(object[property]).format('LLL') : ''
}

function formatDuration (object) {
  return object.startedAt && object.finishedAt
    ? moment.duration(moment(object.finishedAt).diff(object.startedAt)).humanize()
    : ''
}

function formatStatus (object) {
  return _.startCase(object.status.toLowerCase())
}

module.exports = {
  defaultContextName,
  getProgramId,
  getOutputFormat,
  createKeyValueObjectFromFlag,
  sanitizeEnvironmentId,
  getDefaultEnvironmentId,
  columnWithArray,
  initSdk,
  formatAction,
  formatTime,
  formatDuration,
  formatStatus,
}
