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

/* eslint-disable no-console */

const Config = require('@adobe/aio-cli-plugin-config')
const chalk = require('chalk') // included in jest install

module.exports = async () => {
  const configObject = await Config.get()
  if (JSON.stringify(configObject) !== '{}') {
    console.log(chalk.red('[globalTeardown] !!!ERROR!!! The config file was changed during the tests.'))
    console.log(chalk.gray(`[globalTeardown] The new config file contents are: ${JSON.stringify(configObject)}`))
  }
}
