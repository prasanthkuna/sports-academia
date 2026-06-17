"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeOnboarding } from "@/app/auth-actions";
import { saveAcademySettings } from "@/app/actions";
import { AuthCard } from "@/components/auth/auth-shell";
import { DownloadTemplateButton } from "@/components/import/download-template-button";
import { PhoneWhatsappFields } from "@/components/settings/phone-whatsapp-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trialDaysRemaining } from "@/lib/subscription";

type OnboardingWizardProps = {
  academyName: string;
  slug: string;
  trialEndsAt: string | null;
  settings: {
    contact_number: string | null;
    whatsapp_number: string | null;
    address: string | null;
    email: string | null;
    receipt_prefix: string | null;
  } | null;
};

export function OnboardingWizard({
  academyName,
  slug,
  trialEndsAt,
  settings,
}: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const daysLeft = trialDaysRemaining(trialEndsAt);

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await saveAcademySettings(new FormData(e.currentTarget));
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  async function finish(skipImport = false) {
    setLoading(true);
    setError(null);
    try {
      await completeOnboarding();
      router.push(skipImport ? "/dashboard" : "/import");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete setup");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard className="max-w-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Setup</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Welcome, {academyName}</h1>
        </div>
        {daysLeft > 0 && (
          <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
            {daysLeft}d Pro trial
          </span>
        )}
      </div>

      <div className="mb-8 flex gap-2">
        {[1, 2].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full ${step >= n ? "bg-brand" : "bg-hairline"}`}
          />
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={saveProfile} className="space-y-4">
          <p className="text-sm text-body">
            Step 1 of 2 — Academy contact details for receipts and WhatsApp.
          </p>
          <p className="text-xs text-muted">
            Public page: <code className="rounded bg-surface-soft px-1">/a/{slug}/enquire</code>
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <PhoneWhatsappFields
              defaultPhone={settings?.contact_number ?? ""}
              defaultWhatsapp={settings?.whatsapp_number ?? ""}
            />
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase text-muted">Address</label>
              <Input name="address" defaultValue={settings?.address ?? ""} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-muted">Email</label>
              <Input
                name="email"
                type="email"
                defaultValue={settings?.email ?? ""}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-muted">Receipt prefix</label>
              <Input
                name="receipt_prefix"
                defaultValue={settings?.receipt_prefix ?? "ACA"}
                className="mt-1"
              />
            </div>
          </div>
          <input type="hidden" name="geofence_required" value="off" />
          <input type="hidden" name="qr_checkin_enabled" value="on" />
          <input type="hidden" name="checkin_pin_required" value="on" />
          <input type="hidden" name="reminders_enabled" value="on" />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving…" : "Continue"}
          </Button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-body">
            Step 2 of 2 — Import your student register from Excel.
          </p>
          <Card className="p-4">
            <h2 className="font-semibold text-ink">Recommended import order</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-body">
              <li>Download the template (batches sheet first, then students)</li>
              <li>Or upload your existing register — we auto-detect columns</li>
              <li>Review imported students on the dashboard</li>
            </ol>
            <div className="mt-4 flex flex-wrap gap-2">
              <DownloadTemplateButton variant="secondary" />
              <Button type="button" onClick={() => finish(false)} disabled={loading}>
                Go to import
              </Button>
            </div>
          </Card>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => finish(true)}
            disabled={loading}
          >
            Skip for now — open dashboard
          </Button>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-error-soft px-3 py-2.5 text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <p className="mt-6 text-center text-xs text-muted">
        Need help?{" "}
        <Link href="/plans" className="text-brand hover:underline">
          Contact support
        </Link>
      </p>
    </AuthCard>
  );
}
