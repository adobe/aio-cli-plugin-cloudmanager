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

const execa = require('execa')
const chalk = require('chalk')
const { stdout } = require('stdout-stderr')

stdout.print = true 

test('plugin-cloudmanager help test', async () => {

  const name = 'aio-cli-plugin-console'
  console.log(chalk.blue(`> e2e tests for ${chalk.bold(name)}`))

  console.log(chalk.dim(`    - plugin-cloudmanager help ..`))
  execa.sync('./bin/run', ['--help'], { stderr: 'inherit' })

  console.log(chalk.green(`    - done for ${chalk.bold(name)}`))
});
