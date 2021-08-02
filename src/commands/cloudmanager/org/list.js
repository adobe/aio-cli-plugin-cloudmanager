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

const { cli } = require('cli-ux')
const figures = require('figures')
const BaseCommand = require('../../../base-command')
const { getCloudManagerAuthorizedOrganizations, getOutputFormat, columnWithArray, getCloudManagerRoles, getActiveOrganizationId } = require('../../../cloudmanager-helpers')
const commonFlags = require('../../../common-flags')

class OrgListCommand extends BaseCommand {
  async run () {
    const { flags } = this.parse(OrgListCommand)

    const organizations = await getCloudManagerAuthorizedOrganizations(flags.imsContextName)
    const activeOrgId = await getActiveOrganizationId(flags.imsContextName)

    const getOrgId = (org) => `${org.orgRef.ident}@${org.orgRef.authSrc}`

    cli.table(organizations, {
      orgId: {
        header: 'Org Id',
        get: getOrgId,
      },
      orgName: {
        header: 'Org Name',
      },
      roles: columnWithArray(getCloudManagerRoles, {}, flags),
      active: {
        get: (org) => {
          const orgId = getOrgId(org)
          return orgId === activeOrgId ? figures.tick : ''
        },
      },
    }, {
      printLine: this.log,
      output: getOutputFormat(flags),
    })

    return organizations
  }
}

OrgListCommand.description = 'list the organizations in which the current user is authorized to use Cloud Manager'

OrgListCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
}
OrgListCommand.skipOrgIdCheck = true

module.exports = OrgListCommand
