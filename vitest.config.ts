import path from 'path'
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
      '**/__tests__/**/*.+(spec|test).+(ts|tsx|js|jsx|mjs)',
      '**/*.+(spec|test).+(ts|tsx|js|jsx|mjs)',
    ],

    // Coverage configuration
    coverage: {
      provider: 'v8',
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
