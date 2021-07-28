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

const { Command, flags } = require('@oclif/command')
const { prompt } = require('inquirer')
const { isCliAuthEnabled, getCloudManagerAuthorizedOrganizations, setCliOrgId, getFullOrgIdentity } = require('../../../cloudmanager-helpers')

class OrgSelectCommand extends Command {
  async run () {
    if (!isCliAuthEnabled()) {
      this.error('This command is only intended to be used with a user token, not a service account. The org id for a service account must be provided in the service account configuration.')
    }

    const { args, flags } = this.parse(OrgSelectCommand)

    const local = !flags.global

    let { orgId } = args

    if (!orgId) {
      const organizations = await getCloudManagerAuthorizedOrganizations(flags.imsContextName)
      if (organizations.length === 0) {
        this.error('No Cloud Manager authorized organizations found.')
      }

      const answers = await prompt([
        {
          type: 'list',
          name: 'orgId',
          message: 'Select organization:',
          choices: organizations.map(org => {
            return {
              name: org.orgName,
              value: getFullOrgIdentity(org),
            }
          }),
        },
      ])

      orgId = answers.orgId
    }
    setCliOrgId(orgId, local)
    this.log(`orgId ${orgId} set in ${local ? 'local' : 'global'} configuration`)

    return orgId
  }
}

OrgSelectCommand.description = 'select an organization in which the current user is authorized to use Cloud Manager'

OrgSelectCommand.args = [
  { name: 'orgId', required: false, description: 'the org id to store in configuration' },
]

OrgSelectCommand.flags = {
  global: flags.boolean({ description: 'stores selected organization in global configuration' }),
}

OrgSelectCommand.skipOrgIdCheck = true

module.exports = OrgSelectCommand
