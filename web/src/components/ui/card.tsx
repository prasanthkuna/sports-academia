import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-lg bg-surface-card p-4 md:p-6", className)}>{children}</div>
  );
}
