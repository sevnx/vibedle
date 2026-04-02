<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Overview
Vibedle is a single Next.js 16 app (not a monorepo). It's a guessing game where users see "vibe-coded" websites and guess which AI model created them. All game logic is client-side with hardcoded rounds—no database or backend services required.

### Environment variables
Clerk authentication is required. The following secrets must be injected:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### Commands
Standard `package.json` scripts apply:
- **Dev server:** `pnpm dev` (runs on port 3000)
- **Lint:** `pnpm lint` (ESLint v9 flat config)
- **Build:** `pnpm build`
- **Middleware:** `proxy.ts` at workspace root contains Clerk middleware configuration (not `middleware.ts`)

### Caveats
- The `pnpm-workspace.yaml` file only contains `ignoredBuiltDependencies` (sharp, unrs-resolver); this is not a monorepo.
- The pnpm install may show a warning about `@clerk/shared` build scripts being ignored — this is expected and does not affect functionality.
- The game page (`/game`) loads an iframe from `https://example.com` — this is a placeholder; the game UI still functions without real content in the iframe.
