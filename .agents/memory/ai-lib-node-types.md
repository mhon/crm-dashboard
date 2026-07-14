---
name: lib/ai needs @types/node for process.env
description: lib/ai uses process.env (OpenRouter API key); needs @types/node devDep and types:["node"] in tsconfig.
---

## Rule
`lib/ai/src/index.ts` reads `process.env.OPENROUTER_API_KEY`. Without `@types/node`, tsc --build fails with TS2591 "Cannot find name 'process'".

**Fix:**
1. `pnpm --filter @workspace/ai add -D @types/node`
2. Add `"types": ["node"]` to `lib/ai/tsconfig.json` compilerOptions

**Why:** lib/ai is a composite lib checked by `tsc --build`. It does not automatically inherit node types. The `types` array must be explicit for composite libs that use Node.js globals.
