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
const { context, getToken, Ims } = require('@adobe/aio-lib-ims')
const { getCliEnv, DEFAULT_ENV } = require('@adobe/aio-lib-env')
const moment = require('moment')
const _ = require('lodash')
const { CLI } = require('@adobe/aio-lib-ims/src/context')
const { defaultImsContextName: defaultContextName } = require('./constants')

const SERVICE_ACCOUNT = 'service_account'
const CLI_AUTH = 'cli_auth'

const CLI_API_KEYS = {
  prod: 'aio-cli-console-auth',
  stage: 'aio-cli-console-auth-stage',
}

const GROUP_DISPLAY_NAMES_TO_FRIENDLY_NAME_MAPPING = {
  CM_CS_DEPLOYMENT_MANAGER_ROLE_PROFILE: 'Deployment Manager',
  CM_DEPLOYMENT_MANAGER_ROLE_PROFILE: 'Deployment Manager',
  CM_CS_BUSINESS_OWNER_ROLE_PROFILE: 'Business Owner',
  CM_BUSINESS_OWNER_ROLE_PROFILE: 'Business Owner',
  CM_CS_DEVELOPER_ROLE_PROFILE: 'Developer',
  CM_DEVELOPER_ROLE_PROFILE: 'Developer',
  CM_CS_PROGRAM_MANAGER_ROLE_PROFILE: 'Program Manager',
  CM_PROGRAM_MANAGER_ROLE_PROFILE: 'Program Manager',
}

const GROUP_DISPLAY_NAMES = Object.keys(GROUP_DISPLAY_NAMES_TO_FRIENDLY_NAME_MAPPING)

let authMode = SERVICE_ACCOUNT

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
      get: item => {
        const value = (typeof key === 'function') ? key(item) : item[key]
        return value.map(mapperFunction).join(', ')
      },
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
    if (Object.values(tempObj).filter(v => v === '').length) {
      throw new Error('Blank variable values are not allowed. Use the proper flag if you intend to delete a variable.')
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

function getCliOrgId () {
  return Config.get('cloudmanager_orgid') || Config.get('console.org.code')
}

function setCliOrgId (orgId, local) {
  Config.set('cloudmanager_orgid', orgId, local)
}

async function initSdk (contextName) {
  let apiKey
  let orgId

  if (isCliAuthEnabled()) {
    const imsEnv = getCliEnv() || DEFAULT_ENV
    apiKey = CLI_API_KEYS[imsEnv]
    contextName = CLI
    orgId = getCliOrgId()
  } else {
    contextName = contextName || defaultContextName
    const contextData = await context.get(contextName)
    if (!contextData || !contextData.data) {
      throw new Error(`Unable to find IMS context ${contextName}`)
    }
    apiKey = contextData.data.client_id
    orgId = contextData.data.ims_org_id
  }

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

function enableCliAuth () {
  authMode = CLI_AUTH
}

function disableCliAuth () {
  authMode = undefined
}

function isCliAuthEnabled () {
  return authMode === CLI_AUTH
}

async function getAllOrganizations (contextName) {
  if (isCliAuthEnabled()) {
    contextName = CLI
  } else {
    contextName = contextName || defaultContextName
  }

  const accessToken = await getToken(contextName)

  const ims = await Ims.fromToken(accessToken)
  return ims.ims.getOrganizations(accessToken)
}

async function getCloudManagerAuthorizedOrganizations (contextName) {
  const allOrganizations = await getAllOrganizations(contextName)
  return allOrganizations.filter(org => org.groups && org.groups.map(group => group.groupDisplayName).some(isCloudManagerGroupDisplayName))
}

function isCloudManagerGroupDisplayName (groupDisplayName) {
  return GROUP_DISPLAY_NAMES.includes(groupDisplayName)
}

function getCloudManagerRoles (org) {
  if (!org.groups) {
    return []
  }
  const roles = org.groups.map(group => group.groupDisplayName).filter(isCloudManagerGroupDisplayName).map(groupDisplayName => GROUP_DISPLAY_NAMES_TO_FRIENDLY_NAME_MAPPING[groupDisplayName])
  return _.uniq(roles)
}

async function getActiveOrganizationId (contextName) {
  if (isCliAuthEnabled()) {
    return getCliOrgId()
  } else {
    contextName = contextName || defaultContextName
    const contextData = await context.get(contextName)
    if (!contextData || !contextData.data) {
      throw new Error(`Unable to find IMS context ${contextName}`)
    }
    return contextData.data.ims_org_id
  }
}

module.exports = {
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
  enableCliAuth,
  disableCliAuth,
  isCliAuthEnabled,
  getCliOrgId,
  setCliOrgId,
  getCloudManagerAuthorizedOrganizations,
  getCloudManagerRoles,
  getActiveOrganizationId,
}
