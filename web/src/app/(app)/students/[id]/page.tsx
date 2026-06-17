import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate, rel } from "@/lib/utils";
import { getAcademyContext } from "@/lib/auth";
import { studentCheckInUrl } from "@/lib/qr-urls";
import { CollectFeeButton } from "@/components/fees/collect-fee-button";
import { AssignFeePlanForm } from "@/components/fees/assign-fee-plan-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { RegenerateQrButton } from "@/components/students/regenerate-qr-button";
import { canManageFeePlans } from "@/lib/permissions";
import { FEE_PLAN_TYPE_LABELS } from "@/lib/fee-plans";
import type { FeePlanType, FeePlan } from "@/types";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("students")
    .select("*, sports(name), batch_students(batches(name))")
    .eq("id", id)
    .single();

  if (!student) notFound();

  const ctx = await getAcademyContext();
  const checkInUrl =
    student.qr_token && ctx?.academySlug
      ? studentCheckInUrl(ctx.academySlug, student.qr_token)
      : null;

  const [{ data: fees }, { data: receipts }, { data: attendance }, { data: assignments }, { data: plans }] =
    await Promise.all([
    supabase
      .from("student_fees")
      .select("*, fee_types(name), fee_plans(name)")
      .eq("student_id", id)
      .order("due_date", { ascending: false }),
    supabase
      .from("receipts")
      .select("*, payments(amount, payment_date, student_fees(student_id))")
      .order("created_at", { ascending: false }),
    supabase
      .from("attendance")
      .select("*")
      .eq("student_id", id)
      .order("attendance_date", { ascending: false })
      .limit(10),
    supabase
      .from("student_fee_assignments")
      .select("*, fee_plans(name, plan_type, amount)")
      .eq("student_id", id)
      .order("start_date", { ascending: false }),
    supabase.from("fee_plans").select("*").eq("is_active", true).order("name"),
  ]);

  const studentReceipts =
    receipts?.filter((r) => {
      const payment = rel<{ amount: number; payment_date: string; student_fees: { student_id: string } | null }>(r.payments);
      return rel<{ student_id: string }>(payment?.student_fees)?.student_id === id;
    }) ?? [];

  const phone = student.whatsapp ?? student.mobile;

  return (
    <div className="space-y-6">
      <Link href="/students" className="text-sm text-muted hover:text-ink">
        ← Students
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-lg font-semibold text-brand">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-ink">{student.name}</h1>
              <Badge status={student.status} />
            </div>
            <p className="font-mono-amount text-sm text-muted">{student.student_code}</p>
            <p className="text-sm text-muted">
              Parent: {student.parent_name} · {student.mobile}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <CollectFeeButton studentId={id} fees={fees ?? []} />
          <WhatsAppButton
            studentId={id}
            phone={phone}
            parentName={student.parent_name}
            studentName={student.name}
          />
          {ctx?.plan === "pro" && checkInUrl && (
            <>
              <a
                href={checkInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-md border border-brand px-4 text-sm font-semibold text-brand"
              >
                QR check-in link
              </a>
              {ctx.role === "admin" && <RegenerateQrButton studentId={id} />}
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold text-ink">Fee plans</h2>
          <div className="space-y-2">
            {(assignments ?? []).map((a) => {
              const plan = rel<{ name: string; plan_type: FeePlanType; amount: number }>(a.fee_plans);
              const remaining =
                a.sessions_total != null ? a.sessions_total - a.sessions_used : null;
              return (
                <div key={a.id} className="rounded-md bg-canvas px-3 py-2 text-sm">
                  <div className="flex justify-between">
                    <p className="font-medium">{plan?.name}</p>
                    <Badge status={a.status} label={a.status} />
                  </div>
                  <p className="text-xs text-muted">
                    {plan ? FEE_PLAN_TYPE_LABELS[plan.plan_type] : ""} · from{" "}
                    {formatDate(a.start_date)}
                    {a.end_date ? ` · ends ${formatDate(a.end_date)}` : ""}
                  </p>
                  {remaining != null && (
                    <p className="mt-1 text-xs font-medium text-ink">
                      {remaining} sessions remaining ({a.sessions_used}/{a.sessions_total})
                    </p>
                  )}
                </div>
              );
            })}
            {(assignments ?? []).length === 0 && (
              <p className="text-sm text-muted">No fee plan assigned.</p>
            )}
          </div>
          {ctx && canManageFeePlans(ctx.role) && (
            <AssignFeePlanForm studentId={id} plans={(plans ?? []) as FeePlan[]} />
          )}
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold text-ink">Fees & demands</h2>
          <div className="space-y-2">
            {(fees ?? []).map((fee) => (
              <div key={fee.id} className="flex justify-between rounded-md bg-canvas px-3 py-2 text-sm">
                <div>
                  <p className="font-medium">
                    {fee.period_label ??
                      rel<{ name: string }>(fee.fee_plans)?.name ??
                      rel<{ name: string }>(fee.fee_types)?.name}
                  </p>
                  <p className="text-xs text-muted">Due {formatDate(fee.due_date)}</p>
                </div>
                <div className="text-right">
                  <Badge status={fee.status} />
                  <p className="font-mono-amount mt-1 font-semibold">
                    {formatCurrency(Number(fee.pending_amount))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold text-ink">Recent attendance</h2>
          <div className="space-y-2">
            {(attendance ?? []).map((a) => (
              <div key={a.id} className="flex justify-between text-sm">
                <span>{formatDate(a.attendance_date)}</span>
                <Badge status={a.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="mb-3 font-semibold text-ink">Receipts</h2>
          <div className="space-y-2">
            {studentReceipts.map((r) => {
              const payment = rel<{ amount: number }>(r.payments);
              return (
              <div key={r.id} className="flex justify-between rounded-md bg-canvas px-3 py-2 text-sm">
                <span className="font-mono-amount">{r.receipt_number}</span>
                <span className="font-mono-amount font-semibold">
                  {formatCurrency(Number(payment?.amount ?? 0))}
                </span>
              </div>
            );})}
            {studentReceipts.length === 0 && (
              <p className="text-sm text-muted">No receipts yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
