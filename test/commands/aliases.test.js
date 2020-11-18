/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const path = require('path')
const Config = require('@oclif/config')

function loadCommandNames (manifest) {
  const commandNames = []
  Object.keys(manifest.commands).forEach(cmd => {
    commandNames.push(cmd)
    Array.prototype.push.apply(commandNames, manifest.commands[cmd].aliases)
  })
  return commandNames
}

test('all commands from 0.15.0 have aliases', async () => {
  const oldCommandNames = loadCommandNames(require('../data/oclif.manifest.0.15.0.json')).filter(name => name !== 'cloudmanager')

  const root = path.resolve('.')
  const thisPlugin = new Config.Plugin({ root, type: 'core', ignoreManifest: true, errorOnManifestCreate: true })
  await thisPlugin.load()

  const newCommandNames = loadCommandNames(thisPlugin.manifest)

  oldCommandNames.forEach(oldCmd => {
    expect(newCommandNames).toContain(oldCmd)
  })
})
