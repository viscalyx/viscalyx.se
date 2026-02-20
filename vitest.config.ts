import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    jsx: 'automatic', // Enable automatic JSX runtime
  },

  test: {
    // Serve Vitest UI at root so Codespaces port forwarding works (default is /__vitest__/)
    uiBase: '/',

    // Use jsdom environment for testing React components
    environment: 'jsdom',

    // Setup file (equivalent to Jest's setupFilesAfterEnv)
    setupFiles: ['./vitest.setup.ts'],

    // Test file patterns (equivalent to Jest's testMatch)
    include: ['**/*.{spec,test}.{ts,tsx,js,jsx,mjs}'],

    // Exclude Playwright integration tests
    exclude: ['**/tests/integration/**', '**/node_modules/**'],

    reporters: [
      'verbose', // Use default reporter for console output
      [
        'junit',
        {
          outputFile: './test-results/test-results-junit.xml', // Output file for JUnit report
          suiteName: 'Vitest Tests', // Name of the test suites
          classNameTemplate: '{filename}', // Template for class names in the report
        },
      ],
    ],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage', // Output coverage reports to ./coverage folder
      reporter: ['text', 'json', 'html', 'clover', 'lcov'], // Multiple formats including Codecov-compatible ones
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'scripts/build-blog-data.js',
        'scripts/build-page-dates.js',
        'scripts/plugins/blockquote-types.js',
        'scripts/plugins/remark-floating-images.js',
        'scripts/plugins/remark-image-paths.js',
      ],
      exclude: [
        '**/*.d.ts',
        'scripts/analyze-bundle.js',
        'scripts/generate-og-images.js',
        'scripts/prebuild.js',
        'scripts/security-audit.js',
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
