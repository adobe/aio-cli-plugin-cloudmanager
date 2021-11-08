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

const { ErrorWrapper, createUpdater } = require('@adobe/aio-lib-core-errors').AioCoreSDKErrorWrapper

const codes = {}
const messages = new Map()

/**
 * Create an Updater for the Error wrapper
 *
 * @ignore
 */
const Updater = createUpdater(
  // object that stores the error classes (to be exported)
  codes,
  // Map that stores the error strings (to be exported)
  messages,
)

/**
 * Provides a wrapper to easily create classes of a certain name, and values
 *
 * @ignore
 */
const E = ErrorWrapper(
  // The class name for your SDK Error. Your Error objects will be these objects
  'CloudManagerCLIConfigurationError',
  // The name of your SDK. This will be a property in your Error objects
  'CloudManagerCLI',
  // the object returned from the CreateUpdater call above
  Updater,
  // the base class that your Error class is extending. AioCoreSDKError is the default
  /* AioCoreSDKError, */
)

module.exports = {
  codes,
  messages,
}

// Define your error codes with the wrapper
E('CLI_ONLY_COMMAND', 'This command is only intended to be used with a user token, not a service account. The org id for a service account must be provided in the service account configuration.')
E('NO_CM_ORGS', 'No Cloud Manager authorized organizations found.')
E('NO_IMS_CONTEXT', 'Unable to find IMS context %s.')
E('CLI_AUTH_NO_ORG', 'The CLI has been authenticated, but no organization has been selected. To select an organization, run "aio cloudmanager:org:select". Alternatively, define the IMS context configuration %s with a service account.')
E('NO_DEFAULT_IMS_CONTEXT', 'There is no IMS context configuration defined for %s. Either define this context configuration or authenticate using "aio auth:login" and select an organization using "aio cloudmanager:org:select".')
E('IMS_CONTEXT_MISSING_FIELDS', 'One or more of the required fields in %s were not set. Missing keys were %s.')
E('IMS_CONTEXT_MISSING_METASCOPE', 'The configuration %s is missing the required metascope %s.')
E('CLI_AUTH_EXPLICIT_NO_AUTH', 'cli context explicitly enabled, but not authenticated. You must run "aio auth:login" first.')
E('CLI_AUTH_EXPLICIT_NO_ORG', 'cli context explicitly enabled but no org id specified. Configure using either "cloudmanager_orgid" or by running "aio cloudmanager:org:select"')
E('CLI_AUTH_CONTEXT_CANNOT_DECODE', 'The access token configured for cli authentication cannot be decoded.')
E('CLI_AUTH_CONTEXT_NO_CLIENT_ID', 'The decoded access token configured for cli authentication does not have a client_id.')
