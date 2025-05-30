# Cloudflare Scripts Documentation

This document describes the Cloudflare-specific scripts in `package.json` that enable deployment to Cloudflare Workers using the OpenNext adapter.

## Scripts Overview

### `preview`

```bash
npm run preview
```

**Command**: `opennextjs-cloudflare build && opennextjs-cloudflare preview`

**Purpose**: Tests and previews your Next.js application using the Cloudflare adapter in a local environment that simulates the Cloudflare Workers runtime.

**What it does**:

1. **Build**: Compiles your Next.js application for Cloudflare Workers using the OpenNext adapter
2. **Preview**: Starts a local server that mimics the Cloudflare Workers environment

**When to use**:

- Before deploying to production to ensure your app works correctly in the Cloudflare Workers environment
- For integration testing with Cloudflare-specific features
- To verify that your application behaves correctly with the OpenNext adapter

**Difference from `dev`**:

- `npm run dev` uses the Next.js development server for fast development
- `npm run preview` uses the Cloudflare adapter to simulate the production environment

### `deploy`

```bash
npm run deploy
```

**Command**: `opennextjs-cloudflare build && opennextjs-cloudflare deploy`

**Purpose**: Builds and deploys your Next.js application to Cloudflare Workers.

**What it does**:

1. **Build**: Compiles your Next.js application for Cloudflare Workers
2. **Deploy**: Uploads and deploys the application to your Cloudflare Workers environment

**Deployment targets**:

- `*.workers.dev` subdomain (default)
- Custom domain (if configured)

**Requirements**:

- Wrangler CLI must be authenticated with Cloudflare
- Proper `wrangler.jsonc` configuration file

### `cf-typegen`

```bash
npm run cf-typegen
```

**Command**: `wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts`

**Purpose**: Generates TypeScript type definitions for Cloudflare environment variables and bindings.

**What it does**:

- Creates a `cloudflare-env.d.ts` file with TypeScript interfaces
- Provides type safety for Cloudflare-specific environment variables
- Includes types for bindings like R2, KV, D1, etc.

**When to use**:

- After adding new environment variables in `wrangler.jsonc`
- When setting up new Cloudflare bindings
- To maintain type safety in TypeScript projects

## Development Workflow

### Local Development

```bash
npm run dev
```

Use the standard Next.js development server for the best developer experience with hot reloading.

### Testing with Cloudflare Environment

```bash
npm run preview
```

Test your application in an environment that simulates Cloudflare Workers before deploying.

### Production Deployment

```bash
npm run deploy
```

Deploy your application to Cloudflare Workers.

### Type Generation

```bash
npm run cf-typegen
```

Generate TypeScript types for Cloudflare bindings and environment variables.

## Configuration Files

These scripts work in conjunction with:

- **`wrangler.jsonc`**: Cloudflare Workers configuration
- **`open-next.config.ts`**: OpenNext adapter configuration
- **`cloudflare-env.d.ts`**: Generated TypeScript types (created by `cf-typegen`)

## Required Dependencies

The following packages enable these scripts:

```json
{
  "dependencies": {
    "@opennextjs/cloudflare": "^1.1.0"
  },
  "devDependencies": {
    "wrangler": "^4.18.0"
  }
}
```

## Additional Resources

- [Cloudflare Next.js Guide](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs/)
- [OpenNext Documentation](https://opennext.js.org/cloudflare)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
