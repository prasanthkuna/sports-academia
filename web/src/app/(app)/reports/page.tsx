import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default async function ReportsPage() {
  const supabase = await createClient();

  const [{ data: collections }, { data: pending }, { count: studentCount }] =
    await Promise.all([
      supabase.from("payments").select("amount").eq("status", "active"),
      supabase
        .from("student_fees")
        .select("pending_amount")
        .in("status", ["pending", "partially_paid", "overdue"]),
      supabase.from("students").select("*", { count: "exact", head: true }),
    ]);

  const totalCollection = collections?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const totalPending = pending?.reduce((s, f) => s + Number(f.pending_amount), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Reports</h1>
        <p className="text-sm text-muted">Summary exports — full Excel/PDF in next iteration</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase text-muted">Total collected</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold">
            {formatCurrency(totalCollection)}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Total pending</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold">
            {formatCurrency(totalPending)}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Students</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold">{studentCount ?? 0}</p>
        </Card>
      </div>
    </div>
  );
}
