/**
 * Jest configuration for the project using ts-jest preset
 */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.+(spec|test).+(ts|tsx|js|jsx)',
    '<rootDir>/**/*.+(spec|test).+(ts|tsx|js|jsx)',
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'scripts/**/*.{js,ts}',
    '!scripts/**/*.test.{js,ts}',
  ],
  coverageThreshold: {
    global: { branches: 10, functions: 10, lines: 10, statements: 10 },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: 'test-results', outputName: 'junit.xml' },
    ],
  ],
}
