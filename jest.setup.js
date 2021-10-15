jest.setTimeout(30000)

const { toSatisfy } = require('jest-extended')
expect.extend({ toSatisfy })
