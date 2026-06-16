import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAcademyContext } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppLinkGrid } from "@/components/layout/app-link-grid";
import type { AppLinkItem } from "@/lib/app-icons";
import { formatCurrency, rel } from "@/lib/utils";

export default async function DashboardPage() {
  const ctx = await getAcademyContext();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  await supabase.rpc("mark_overdue_fees");

  const [
    { count: studentCount },
    { data: attendanceToday },
    { data: paymentsToday },
    { data: overdueFees },
    { data: pendingFees },
  ] = await Promise.all([
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("attendance").select("status").eq("attendance_date", today),
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
  ]);

  const present = attendanceToday?.filter((a) => a.status === "present").length ?? 0;
  const absent = attendanceToday?.filter((a) => a.status === "absent").length ?? 0;
  const todayCollection =
    paymentsToday?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const totalPending = pendingFees?.reduce((s, f) => s + Number(f.pending_amount), 0) ?? 0;

  const quick: AppLinkItem[] = [
    { href: "/attendance", label: "Mark Attend", icon: "attendance" },
    { href: "/fees", label: "Collect Fee", icon: "fees" },
    { href: "/students", label: "Add Student", icon: "userPlus" },
    { href: "/leads", label: "Leads", icon: "users" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Dashboard</h1>
        <p className="text-sm text-muted">Today&apos;s academy snapshot</p>
      </div>

      <AppLinkGrid
        items={quick}
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
        itemClassName="p-3 text-center text-xs"
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Active students</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-ink">{studentCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Present today</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-success">{present}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Absent today</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-error">{absent}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Today&apos;s collection</p>
          <p className="mt-2 font-mono-amount text-2xl font-semibold text-ink">
            {formatCurrency(todayCollection)}
          </p>
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
        <Link href="/fees" className="mt-3 inline-block text-sm font-medium text-ink underline">
          View all fees →
        </Link>
      </Card>
    </div>
  );
}
