import type { AssignmentStatus, FeeStatus } from "@/types";

export type StudentFeeAlert = {
  studentId: string;
  level: "error" | "warning" | "info";
  message: string;
};

type AssignmentRow = {
  id: string;
  student_id: string;
  status: AssignmentStatus;
  end_date: string | null;
  sessions_total: number | null;
  sessions_used: number;
  fee_plans: { name: string; plan_type: string } | { name: string; plan_type: string }[] | null;
};

type FeeRow = {
  student_id: string;
  status: FeeStatus;
  pending_amount: number;
  due_date: string;
};

export function buildStudentFeeAlerts(
  studentId: string,
  assignments: AssignmentRow[],
  fees: FeeRow[],
  today: string,
): StudentFeeAlert[] {
  const alerts: StudentFeeAlert[] = [];
  const weekAhead = new Date(today);
  weekAhead.setDate(weekAhead.getDate() + 7);
  const weekStr = weekAhead.toISOString().slice(0, 10);

  for (const a of assignments.filter((x) => x.student_id === studentId)) {
    const plan = Array.isArray(a.fee_plans) ? a.fee_plans[0] : a.fee_plans;
    if (a.status === "expired") {
      alerts.push({ studentId, level: "error", message: `Package expired${plan ? ` · ${plan.name}` : ""}` });
    } else if (a.end_date && a.end_date <= weekStr && a.end_date >= today) {
      alerts.push({
        studentId,
        level: "warning",
        message: `Renewal due ${a.end_date === today ? "today" : a.end_date}`,
      });
    }
    if (a.sessions_total != null) {
      const remaining = a.sessions_total - a.sessions_used;
      if (remaining <= 0) {
        alerts.push({ studentId, level: "error", message: "No sessions remaining" });
      } else if (remaining <= 2) {
        alerts.push({ studentId, level: "warning", message: `${remaining} session${remaining === 1 ? "" : "s"} remaining` });
      }
    }
  }

  const openFees = fees.filter(
    (f) =>
      f.student_id === studentId &&
      Number(f.pending_amount) > 0 &&
      ["pending", "partially_paid", "overdue"].includes(f.status),
  );

  for (const f of openFees) {
    if (f.status === "overdue") {
      alerts.push({ studentId, level: "error", message: `Fee overdue · ₹${Number(f.pending_amount).toLocaleString("en-IN")}` });
    } else if (f.due_date <= weekStr) {
      alerts.push({
        studentId,
        level: "warning",
        message: `Renewal due ${f.due_date === today ? "today" : f.due_date}`,
      });
    }
  }

  return alerts;
}

export function alertsForStudent(alerts: StudentFeeAlert[], studentId: string) {
  return alerts.filter((a) => a.studentId === studentId);
}
