module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off', // Allow console statements in Node.js server
    'no-unused-vars': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2]
  }
};