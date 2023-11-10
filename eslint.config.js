const txoConfig = require('eslint-config-txo-typescript')

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  ...txoConfig.default,
  {
    files: ['__tests__/**/*.ts', '__tests__/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './__tests__/tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './__tests__/tsconfig.json',
        },
      },
    },
  },
]

module.exports = config
