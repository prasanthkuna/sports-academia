# Sports Academy Ops

Mobile-first academy operations app — students, attendance, fees, receipts, WhatsApp.

**Stack:** Next.js 16 · Supabase · Bun

## Setup

```powershell
cd web
bun install
```

Copy env and add your Supabase keys from [Dashboard → Settings → API](https://supabase.com/dashboard/project/iqedvkdrccrsnwurwntq/settings/api):

```powershell
copy .env.local.example .env.local
```

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (seed only — never expose in client)

## Seed demo data

```powershell
bun run seed
```

**Demo login (owner — full academy access)**
- Email: `owner@demo.academy`
- Password: `Demo@123456`

Also try `staff@demo.academy` (front desk) or `coach@demo.academy` (batches only).

## Run dev server

```powershell
bun run dev
```

Open http://localhost:3000

## Self-serve signup (7-day Pro trial)

1. Go to `/signup` — create owner account + academy
2. Complete onboarding (contact details → Excel import)
3. Full Pro access for 7 days (import, QR, reports)
4. After trial: `/upgrade` — activate via WhatsApp or email

**Activate after payment (ops):**

```powershell
bun --env-file=.env.local scripts/activate-academy.ts <slug> pro
```

Apply DB migration `supabase/migrations/20260617150000_signup_trial_provisioning.sql` before signup works in production.

## Razorpay (subscription checkout)

Add to `.env.local` and **Vercel → Environment Variables**:

| Variable | Where in Razorpay |
|----------|-------------------|
| `RAZORPAY_KEY_ID` | Dashboard → API Keys → Key Id |
| `RAZORPAY_KEY_SECRET` | API Keys → Key Secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as Key Id |
| `RAZORPAY_WEBHOOK_SECRET` | Webhooks → your webhook → Secret |

**Webhook URL (test & live):** `https://sports-academia.vercel.app/api/razorpay/webhook`  
Events: `payment.captured`, `order.paid`

Trial expiry → `/upgrade` → Pay (setup + month 1) → auto-activates academy.

**Ops fallback:** `bun scripts/activate-academy.ts <slug> pro`

### Razorpay MCP (Cursor AI tools)

Configured in `~/.cursor/mcp.json` as `razorpay` — connects to `https://mcp.razorpay.com/mcp`.

To refresh credentials after key rotation:

```powershell
# PowerShell — replace with your key_id:key_secret
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("rzp_test_XXXX:your_secret"))
```

Set `AUTH_HEADER` to `Basic <that-base64-string>` in Cursor MCP settings, then restart Cursor.

## Public pages

- Academy page: `/a/kca-hyderabad`
- Enquiry form: `/a/kca-hyderabad/enquire`

## Package manager

This project uses **Bun** (`bun.lock`). Use `bun install`, `bun run dev`, `bun run build` — not npm.

## Docs

- `docs/prd.md` — client scope
- `docs/build-prd.md` — execution spec
- `docs/ui-doc.md` — UI system
