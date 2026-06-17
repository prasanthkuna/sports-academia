import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAcademyContext } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import { canManageFeePlans } from "@/lib/permissions";
import { FEE_PLAN_TYPE_LABELS } from "@/lib/fee-plans";
import { FeePlanForm } from "@/components/fees/fee-plan-form";
import type { FeePlanType } from "@/types";
import { rel } from "@/lib/utils";

export default async function FeePlansPage() {
  const ctx = await getAcademyContext();
  if (!ctx || !canManageFeePlans(ctx.role)) redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: plans }, { data: sports }, { data: batches }, { data: feeTypes }] =
    await Promise.all([
      supabase
        .from("fee_plans")
        .select("*, sports(name), batches(name)")
        .order("name"),
      supabase.from("sports").select("id, name").eq("is_active", true),
      supabase.from("batches").select("id, name").eq("is_active", true),
      supabase.from("fee_types").select("id, name").eq("is_active", true),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Fee plans</h1>
          <p className="text-sm text-muted">
            Monthly, quarterly, session packages, camps — assign to students for auto demands
          </p>
        </div>
        <Link
          href="/renewals"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Renewal dashboard
        </Link>
      </div>

      <Card>
        <h2 className="font-semibold text-ink">Create plan</h2>
        <div className="mt-4">
          <FeePlanForm sports={sports ?? []} batches={batches ?? []} feeTypes={feeTypes ?? []} />
        </div>
      </Card>

      <div className="space-y-2">
        <h2 className="font-semibold text-ink">Active plans ({plans?.length ?? 0})</h2>
        {(plans ?? []).length === 0 ? (
          <p className="text-sm text-muted">No fee plans yet. Create one above.</p>
        ) : (
          plans?.map((plan) => (
            <Card key={plan.id} className="!p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-ink">{plan.name}</p>
                  <p className="text-sm text-muted">
                    {FEE_PLAN_TYPE_LABELS[plan.plan_type as FeePlanType]} ·{" "}
                    {formatCurrency(Number(plan.amount))}
                    {plan.total_sessions ? ` · ${plan.total_sessions} sessions` : ""}
                    {plan.validity_days ? ` · ${plan.validity_days} days` : ""}
                  </p>
                  <p className="text-xs text-muted">
                    {rel<{ name: string }>(plan.sports)?.name && (
                      <span>{rel<{ name: string }>(plan.sports)?.name} · </span>
                    )}
                    {rel<{ name: string }>(plan.batches)?.name ?? "All batches"}
                    {plan.due_day ? ` · Due day ${plan.due_day}` : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    plan.is_active ? "bg-success-soft text-success" : "bg-surface-soft text-muted"
                  }`}
                >
                  {plan.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
