import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  paid: "bg-success-soft text-success",
  present: "bg-success-soft text-success",
  pending: "bg-surface-card text-muted",
  partially_paid: "bg-warning-soft text-warning",
  partial: "bg-warning-soft text-warning",
  overdue: "bg-error-soft text-error",
  absent: "bg-error-soft text-error",
  late: "bg-warning-soft text-warning",
  active: "bg-success-soft text-success",
  inactive: "bg-surface-card text-muted",
  expired: "bg-error-soft text-error",
  completed: "bg-surface-card text-muted",
  cancelled: "text-muted line-through",
};

export function Badge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[status] ?? "bg-surface-card text-muted",
        className,
      )}
    >
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}
