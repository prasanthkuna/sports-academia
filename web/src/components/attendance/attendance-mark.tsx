"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { saveAttendance } from "@/app/actions";
import { cn } from "@/lib/utils";

type RosterRow = {
  batch_id: string;
  student_id: string;
  students: { id: string; name: string; student_code: string } | { id: string; name: string; student_code: string }[] | null;
};

export function AttendanceMark({
  batches,
  roster,
  existing,
  defaultDate,
  defaultBatchId,
}: {
  batches: { id: string; name: string }[];
  roster: RosterRow[];
  existing: { batch_id: string; student_id: string; status: string }[];
  defaultDate: string;
  defaultBatchId?: string;
}) {
  const [batchId, setBatchId] = useState(defaultBatchId ?? batches[0]?.id ?? "");
  const [date, setDate] = useState(defaultDate);
  const [saving, setSaving] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    existing.forEach((e) => {
      if (e.batch_id === batchId) init[e.student_id] = e.status;
    });
    return init;
  });

  const students = useMemo(() => {
    return roster
      .filter((r) => r.batch_id === batchId)
      .map((r) => {
        const s = r.students;
        if (!s) return null;
        return Array.isArray(s) ? s[0] : s;
      })
      .filter(Boolean) as { id: string; name: string; student_code: string }[];
  }, [roster, batchId]);

  function setStatus(studentId: string, status: string) {
    setStatusMap((m) => ({ ...m, [studentId]: status }));
  }

  function markAllPresent() {
    const next: Record<string, string> = {};
    students.forEach((s) => {
      next[s.id] = "present";
    });
    setStatusMap(next);
  }

  async function onSave() {
    setSaving(true);
    const records = students.map((s) => ({
      student_id: s.id,
      status: statusMap[s.id] ?? "present",
    }));
    await saveAttendance(batchId, date, records);
    setSaving(false);
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="h-11 rounded-md border border-hairline px-3 text-sm"
        >
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 rounded-md border border-hairline px-3 text-sm"
        />
      </div>

      <Button type="button" variant="secondary" onClick={markAllPresent}>
        Mark all present
      </Button>

      <div className="space-y-2">
        {students.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-2 rounded-lg border border-hairline-soft bg-canvas p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-ink">{s.name}</p>
              <p className="text-xs text-muted">{s.student_code}</p>
            </div>
            <div className="flex gap-1 rounded-full bg-surface-soft p-1">
              {(["present", "absent", "late"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(s.id, st)}
                  className={cn(
                    "min-h-[44px] flex-1 rounded-md px-3 text-xs font-semibold capitalize sm:min-h-[36px]",
                    statusMap[s.id] === st
                      ? st === "present"
                        ? "bg-success-soft text-success"
                        : st === "absent"
                          ? "bg-error-soft text-error"
                          : "bg-warning-soft text-warning"
                      : "text-muted",
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button type="button" className="w-full" onClick={onSave} disabled={saving || !batchId}>
        {saving ? "Saving…" : "Save attendance"}
      </Button>
    </div>
  );
}
