"use client";

import { useState } from "react";
import { assignFeePlan } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { FEE_PLAN_TYPE_LABELS } from "@/lib/fee-plans";
import type { FeePlan } from "@/types";

export function AssignFeePlanForm({
  studentId,
  plans,
}: {
  studentId: string;
  plans: FeePlan[];
}) {
  const [saving, setSaving] = useState(false);
  const activePlans = plans.filter((p) => p.is_active);

  if (activePlans.length === 0) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    fd.set("student_id", studentId);
    await assignFeePlan(fd);
    setSaving(false);
    window.location.reload();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-lg border border-hairline bg-surface-soft p-4">
      <p className="text-sm font-semibold text-ink">Assign fee plan</p>
      <label className="block">
        <span className="text-xs text-muted">Plan</span>
        <select
          name="fee_plan_id"
          required
          className="mt-1 h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm"
        >
          {activePlans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} · ₹{p.amount} ({FEE_PLAN_TYPE_LABELS[p.plan_type]})
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs text-muted">Start date</span>
        <input
          name="start_date"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="mt-1 h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm"
        />
      </label>
      <Button type="submit" disabled={saving}>
        {saving ? "Assigning…" : "Assign plan"}
      </Button>
    </form>
  );
}
