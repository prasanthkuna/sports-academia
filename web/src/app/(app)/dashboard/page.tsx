import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAcademyContext } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppLinkGrid } from "@/components/layout/app-link-grid";
import type { AppLinkItem } from "@/lib/app-icons";
import { formatCurrency, rel, waLink } from "@/lib/utils";
import { DigestBanner } from "@/components/dashboard/digest-banner";
import { canMutateFees, canViewRenewals } from "@/lib/permissions";

export default async function DashboardPage() {
  const ctx = await getAcademyContext();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const weekAhead = new Date();
  weekAhead.setDate(weekAhead.getDate() + 7);
  const weekStr = weekAhead.toISOString().slice(0, 10);

  await supabase.rpc("sync_assignment_status", { p_academy_id: ctx?.academyId });
  await supabase.rpc("mark_overdue_fees");
  if (ctx?.academyId) {
    await supabase.rpc("generate_recurring_demands", { p_academy_id: ctx.academyId });
  }

  const [
    { data: attendanceToday },
    { data: paymentsToday },
    { data: overdueFees },
    { data: pendingFees },
    { data: digest },
    { count: expiringCount },
  ] = await Promise.all([
    supabase.from("attendance").select("status, source").eq("attendance_date", today),
    supabase.from("payments").select("amount").eq("payment_date", today).eq("status", "active"),
    supabase
      .from("student_fees")
      .select("id, pending_amount, students(name)")
      .in("status", ["overdue"])
      .limit(5),
    supabase
      .from("student_fees")
      .select("pending_amount")
      .in("status", ["pending", "partially_paid", "overdue"]),
    supabase
      .from("owner_digest_snapshots")
      .select("whatsapp_body, sent_at")
      .eq("digest_date", today)
      .maybeSingle(),
    supabase
      .from("student_fees")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "partially_paid"])
      .gte("due_date", today)
      .lte("due_date", weekStr)
      .gt("pending_amount", 0),
  ]);

  const present = attendanceToday?.filter((a) => a.status === "present").length ?? 0;
  const qrCheckIns =
    attendanceToday?.filter((a) => a.status === "present" && a.source === "qr_scan").length ?? 0;
  const manualCheckIns = present - qrCheckIns;
  const todayCollection =
    paymentsToday?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const totalPending = pendingFees?.reduce((s, f) => s + Number(f.pending_amount), 0) ?? 0;

  const quick: AppLinkItem[] = [
    { href: "/attendance", label: "Mark Attend", icon: "attendance" },
    ...(ctx?.role !== "coach" && canViewRenewals(ctx?.role ?? "staff")
      ? [{ href: "/renewals", label: "Renewals", icon: "fees" as const }]
      : []),
    ...(ctx?.role !== "coach" && canMutateFees(ctx?.role ?? "staff")
      ? [{ href: "/fees", label: "Collect Fee", icon: "fees" as const }]
      : []),
    { href: "/students", label: "Students", icon: "userPlus" },
    ...(ctx?.role !== "coach" ? [{ href: "/leads", label: "Leads", icon: "users" as const }] : []),
  ];

  const whatsapp = ctx?.settings?.whatsapp_number;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Dashboard</h1>
          <p className="text-sm text-muted">Renewal snapshot · today&apos;s academy</p>
        </div>
        {canViewRenewals(ctx?.role ?? "staff") && (
          <Link
            href="/renewals"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Full renewal view →
          </Link>
        )}
      </div>

      {digest?.whatsapp_body && whatsapp && (ctx?.role === "admin" || ctx?.role === "owner") && (
        <DigestBanner
          body={digest.whatsapp_body}
          whatsappUrl={waLink(whatsapp, digest.whatsapp_body)}
          sent={!!digest.sent_at}
        />
      )}

      <AppLinkGrid
        items={quick}
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
        itemClassName="p-3 text-center text-xs"
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Collected today</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-brand">
            {formatCurrency(todayCollection)}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Overdue</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-error">
            {overdueFees?.length ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted">students</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Due this week</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-warning">
            {expiringCount ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Present today</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-success">{present}</p>
          {ctx?.plan === "pro" && (
            <p className="mt-1 text-xs text-muted">
              {qrCheckIns} QR · {manualCheckIns} manual
            </p>
          )}
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Needs attention</h2>
          <p className="text-sm text-muted">Pending {formatCurrency(totalPending)}</p>
        </div>
        <div className="space-y-2">
          {(overdueFees ?? []).length === 0 ? (
            <p className="text-sm text-muted">No overdue fees right now.</p>
          ) : (
            overdueFees?.map((fee) => (
              <div
                key={fee.id}
                className="flex items-center justify-between rounded-md bg-canvas px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {rel<{ name: string }>(fee.students)?.name}
                  </p>
                  <Badge status="overdue" />
                </div>
                <p className="font-mono-amount text-sm font-semibold">
                  {formatCurrency(Number(fee.pending_amount))}
                </p>
              </div>
            ))
          )}
        </div>
        {canViewRenewals(ctx?.role ?? "staff") && (
          <Link href="/renewals" className="mt-3 inline-block text-sm font-medium text-ink underline">
            Renewal dashboard →
          </Link>
        )}
      </Card>
    </div>
  );
}
