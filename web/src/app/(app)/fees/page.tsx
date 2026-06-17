import { createClient } from "@/lib/supabase/server";
import { getAcademyContext } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate, rel } from "@/lib/utils";
import { CollectFeeRow } from "@/components/fees/collect-fee-row";
import { redirect } from "next/navigation";
import { canMutateFees } from "@/lib/permissions";

export default async function FeesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const ctx = await getAcademyContext();
  if (!ctx || !canMutateFees(ctx.role)) redirect("/dashboard");

  const { status = "pending" } = await searchParams;
  const supabase = await createClient();
  await supabase.rpc("mark_overdue_fees");

  let query = supabase
    .from("student_fees")
    .select("*, students(name, mobile, student_code), fee_types(name), fee_plans(name)")
    .order("due_date", { ascending: true });

  if (status === "overdue") query = query.eq("status", "overdue");
  else if (status === "paid") query = query.eq("status", "paid");
  else if (status === "all") {
    /* no filter */
  } else {
    query = query.in("status", ["pending", "partially_paid", "overdue"]);
  }

  const { data: fees } = await query;

  const tabs = [
    { key: "pending", label: "Pending" },
    { key: "overdue", label: "Overdue" },
    { key: "paid", label: "Paid" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Fees</h1>
        <p className="text-sm text-muted">Collect payments and track pending balances</p>
      </div>

      <div className="inline-flex rounded-full bg-surface-soft p-1">
        {tabs.map((t) => (
          <a
            key={t.key}
            href={`/fees?status=${t.key}`}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              status === t.key ? "bg-canvas text-ink shadow-sm" : "text-muted"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <div className="space-y-2">
        {(fees ?? []).map((fee) => (
          <Card key={fee.id} className="!p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink">
                  {rel<{ name: string }>(fee.students)?.name}
                </p>
                <p className="text-xs text-muted">
                  {fee.period_label ??
                    rel<{ name: string }>(fee.fee_plans)?.name ??
                    rel<{ name: string }>(fee.fee_types)?.name}{" "}
                  · Due {formatDate(fee.due_date)}
                </p>
                <Badge status={fee.status} className="mt-1" />
              </div>
              <div className="flex items-center gap-3">
                <p className="font-mono-amount text-lg font-semibold text-ink">
                  {formatCurrency(Number(fee.pending_amount))}
                </p>
                {Number(fee.pending_amount) > 0 && (
                  <CollectFeeRow
                    fee={fee}
                    academyName={ctx.academyUser.academies.name}
                    reviewLink={ctx.settings?.google_review_link ?? null}
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
        {(fees ?? []).length === 0 && (
          <p className="text-center text-sm text-muted">No fees in this view.</p>
        )}
      </div>
    </div>
  );
}
