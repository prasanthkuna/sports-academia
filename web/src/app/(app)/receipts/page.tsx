import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ReceiptsPage() {
  const supabase = await createClient();
  const { data: receipts } = await supabase
    .from("receipts")
    .select("*, payments(amount, payment_date, payment_mode)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Receipts</h1>
        <p className="text-sm text-muted">Payment receipts generated for the academy</p>
      </div>
      <div className="divide-y divide-hairline-soft rounded-lg border border-hairline-soft">
        {(receipts ?? []).map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-mono-amount font-semibold text-ink">{r.receipt_number}</p>
              <p className="text-xs text-muted">
                {formatDate((r.payments as { payment_date: string }).payment_date)} ·{" "}
                {(r.payments as { payment_mode: string }).payment_mode}
              </p>
            </div>
            <p className="font-mono-amount font-semibold">
              {formatCurrency(Number((r.payments as { amount: number }).amount))}
            </p>
          </div>
        ))}
        {(receipts ?? []).length === 0 && (
          <p className="p-6 text-center text-sm text-muted">No receipts yet.</p>
        )}
      </div>
    </div>
  );
}
