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
  'CloudManagerCLIValidationError',
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
E('INTERNAL_VARIABLE_USAGE', 'The variable name %s is reserved for internal usage and will be ignored.')
E('IP_ALLOWLIST_NOT_FOUND', 'Could not find IP Allowlist with id %s in program id %s.')
E('VARIABLES_JSON_PARSE_ERROR', 'Unable to parse variables from provided data.')
E('VARIABLES_JSON_NOT_ARRAY', 'Provided variables input was not an array.')
E('VARIABLES_YAML_PARSE_ERROR', 'Unable to parse variables from provided data.')
E('VARIABLES_YAML_NOT_ARRAY', 'Provided variables input was not an array.')
E('BOTH_BRANCH_AND_TAG_PROVIDED', 'Both branch and tag cannot be specified.')
E('MISSING_PROGRAM_ID', 'Program ID must be specified either as --programId flag or through cloudmanager_programid config value.')
E('MISSING_METRICS', 'Metrics for action %s on execution %s could not be found.')
E('INVALID_TAG_SYNTAX', 'tag flag should not be specified with "refs/tags/" prefix. Value provided was %s')
E('JSON_PARSE_NUMBER', 'parsed flag value as a number')
E('BLANK_VARIABLE_VALUE', 'Blank variable values are not allowed. Use the proper flag if you intend to delete a variable.')
E('MALFORMED_NAME_VALUE_PAIR', 'Please provide correct values for flags')
