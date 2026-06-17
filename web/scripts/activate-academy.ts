/**
 * Activate a paid academy after trial or payment.
 * Usage: cd web && bun run scripts/activate-academy.ts <slug> [starter|pro]
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const slug = process.argv[2];
const plan = (process.argv[3] ?? "pro") as "starter" | "pro";

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!slug) {
  console.error("Usage: bun run scripts/activate-academy.ts <slug> [starter|pro]");
  process.exit(1);
}

if (plan !== "starter" && plan !== "pro") {
  console.error("Plan must be starter or pro");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: academy, error: findErr } = await admin
  .from("academies")
  .select("id, name, subscription_status")
  .eq("slug", slug)
  .single();

if (findErr || !academy) {
  console.error("Academy not found:", slug);
  process.exit(1);
}

const { error } = await admin
  .from("academies")
  .update({
    subscription_status: "active",
    plan,
    trial_ends_at: null,
  })
  .eq("id", academy.id);

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`✓ Activated ${academy.name} (${slug}) on ${plan} plan`);
