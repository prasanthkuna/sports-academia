import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAcademyContext } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, rel } from "@/lib/utils";
import { redirect } from "next/navigation";
import { canMutateFees, canViewRenewals } from "@/lib/permissions";
import { GenerateDemandsButton } from "@/components/fees/generate-demands-button";

export default async function RenewalsPage() {
  const ctx = await getAcademyContext();
  if (!ctx || !canViewRenewals(ctx.role)) redirect("/dashboard");

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const weekAhead = new Date();
  weekAhead.setDate(weekAhead.getDate() + 7);
  const weekStr = weekAhead.toISOString().slice(0, 10);

  await supabase.rpc("sync_assignment_status", { p_academy_id: ctx.academyId });
  await supabase.rpc("mark_overdue_fees");
  await supabase.rpc("generate_recurring_demands", { p_academy_id: ctx.academyId });

  const [
    { data: expiringFees },
    { data: overdueFees },
    { data: pendingFees },
    { data: paidToday },
    { data: expiringAssignments },
    { data: sessionAssignments },
    { data: expiredAssignments },
    { data: attendanceToday },
  ] = await Promise.all([
    supabase
      .from("student_fees")
      .select("id, pending_amount, due_date, period_label, students(name)")
      .in("status", ["pending", "partially_paid"])
      .gte("due_date", today)
      .lte("due_date", weekStr)
      .gt("pending_amount", 0)
      .order("due_date"),
    supabase
      .from("student_fees")
      .select("id, pending_amount, due_date, period_label, students(name)")
      .eq("status", "overdue")
      .order("due_date"),
    supabase
      .from("student_fees")
      .select("id, pending_amount, due_date, period_label, students(name)")
      .in("status", ["pending", "partially_paid"])
      .gt("pending_amount", 0)
      .order("due_date")
      .limit(10),
    supabase
      .from("payments")
      .select("amount, payment_mode, student_fees(students(name))")
      .eq("payment_date", today)
      .eq("status", "active"),
    supabase
      .from("student_fee_assignments")
      .select("id, end_date, sessions_total, sessions_used, students(name), fee_plans(name, plan_type)")
      .eq("status", "active")
      .not("end_date", "is", null)
      .gte("end_date", today)
      .lte("end_date", weekStr),
    supabase
      .from("student_fee_assignments")
      .select("id, sessions_total, sessions_used, students(name), fee_plans(name)")
      .eq("status", "active")
      .not("sessions_total", "is", null)
      .order("sessions_used", { ascending: false }),
    supabase
      .from("student_fee_assignments")
      .select("id, student_id, end_date, students(name), fee_plans(name)")
      .eq("status", "expired"),
    supabase
      .from("attendance")
      .select("student_id")
      .eq("attendance_date", today)
      .eq("status", "present"),
  ]);

  const presentIds = new Set((attendanceToday ?? []).map((a) => a.student_id));
  const expiredButAttending = (expiredAssignments ?? []).filter((a) =>
    presentIds.has(a.student_id),
  );

  const todayPaidTotal = paidToday?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Renewals</h1>
          <p className="text-sm text-muted">
            Who paid, who expired, who is due — your money control centre
          </p>
        </div>
        {canMutateFees(ctx.role) && (
          <div className="flex flex-wrap gap-2">
            <GenerateDemandsButton />
            <Link
              href="/fee-plans"
              className="rounded-md border border-hairline px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-soft"
            >
              Fee plans
            </Link>
            <Link
              href="/fees"
              className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-active"
            >
              Collect fees
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Paid today</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-brand">
            {formatCurrency(todayPaidTotal)}
          </p>
          <p className="mt-1 text-xs text-muted">{paidToday?.length ?? 0} payments</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Overdue</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-error">
            {overdueFees?.length ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Due this week</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-warning">
            {expiringFees?.length ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Expired · attended</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-ink">
            {expiredButAttending.length}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-ink">Overdue fees</h2>
          <div className="mt-3 space-y-2">
            {(overdueFees ?? []).length === 0 ? (
              <p className="text-sm text-muted">No overdue fees.</p>
            ) : (
              overdueFees?.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between rounded-md bg-canvas px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{rel<{ name: string }>(fee.students)?.name}</p>
                    <p className="text-xs text-muted">
                      {fee.period_label ?? "Fee"} · Due {formatDate(fee.due_date)}
                    </p>
                  </div>
                  <p className="font-mono-amount text-sm font-semibold text-error">
                    {formatCurrency(Number(fee.pending_amount))}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-ink">Expiring this week</h2>
          <div className="mt-3 space-y-2">
            {(expiringFees ?? []).length === 0 && (expiringAssignments ?? []).length === 0 ? (
              <p className="text-sm text-muted">Nothing expiring this week.</p>
            ) : (
              <>
                {expiringFees?.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between rounded-md bg-canvas px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{rel<{ name: string }>(fee.students)?.name}</p>
                      <p className="text-xs text-muted">Renewal due {formatDate(fee.due_date)}</p>
                    </div>
                    <Badge status="pending" />
                  </div>
                ))}
                {expiringAssignments?.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-md bg-canvas px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{rel<{ name: string }>(a.students)?.name}</p>
                      <p className="text-xs text-muted">
                        {rel<{ name: string }>(a.fee_plans)?.name} · ends {formatDate(a.end_date!)}
                      </p>
                    </div>
                    <Badge status="pending" />
                  </div>
                ))}
              </>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-ink">Sessions remaining</h2>
          <div className="mt-3 space-y-2">
            {(sessionAssignments ?? []).length === 0 ? (
              <p className="text-sm text-muted">No active session packages.</p>
            ) : (
              sessionAssignments?.slice(0, 8).map((a) => {
                const remaining = (a.sessions_total ?? 0) - a.sessions_used;
                return (
                  <div key={a.id} className="flex items-center justify-between rounded-md bg-canvas px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{rel<{ name: string }>(a.students)?.name}</p>
                      <p className="text-xs text-muted">{rel<{ name: string }>(a.fee_plans)?.name}</p>
                    </div>
                    <p
                      className={`text-sm font-semibold ${remaining <= 2 ? "text-warning" : "text-ink"}`}
                    >
                      {remaining} left
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-ink">Expired but attended today</h2>
          <div className="mt-3 space-y-2">
            {expiredButAttending.length === 0 ? (
              <p className="text-sm text-muted">No expired packages with attendance today.</p>
            ) : (
              expiredButAttending.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-md bg-error-soft/30 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{rel<{ name: string }>(a.students)?.name}</p>
                    <p className="text-xs text-muted">{rel<{ name: string }>(a.fee_plans)?.name}</p>
                  </div>
                  <Badge status="overdue" />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-ink">Paid today</h2>
        <div className="mt-3 space-y-2">
          {(paidToday ?? []).length === 0 ? (
            <p className="text-sm text-muted">No payments recorded yet today.</p>
          ) : (
            paidToday?.map((p, i) => {
              const sf = rel<{ students: { name: string } | { name: string }[] | null }>(p.student_fees);
              const name = rel(sf?.students)?.name ?? "Student";
              return (
                <div key={i} className="flex items-center justify-between rounded-md bg-canvas px-3 py-2">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="font-mono-amount text-sm font-semibold text-success">
                    {formatCurrency(Number(p.amount))} · {p.payment_mode}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {(pendingFees ?? []).length > 0 && (
        <Card>
          <h2 className="font-semibold text-ink">Renewal pending</h2>
          <div className="mt-3 space-y-2">
            {(pendingFees ?? []).map((fee) => (
              <div key={fee.id} className="flex items-center justify-between rounded-md bg-canvas px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{rel<{ name: string }>(fee.students)?.name}</p>
                  <p className="text-xs text-muted">
                    {fee.period_label ?? "Fee"} · Due {formatDate(fee.due_date)}
                  </p>
                </div>
                <p className="font-mono-amount text-sm font-semibold">
                  {formatCurrency(Number(fee.pending_amount))}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
