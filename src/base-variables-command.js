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

const { promisify } = require('util')
const fs = require('fs')

const BaseCommand = require('./base-command')
const { cli } = require('cli-ux')
const yaml = require('js-yaml')
const { flags } = require('@oclif/command')
const { getProgramId, createKeyValueObjectFromFlag, getOutputFormat } = require('./cloudmanager-helpers')
const commonFlags = require('./common-flags')
const { getPipedData } = require('@adobe/aio-lib-core-config')
const _ = require('lodash')
const { codes: validationCodes } = require('./ValidationErrors')

class BaseVariablesCommand extends BaseCommand {
  getFlagDefs (services) {
    const coreFlagDefs = {
      variable: {
        type: 'string',
      },
      secret: {
        type: 'secretString',
      },
      delete: {
        action: 'delete',
      },
    }

    const result = {
      ...coreFlagDefs,
    }

    services.forEach(service => {
      Object.keys(coreFlagDefs).forEach(coreFlagKey => {
        const flagName = _.camelCase(`${service} ${coreFlagKey}`)
        result[flagName] = {
          ...coreFlagDefs[coreFlagKey],
          service,
        }
      })
    })
    return result
  }

  outputTable (result, flags, extraColumns = {}) {
    cli.table(result, {
      name: {},
      type: {},
      value: {
        get: (item) => item.type === 'secretString' ? '****' : item.value,
      },
      ...extraColumns,
    }, {
      output: getOutputFormat(flags),
    })
  }

  async runSet (args, flags) {
    const programId = getProgramId(flags)

    const currentVariablesList = await this.getVariables(programId, args, flags.imsContextName)

    const variables = await this.prepareVariableList(flags, currentVariablesList)

    this.validateVariables(flags, variables)

    if (variables.length > 0) {
      cli.action.start('setting variables')
      await this.setVariables(programId, args, variables, flags.imsContextName)
      cli.action.stop()
    } else {
      this.log('No variables to set or delete.')
    }

    const result = await this.getVariables(programId, args, flags.imsContextName)

    this.outputTable(result, flags)

    return result
  }

  async prepareVariableList (flags, currentVariablesList) {
    const currentVariableTypes = {}
    currentVariablesList.forEach(variable => {
      const tempName = variable.service ? `${variable.service}:${variable.name}` : variable.name
      currentVariableTypes[tempName] = variable.type
    })

    const variables = []

    const flagDefs = this.getFlagDefs()

    Object.keys(flagDefs).forEach(flagName => {
      const flagDef = flagDefs[flagName]
      if (!flags[flagName]) {
        return
      }
      switch (flagDef.action) {
        case 'delete':
          flags[flagName].forEach(key => {
            const currentVariableKey = flagDef.service ? `${flagDef.service}:${key}` : key
            if (currentVariableTypes[currentVariableKey]) {
              const newVar = {
                name: key,
                type: currentVariableTypes[currentVariableKey],
                value: '',
              }
              if (flagDef.service) {
                newVar.service = flagDef.service
              }
              variables.push(newVar)
            } else {
              this.warn(`Variable ${key} not found. Will not try to delete.`)
            }
          })
          break
        default: {
          const parsedFlag = createKeyValueObjectFromFlag(flags[flagName])
          for (const key in parsedFlag) {
            const newVar = {
              name: key,
              value: parsedFlag[key],
              type: flagDef.type,
            }
            if (flagDef.service) {
              newVar.service = flagDef.service
            }
            variables.push(newVar)
          }
        }
      }
    })

    const getFileData = promisify(fs.readFile)

    if (flags.jsonStdin) {
      const rawStdinData = await getPipedData()
      BaseVariablesCommand.loadVariablesFromJson(rawStdinData, currentVariableTypes, variables)
    } else if (flags.jsonFile) {
      const rawFileData = await getFileData(flags.jsonFile)
      BaseVariablesCommand.loadVariablesFromJson(rawFileData, currentVariableTypes, variables)
    } else if (flags.yamlStdin) {
      const rawStdinData = await getPipedData()
      BaseVariablesCommand.loadVariablesFromYaml(rawStdinData, currentVariableTypes, variables)
    } else if (flags.yamlFile) {
      const rawFileData = await getFileData(flags.yamlFile)
      BaseVariablesCommand.loadVariablesFromYaml(rawFileData, currentVariableTypes, variables)
    }

    return variables
  }

