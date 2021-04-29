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

const { Command } = require('@oclif/command')
const { cli } = require('cli-ux')
const { flags } = require('@oclif/command')
const { getProgramId, createKeyValueObjectFromFlag, getOutputFormat } = require('./cloudmanager-helpers')
const commonFlags = require('./common-flags')
const { getPipedData } = require('@adobe/aio-lib-core-config')
const _ = require('lodash')

class BaseVariablesCommand extends Command {
  getFlagDefs () {
    return {
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

    if (variables.length > 0) {
      cli.action.start('setting variables')
      await this.setVariables(programId, args, variables, flags.imsContextName)
      cli.action.stop()
    } else {
      this.log('No variables to set or delete.')
    }

    let result

    try {
      result = await this.getVariables(programId, args, flags.imsContextName)
    } catch (error) {
      this.error(error.message)
    }
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

    if (flags.jsonStdin) {
      const rawStdinData = await getPipedData()
      this.loadVariablesFromJson(rawStdinData, currentVariableTypes, variables)
    } else if (flags.jsonFile) {
      const getFileData = promisify(fs.readFile)
      const rawFileData = await getFileData(flags.jsonFile)
      this.loadVariablesFromJson(rawFileData, currentVariableTypes, variables)
    }

    return variables
  }

  loadVariablesFromJson (rawData, currentVariableTypes, variables) {
    let data
    try {
      data = JSON.parse(rawData)
    } catch (e) {
      this.error('Unable to parse variables from provided data.')
    }
    if (!_.isArray(data)) {
      this.error('Provided variables input was not an array.')
    }
    data.forEach(item => {
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

BaseVariablesCommand.setterFlags = {
  ...BaseVariablesCommand.coreSetterFlags,
  jsonStdin: flags.boolean({
    default: false,
    description: 'if set, read variables from a JSON array provided as standard input; variables set through --variable or --secret flag will take precedence',
  }),
  jsonFile: flags.string({
    description: 'if set, read variables from a JSON array provided as a file; variables set through --variable or --secret flag will take precedence',
    exclusive: ['jsonStdin'],
  }),
  ...commonFlags.outputFormat,
}

BaseVariablesCommand.getterFlags = {
  ...commonFlags.outputFormat,
}

module.exports = BaseVariablesCommand
