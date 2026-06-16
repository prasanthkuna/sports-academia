import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

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
      <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
        <div className="rounded-2xl border border-hairline bg-canvas p-8 text-center">
          <p className="text-error">Receipt not found or invalid</p>
        </div>
      </div>
    );
  }

  const r = result.receipt;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-soft p-4">
      <div className="w-full max-w-sm rounded-2xl border border-success/30 bg-canvas p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-success">Verified receipt</p>
        <h1 className="mt-2 font-display text-xl font-semibold text-ink">{r.academy_name}</h1>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Receipt #</dt>
            <dd className="font-mono-amount font-medium">{r.receipt_number}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Student</dt>
            <dd className="font-medium">{r.student_name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Amount</dt>
            <dd className="font-mono-amount font-semibold">{formatCurrency(Number(r.amount))}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Mode</dt>
            <dd className="uppercase">{r.payment_mode}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Date</dt>
            <dd>{formatDate(r.payment_date)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
