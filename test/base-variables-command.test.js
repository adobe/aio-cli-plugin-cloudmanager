/*
Copyright 2022 Adobe. All rights reserved.
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
const path = require('path')
const BaseVariablesCommand = require('../src/base-variables-command')

test('multiline json', async () => {
  const getFileData = promisify(fs.readFile)
  const rawFileData = await getFileData(path.join(__dirname, 'data', 'variables.json'))

  const variables = []
  BaseVariablesCommand.loadVariablesFromJson(rawFileData, {}, variables)

  expect(variables).toHaveLength(1)
  expect(variables[0].value.split('\n')).toHaveLength(3)
})

test('multiline yaml', async () => {
  const getFileData = promisify(fs.readFile)
  const rawFileData = await getFileData(path.join(__dirname, 'data', 'variables.yaml'))

  const variables = []
  BaseVariablesCommand.loadVariablesFromYaml(rawFileData, {}, variables)

  expect(variables).toHaveLength(1)
  expect(variables[0].value.split('\n')).toHaveLength(3)
})
