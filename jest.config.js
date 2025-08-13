module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js' // Exclude main app file from coverage
  ],
  coverageThreshold: {
     global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  testMatch: [
    '**/tests/**/*.test.js'
  ]
};