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

const { Command } = require('@oclif/command')
const { cli } = require('cli-ux')
const { flags } = require('@oclif/command')
const { getProgramId, createKeyValueObjectFromFlag } = require('./cloudmanager-helpers')
const commonFlags = require('./common-flags')

class BaseVariablesCommand extends Command {
  outputTable (result, flags) {
    cli.table(result, {
      name: {},
      type: {},
      value: {
        get: (item) => item.type === 'secretString' ? '****' : item.value
      }
    }, {
      output: await getOutputFormat(flags)
    })
  }

  async runSet (args, flags) {
    const programId = await getProgramId(flags)

    const currentVariablesList = await this.getVariables(programId, args, flags.passphrase)

    const variables = this.prepareVariableList(flags, currentVariablesList)

    if (variables.length > 0) {
      cli.action.start('setting variables')
      await this.setVariables(programId, args, variables, flags.passphrase)
      cli.action.stop()
    } else {
      this.log('No variables to set or delete.')
    }

    let result

    try {
      result = await this.getVariables(programId, args, flags.passphrase)
    } catch (error) {
      this.error(error.message)
    }
    this.outputTable(result, flags)

    return result
  }

  prepareVariableList (flags, currentVariablesList) {
    const currentVariableTypes = {}
    currentVariablesList.forEach(variable => (currentVariableTypes[variable.name] = variable.type))

    const variables = []
    if (flags.variable) {
      // each --param flag expects two values ( a key and a value ). Multiple --parm flags can be passed
      // For example : aio runtime:action:create --param name "foo" --param city "bar"
      const parsedVariables = createKeyValueObjectFromFlag(flags.variable)
      for (const key in parsedVariables) {
        variables.push({
          name: key,
          value: parsedVariables[key],
          type: 'string'
        })
      }
    }
    if (flags.secret) {
      const parsedSecrets = createKeyValueObjectFromFlag(flags.secret)
      for (const key in parsedSecrets) {
        variables.push({
          name: key,
          value: parsedSecrets[key],
          type: 'secretString'
        })
      }
    }
    if (flags.delete) {
      flags.delete.forEach(key => {
        if (currentVariableTypes[key]) {
          variables.push({
            name: key,
            type: currentVariableTypes[key],
            value: ''
          })
        } else {
          this.warn(`Variable ${key} not found. Will not try to delete.`)
        }
      })
    }

    return variables
  }
}

BaseVariablesCommand.setterFlags = {
  variable: flags.string({
    char: 'v',
    description: 'variable values in KEY VALUE format',
    multiple: true
  }),
  secret: flags.string({
    char: 's',
    description: 'secret values in KEY VALUE format',
    multiple: true
  }),
  delete: flags.string({
    char: 'd',
    description: 'variables/secrets to delete',
    multiple: true
  }),
  ...commonFlags.outputFormat
}

BaseVariablesCommand.getterFlags = {
  ...commonFlags.outputFormat
}

module.exports = BaseVariablesCommand
