---
name: Orval Zod v4 vs v3 codegen fix
description: Orval v8 generates Zod v4 APIs (looseObject, uuid) but project uses Zod v3; fix via post-processing in codegen script.
---

## Rule
After running `orval`, patch `lib/api-zod/src/generated/api.ts` with a node inline script to replace Zod v4 calls with v3 equivalents before running `typecheck:libs`.

## Fix applied (in lib/api-spec/package.json codegen script)
```
node -e "const fs=require('fs');const p='../../lib/api-zod/src/generated/api.ts';let f=fs.readFileSync(p,'utf8');f=f.replace(/zod\.looseObject\(/g,'zod.object(');f=f.replace(/zod\.uuid\(\)/g,'zod.string().uuid()');fs.writeFileSync(p,f);"
```

**Why:** Orval v8.20.0 generates Zod v4-style APIs by default. Project uses zod@3.x from catalog. `zod.looseObject()` is v4's passthrough-object; `zod.uuid()` is a v4 standalone string schema. In v3: use `z.object()` (strips extra keys by default) and `z.string().uuid()` respectively.

**How to apply:** Any time codegen is re-run or the api-spec package.json codegen script is changed, ensure this patch step is still present between `orval` and `typecheck:libs`.
