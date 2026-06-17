"use client";

import { useState } from "react";
import { saveFeePlan } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { FEE_PLAN_TYPE_LABELS } from "@/lib/fee-plans";
import type { FeePlanType } from "@/types";

const PLAN_TYPES = Object.keys(FEE_PLAN_TYPE_LABELS) as FeePlanType[];

export function FeePlanForm({
  sports,
  batches,
  feeTypes,
}: {
  sports: { id: string; name: string }[];
  batches: { id: string; name: string }[];
  feeTypes: { id: string; name: string }[];
}) {
  const [planType, setPlanType] = useState<FeePlanType>("monthly");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    fd.set("plan_type", planType);
    await saveFeePlan(fd);
    setSaving(false);
    window.location.reload();
  }

  const showSessions = planType === "session_package" || planType === "personal_coaching";
  const showValidity = planType === "summer_camp" || showSessions;
  const showDueDay = planType === "monthly" || planType === "quarterly";

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="text-xs font-medium text-muted">Plan name</span>
        <input
          name="name"
          required
          placeholder="U12 Monthly Cricket"
          className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-sm"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-muted">Plan type</span>
        <select
          value={planType}
          onChange={(e) => setPlanType(e.target.value as FeePlanType)}
          className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-sm"
        >
          {PLAN_TYPES.map((t) => (
            <option key={t} value={t}>
              {FEE_PLAN_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-medium text-muted">Amount (₹)</span>
        <input
          name="amount"
          type="number"
          required
          min={0}
          step={1}
          className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-sm"
        />
      </label>

      {showDueDay && (
        <label className="block">
          <span className="text-xs font-medium text-muted">Due day of month</span>
          <input
            name="due_day"
            type="number"
            min={1}
            max={28}
            defaultValue={5}
            className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-sm"
          />
        </label>
      )}

      {showSessions && (
        <label className="block">
          <span className="text-xs font-medium text-muted">Total sessions</span>
          <input
            name="total_sessions"
            type="number"
            min={1}
            defaultValue={8}
            className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-sm"
          />
        </label>
      )}

      {showValidity && (
        <label className="block">
          <span className="text-xs font-medium text-muted">Validity (days)</span>
          <input
            name="validity_days"
            type="number"
            min={1}
            defaultValue={planType === "summer_camp" ? 20 : 60}
            className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-sm"
          />
        </label>
      )}

      <label className="block">
        <span className="text-xs font-medium text-muted">Sport (optional)</span>
        <select name="sport_id" className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-sm">
          <option value="">Any</option>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-medium text-muted">Batch (optional)</span>
        <select name="batch_id" className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-sm">
          <option value="">Any</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block sm:col-span-2">
        <span className="text-xs font-medium text-muted">Link to fee type (for receipts)</span>
        <select name="fee_type_id" className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-sm">
          <option value="">Auto from plan name</option>
          {feeTypes.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Create fee plan"}
        </Button>
      </div>
    </form>
  );
}
