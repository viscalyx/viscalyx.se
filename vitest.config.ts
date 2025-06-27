import { defineConfig } from 'vitest/config'
import path from 'path'

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
      '**/__tests__/**/*.+(spec|test).+(ts|tsx|js|jsx)',
      '**/*.+(spec|test).+(ts|tsx|js|jsx)',
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
      exclude: [
        'scripts/**/*.test.{js,ts}',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/node_modules/**',
      ],
      thresholds: {
        branches: 10,
        functions: 10,
        lines: 10,
        statements: 10,
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
