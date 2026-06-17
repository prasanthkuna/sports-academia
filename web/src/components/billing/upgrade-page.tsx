"use client";

import { AuthCard } from "@/components/auth/auth-shell";
import { RazorpayCheckoutButton } from "@/components/billing/razorpay-checkout";
import { landingConfig } from "@/lib/landing-config";
import { activationTotalInr } from "@/lib/billing/pricing";
import type { AcademyPlan } from "@/lib/plans";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function UpgradePageClient({
  academyName,
  trialEndedAt,
  razorpayEnabled,
}: {
  academyName: string;
  trialEndedAt: string | null;
  razorpayEnabled: boolean;
}) {
  const { pricing, whatsapp, contact } = landingConfig;
  const waText = encodeURIComponent(
    `Hi, my Pro trial for ${academyName} has ended. I'd like to activate a subscription.`,
  );
  const waUrl = `https://wa.me/${whatsapp.number}?text=${waText}`;

  return (
    <AuthCard className="max-w-lg">
      <p className="text-sm font-medium uppercase tracking-wider text-error">Trial ended</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
        Activate {academyName}
      </h1>
      <p className="mt-3 text-sm text-body">
        Your 7-day Pro trial has ended
        {trialEndedAt
          ? ` on ${new Date(trialEndedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}`
          : ""}
        . Pay online to restore access — setup fee plus your first month.
      </p>

      <div className="mt-8 space-y-4">
        {pricing.plans.map((plan) => {
          const planId = plan.id as AcademyPlan;
          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-4 ${
                plan.popular ? "border-brand bg-brand-soft/30" : "border-hairline"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-semibold text-ink">{plan.name}</h2>
                <p className="text-lg font-semibold text-ink">
                  {formatInr(plan.price)}
                  <span className="text-sm font-normal text-muted">/{plan.period}</span>
                </p>
              </div>
              <p className="mt-1 text-xs text-muted">{plan.idealFor}</p>
              <p className="mt-2 text-xs text-body">
                First payment: {formatInr(activationTotalInr(planId))} (setup{" "}
                {formatInr(pricing.setup.amount)} + month 1)
              </p>
              <div className="mt-4">
                <RazorpayCheckoutButton
                  plan={planId}
                  academyName={academyName}
                  razorpayEnabled={razorpayEnabled}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        UPI, cards, and netbanking accepted via Razorpay.
      </p>

      <div className="mt-6 flex flex-col gap-3 border-t border-hairline pt-6">
        <p className="text-center text-xs text-muted">Prefer to pay offline?</p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-full items-center justify-center rounded-md border border-hairline bg-canvas px-5 text-sm font-semibold text-ink hover:bg-surface-soft"
        >
          Activate via WhatsApp
        </a>
        <a
          href={`mailto:${contact.email}?subject=Activate%20${encodeURIComponent(academyName)}`}
          className="inline-flex h-11 w-full items-center justify-center rounded-md px-5 text-sm font-medium text-brand hover:underline"
        >
          Email us
        </a>
      </div>
    </AuthCard>
  );
}
