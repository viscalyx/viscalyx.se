/**
 * Jest configuration for the project using ts-jest preset
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: [
    '<rootDir>/lib/**/__tests__/**/*.+(ts|js)',
    '<rootDir>/lib/**/*.+(spec|test).+(ts|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
}
