import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    jsx: 'automatic', // Enable automatic JSX runtime
  },

  test: {
    // Use jsdom environment for testing React components
    environment: 'jsdom',

    // Setup file (equivalent to Jest's setupFilesAfterEnv)
    setupFiles: ['./vitest.setup.ts'],

    // Test file patterns (equivalent to Jest's testMatch)
    include: [
      '**/*.+(spec|test).+(ts|tsx|js|jsx|mjs)',
    ],

    reporters: [
      'verbose', // Use default reporter for console output
      [
        'junit',
        {
          outputFile: './test-results/test-results.xml', // Output file for JUnit report
          suiteName: 'Vitest Tests', // Name of the test suites
          classNameTemplate: '{filename}', // Template for class names in the report
          properties: {
            'api.host': '',
          }, // Custom properties for the report
        },
      ],
    ],

    // Coverage configuration
    coverage: {
      all: true, // Collect coverage for all files
      provider: 'v8',
      reportsDirectory: './coverage', // Output coverage reports to ./coverage folder
      reporter: ['text', 'json', 'html', 'clover', 'lcov'], // Multiple formats including Codecov-compatible ones
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'scripts/**/*.{js,ts}',
      ],
      thresholds: {
        branches: 20,
        functions: 20,
        lines: 20,
        statements: 20,
      },
    },

    // Globals (makes test functions available without imports)
    globals: true,
  },

  resolve: {
    alias: {
      // Module path mapping (equivalent to Jest's moduleNameMapper)
      '@': path.resolve(__dirname, '.'),
    },
  },

  // Handle CSS and asset imports (CSS modules will be handled automatically)
})