  validateVariables (flags, variables) { }
}

BaseVariablesCommand.coreSetterFlags = {
  variable: flags.string({
    char: 'v',
    description: 'variable values in KEY VALUE format',
    multiple: true,
  }),
  secret: flags.string({
    char: 's',
    description: 'secret values in KEY VALUE format',
    multiple: true,
  }),
  delete: flags.string({
    char: 'd',
    description: 'variables/secrets to delete',
    multiple: true,
  }),
}

BaseVariablesCommand.setterFlags = (services) => {
  return {
    ...BaseVariablesCommand.coreSetterFlags,
    jsonStdin: flags.boolean({
      default: false,
      description: 'if set, read variables from a JSON array provided as standard input; variables set through --variable or --secret flag will take precedence',
      exclusive: ['jsonFile', 'yamlStdin', 'yamlFile'],
    }),
    jsonFile: flags.string({
      description: 'if set, read variables from a JSON array provided as a file; variables set through --variable or --secret flag will take precedence',
      exclusive: ['jsonStdin', 'yamlStdin', 'yamlFile'],
    }),
    yamlStdin: flags.boolean({
      default: false,
      description: 'if set, read variables from a YAML array provided as standard input; variables set through --variable or --secret flag will take precedence',
      exclusive: ['jsonStdin', 'jsonFile', 'yamlFile'],
    }),
    yamlFile: flags.string({
      description: 'if set, read variables from a YAML array provided as a file; variables set through --variable or --secret flag will take precedence',
      exclusive: ['jsonStdin', 'jsonFile', 'yamlStdin'],
    }),
    ...commonFlags.outputFormat,
    ...BaseVariablesCommand.serviceSetterFlags(services),
  }
}

BaseVariablesCommand.getterFlags = {
  ...commonFlags.outputFormat,
}

const loadVariableData = (array, currentVariableTypes, variables) => {
  array.forEach(item => {
    if (item.name && !_.isUndefined(item.value)) {
      if (!item.type) {
        item.type = 'string'
      }
      const currentVariableKey = item.service ? `${item.service}:${item.name}` : item.name
      if (currentVariableTypes[currentVariableKey] && !item.value) {
        item.type = currentVariableTypes[currentVariableKey]
      }
      if (!variables.find(variable => variable.name === item.name && variables.services === item.service)) {
        variables.push(item)
      }
    }
  })
}

BaseVariablesCommand.loadVariablesFromJson = (rawData, currentVariableTypes, variables) => {
  let data
  try {
    data = JSON.parse(rawData)
  } catch (e) {
    throw new validationCodes.VARIABLES_JSON_PARSE_ERROR()
  }
  if (!_.isArray(data)) {
    throw new validationCodes.VARIABLES_JSON_NOT_ARRAY()
  }
  loadVariableData(data, currentVariableTypes, variables)
}

BaseVariablesCommand.loadVariablesFromYaml = (rawData, currentVariableTypes, variables) => {
  let data
  try {
    data = yaml.load(rawData)
  } catch (e) {
    throw new validationCodes.VARIABLES_YAML_PARSE_ERROR()
  }
  if (!_.isArray(data)) {
    throw new validationCodes.VARIABLES_YAML_NOT_ARRAY()
  }
  loadVariableData(data, currentVariableTypes, variables)
}

BaseVariablesCommand.serviceSetterFlags = (services) => {
  const serviceFlags = {}
  services.forEach(service => {
    Object.keys(BaseVariablesCommand.coreSetterFlags).forEach(coreFlagKey => {
      const coreFlag = BaseVariablesCommand.coreSetterFlags[coreFlagKey]
      const flagName = _.camelCase(`${service} ${coreFlagKey}`)
      serviceFlags[flagName] = flags.string({
        description: `${coreFlag.description} for ${service} service`,
        multiple: true,
      })
    })
  })

  return serviceFlags
}

module.exports = BaseVariablesCommand
