# Sports Academy Management Platform

Monorepo for the sports academy ops product.

## Quick start

```powershell
cd web
bun install
copy .env.local.example .env.local
# Add Supabase keys from dashboard
bun run seed
bun run dev
```

**Demo login:** `admin@demo.academy` / `Demo@123456`

## Structure

| Path | Purpose |
|------|---------|
| `web/` | Next.js app (Bun package manager) |
| `docs/` | PRD, build spec, UI doc |
| `supabase/` | Linked project `iqedvkdrccrsnwurwntq` |

## Package manager

Use **Bun** only in `web/` — `bun.lock` is the lockfile.
