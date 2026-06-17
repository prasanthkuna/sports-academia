import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AuthCard, AuthShell } from "@/components/auth/auth-shell";
import { formatCurrency, formatDate } from "@/lib/utils";

function VerifyAside() {
  return (
    <div className="max-w-md">
      <p className="text-sm font-medium uppercase tracking-wider text-brand">Payment proof</p>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">
        Parents can verify they paid
      </h2>
      <p className="mt-4 text-base leading-relaxed text-body">
        Every fee collection gets a numbered receipt with a public verify link — useful when UPI
        screenshots get lost in WhatsApp threads.
      </p>
      <Link href="/login" className="mt-8 inline-block text-sm font-semibold text-brand hover:underline">
        Academy staff sign in →
      </Link>
    </div>
  );
}

export default async function VerifyReceiptPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data } = await supabase.rpc("verify_receipt_public", { p_token: token });
  const result = data as {
    ok: boolean;
    error?: string;
    receipt?: {
      receipt_number: string;
      amount: number;
      payment_mode: string;
      payment_date: string;
      student_name: string;
      academy_name: string;
    };
  };

  if (!result?.ok || !result.receipt) {
    return (
      <AuthShell aside={<VerifyAside />}>
        <AuthCard className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-soft">
            <XCircle className="h-7 w-7 text-error" />
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Receipt not found</h1>
          <p className="mt-2 text-sm text-body">
            This link may be invalid or expired. Ask the academy for a fresh receipt number.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-active"
          >
            Back to home
          </Link>
        </AuthCard>
      </AuthShell>
    );
  }

  const r = result.receipt;

  return (
    <AuthShell aside={<VerifyAside />}>
      <AuthCard>
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success-soft">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-success">
              Payment verified
            </p>
            <h1 className="mt-1 font-display text-xl font-semibold text-ink">{r.academy_name}</h1>
          </div>
        </div>

        <dl className="mt-8 space-y-4 border-t border-hairline pt-6 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Receipt #</dt>
            <dd className="font-mono-amount font-semibold text-ink">{r.receipt_number}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Student</dt>
            <dd className="font-medium text-ink">{r.student_name}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Amount</dt>
            <dd className="font-mono-amount text-lg font-semibold text-brand">
              {formatCurrency(Number(r.amount))}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Mode</dt>
            <dd className="font-medium uppercase text-ink">{r.payment_mode}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Date</dt>
            <dd className="font-medium text-ink">{formatDate(r.payment_date)}</dd>
          </div>
        </dl>

        <p className="mt-6 rounded-lg bg-surface-soft px-3 py-2.5 text-center text-xs text-muted">
          Secured by Academy Ops · tamper-evident receipt record
        </p>
      </AuthCard>
    </AuthShell>
  );
}
