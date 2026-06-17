"use client";

import { RazorpayCheckoutButton } from "@/components/billing/razorpay-checkout";
import { landingConfig } from "@/lib/landing-config";
import { activationTotalInr, monthlyPriceInr } from "@/lib/billing/pricing";
import { isTrialActive, trialDaysRemaining, type SubscriptionStatus } from "@/lib/subscription";
import type { AcademyPlan } from "@/lib/plans";
import { planLabel } from "@/lib/plans";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PlansContent({
  academyName,
  trialEndsAt,
  subscriptionStatus,
  currentPlan,
  razorpayEnabled,
  canPay,
}: {
  academyName: string;
  trialEndsAt: string | null;
  subscriptionStatus: SubscriptionStatus;
  currentPlan: AcademyPlan;
  razorpayEnabled: boolean;
  canPay: boolean;
}) {
  const { pricing, whatsapp, contact } = landingConfig;
  const onTrial = isTrialActive(subscriptionStatus, trialEndsAt);
  const daysLeft = trialDaysRemaining(trialEndsAt);
  const isPaid = subscriptionStatus === "active";

  const waText = encodeURIComponent(
    onTrial
      ? `Hi, I'd like to activate ${academyName} on Academy Ops during my trial.`
      : `Hi, my Pro trial for ${academyName} has ended. I'd like to activate a subscription.`,
  );
  const waUrl = `https://wa.me/${whatsapp.number}?text=${waText}`;

  return (
    <div className="space-y-6">
      <div>
        {isPaid ? (
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Your plan</p>
        ) : onTrial ? (
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Pro trial</p>
        ) : (
          <p className="text-sm font-medium uppercase tracking-wider text-error">Trial ended</p>
        )}
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">{academyName}</h1>
        <p className="mt-2 text-sm text-body">
          {isPaid
            ? `You are on the ${planLabel(currentPlan)} plan.`
            : onTrial
              ? `${daysLeft === 1 ? "1 day" : `${daysLeft} days`} left on your Pro trial. Activate anytime — one-time setup includes your first month.`
              : "Pay online to restore access. One-time setup includes your first month."}
        </p>
      </div>

      <div className="rounded-xl border border-brand/25 bg-brand-soft/40 p-4">
        <p className="text-sm font-semibold text-ink">{pricing.setup.title}</p>
        <p className="mt-1 text-sm text-body">
          <strong>Starter {formatInr(pricing.setup.starterAmount)}</strong> ·{" "}
          <strong>Pro {formatInr(pricing.setup.proAmount)}</strong>
          {" — "}includes go-live support, first Excel import, training, and your first month.
        </p>
        <ul className="mt-3 space-y-1 text-xs text-muted">
          {pricing.setup.includes.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        {pricing.plans.map((plan) => {
          const planId = plan.id as AcademyPlan;
          const activation = activationTotalInr(planId);
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
                Activate now: {formatInr(activation)} one-time (month 1 included) · then{" "}
                {formatInr(monthlyPriceInr(planId))}/mo from month 2
              </p>
              {canPay && !isPaid && (
                <div className="mt-4">
                  <RazorpayCheckoutButton
                    plan={planId}
                    academyName={academyName}
                    razorpayEnabled={razorpayEnabled}
                  />
                </div>
              )}
              {isPaid && currentPlan === planId && (
                <p className="mt-4 text-sm font-medium text-brand">Current plan</p>
              )}
            </div>
          );
        })}
      </div>

      {canPay && !isPaid && (
        <p className="text-center text-xs text-muted">UPI, cards, and netbanking via Razorpay.</p>
      )}

      {!isPaid && (
        <div className="flex flex-col gap-3 border-t border-hairline pt-6">
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
      )}
    </div>
  );
}
