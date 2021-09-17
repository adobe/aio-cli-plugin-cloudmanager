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

const availableOperations = require('../permissions.json').map(perm => perm.operation)

module.exports = {
  create: function (context) {
    return {
      Program: (node) => {
        const classDeclarations = node.body.filter(bodyNode => bodyNode.type === 'ClassDeclaration')
        if (classDeclarations.length === 0) {
          context.report({
            node: node,
            message: "Command file didn't contain command",
          })
        }
        classDeclarations.forEach(classDeclaration => {
          const className = classDeclaration.id.name
          const propertiesAssignedToClass = node.body.map(bodyNode => {
            if (bodyNode.type === 'ExpressionStatement' && bodyNode.expression.type === 'AssignmentExpression' &&
              bodyNode.expression.left.type === 'MemberExpression' && bodyNode.expression.left.object && bodyNode.expression.left.object.name === className &&
              bodyNode.expression.left.property) {
              return {
                name: bodyNode.expression.left.property.name,
                node: bodyNode.expression.right,
              }
            }
            return {}
          }).filter(property => property.name)

          // if skipOrgIdCheck is defined, we don't need permissions
          if (!propertiesAssignedToClass.find(prop => prop.name === 'skipOrgIdCheck')) {
            const permissionInfo = propertiesAssignedToClass.find(prop => prop.name === 'permissionInfo')
            if (!permissionInfo) {
              context.report({
                node: classDeclaration,
                message: 'Class {{ className }} does not define permissionInfo.',
                data: {
                  className,
                },
              })
            } else if (permissionInfo.node.type !== 'ObjectExpression') {
              context.report({
                node: permissionInfo.node,
                message: 'Class {{ className }} has permissionInfo but it is not an object.',
                data: {
                  className,
                },
              })
            } else {
              const operation = permissionInfo.node.properties.find(prop => prop.key.name === 'operation')
              if (operation && operation.value) {
                if (operation.value.type !== 'Literal') {
                  context.report({
                    node: permissionInfo.node,
                    message: 'Class {{ className }} has permissionInfo with operation {{ operation }} but it is not a literal.',
                    data: {
                      className,
                      operation,
                    },
                  })
                } else if (!availableOperations.includes(operation.value.value)) {
                  context.report({
                    node: permissionInfo.node,
                    message: 'Class {{ className }} has permissionInfo with operation {{ operation }} but that operation is not defined.',
                    data: {
                      className,
                      operation: operation.value.value,
                    },
                  })
                }
              }
            }
          }
        })
      },
    }
  },
}
