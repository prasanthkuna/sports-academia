import { getAcademyContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ReportsExport } from "@/components/reports/reports-export";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const ctx = await getAcademyContext();
  const supabase = await createClient();
  const sp = await searchParams;
  const to = sp.to ?? new Date().toISOString().slice(0, 10);
  const defaultFrom = new Date();
  defaultFrom.setDate(defaultFrom.getDate() - 30);
  const from = sp.from ?? defaultFrom.toISOString().slice(0, 10);

  const [
    { data: collections },
    { data: pending },
    { data: attendance },
    { data: leads },
    { count: studentCount },
  ] = await Promise.all([
    supabase
      .from("payments")
      .select("amount")
      .eq("status", "active")
      .gte("payment_date", from)
      .lte("payment_date", to),
    supabase
      .from("student_fees")
      .select("pending_amount")
      .in("status", ["pending", "partially_paid", "overdue"]),
    supabase
      .from("attendance")
      .select("source, status")
      .gte("attendance_date", from)
      .lte("attendance_date", to),
    supabase
      .from("leads")
      .select("status")
      .gte("created_at", `${from}T00:00:00`),
    supabase.from("students").select("*", { count: "exact", head: true }),
  ]);

  const totalCollection = collections?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const totalPending = pending?.reduce((s, f) => s + Number(f.pending_amount), 0) ?? 0;
  const present = attendance?.filter((a) => a.status === "present").length ?? 0;
  const qrPresent = attendance?.filter((a) => a.status === "present" && a.source === "qr_scan").length ?? 0;
  const converted = leads?.filter((l) => l.status === "converted").length ?? 0;
  const totalLeads = leads?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Reports</h1>
          <p className="text-sm text-muted">
            {from} → {to}
            {ctx?.plan === "pro" ? " · Export available" : " · Upgrade to Pro for export"}
          </p>
        </div>
        {ctx && <ReportsExport plan={ctx.plan} role={ctx.role} from={from} to={to} />}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-xs uppercase text-muted">Collected</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold">{formatCurrency(totalCollection)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Pending fees</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold">{formatCurrency(totalPending)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Students</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold">{studentCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Attendance marks</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold">{present}</p>
          <p className="text-xs text-muted">{qrPresent} via QR scan</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Lead conversion</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold">
            {totalLeads ? Math.round((converted / totalLeads) * 100) : 0}%
          </p>
          <p className="text-xs text-muted">
            {converted}/{totalLeads} converted
          </p>
        </Card>
      </div>
    </div>
  );
}
