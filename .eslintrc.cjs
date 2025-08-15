/* eslint-env node */
module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
    browser: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import', 'promise', 'n'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:promise/recommended',
    'plugin:n/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  rules: {
    'import/no-unresolved': 'off',
    'n/no-missing-import': 'off',
    'n/no-unsupported-features/es-syntax': 'off'
  },
  ignorePatterns: ['dist', 'coverage']
};