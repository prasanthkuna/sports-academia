"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportReportExcel } from "@/app/actions";
import type { AcademyPlan } from "@/lib/plans";
import type { UserRole } from "@/types";
import { canExport } from "@/lib/permissions";

export function ReportsExport({
  plan,
  role,
  from,
  to,
}: {
  plan: AcademyPlan;
  role: UserRole;
  from: string;
  to: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  if (!canExport(role, plan)) return null;

  async function download(type: string) {
    setLoading(type);
    try {
      const b64 = await exportReportExcel(type, from, to);
      const a = document.createElement("a");
      a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${b64}`;
      a.download = `${type}-report.xlsx`;
      a.click();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(["financial", "attendance", "leads"] as const).map((t) => (
        <Button key={t} type="button" variant="ghost" disabled={!!loading} onClick={() => download(t)}>
          {loading === t ? "…" : `Export ${t}`}
        </Button>
      ))}
    </div>
  );
}
