import nextConfig from 'eslint-config-next'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'out/**',
      'build/**',
      '.open-next/**',
      'cloudflare-env.d.ts',
    ],
  },
  ...nextConfig,
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
    },

    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: [
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
      '**/?(*.)+(spec|test).{ts,tsx,js,jsx}',
    ],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },

    rules: {},
  },
  {
    files: ['**/*.test.tsx'],

    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]

export default config
