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
const typesWhichDoNotRequireReference = ['chore', 'docs', 'ci', 'revert', 'test']

module.exports = {
  extends: [
    '@commitlint/config-conventional',
  ],
  rules: {
    'footer-max-line-length': [
      0,
    ],
    'body-max-line-length': [
      0,
    ],
    'reference-check': [2, 'always'],
  },
  parserPreset: './commitlint.parser-config',
  plugins: [
    {
      rules: {
        'reference-check': ({ type, references }) => {
          if (!typesWhichDoNotRequireReference.includes(type) && references.length !== 1) {
            return [false, `Commits of type ${type} must contain one issue reference.`]
          }
          return [true, '']
        },
      },
    },
  ],
}
