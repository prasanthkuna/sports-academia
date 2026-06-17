import Link from "next/link";
import { isTrialActive, trialDaysRemaining } from "@/lib/subscription";
import type { SubscriptionStatus } from "@/lib/subscription";

export function TrialBanner({
  subscriptionStatus,
  trialEndsAt,
}: {
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string | null;
}) {
  if (!isTrialActive(subscriptionStatus, trialEndsAt)) return null;

  const days = trialDaysRemaining(trialEndsAt);

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-brand/25 bg-brand-soft px-4 py-3 text-sm">
      <p className="text-ink">
        <span className="font-semibold">Pro trial</span>
        {" — "}
        {days === 1 ? "1 day left" : `${days} days left`} with full import, QR, and reports.
      </p>
      <Link href="/plans" className="shrink-0 font-semibold text-brand hover:underline">
        View plans
      </Link>
    </div>
  );
}
