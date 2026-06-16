import { IndianRupee, UserSquare2 } from "lucide-react";
import { AppLinkGrid } from "@/components/layout/app-link-grid";
import type { AppLinkItem } from "@/lib/app-icons";

const links: AppLinkItem[] = [
  { href: "/leads", label: "Leads", icon: "users" },
  { href: "/batches", label: "Batches", icon: "batches" },
  { href: "/receipts", label: "Receipts", icon: "receipt" },
  { href: "/reports", label: "Reports", icon: "reports" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">More</h1>
        <p className="text-sm text-muted">Additional modules</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <AppLinkGrid items={links} className="contents" itemClassName="p-4" />
        <div className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-lg bg-surface-card p-4 text-sm font-medium text-muted">
          <IndianRupee className="h-5 w-5" />
          WhatsApp (soon)
        </div>
        <div className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-lg bg-surface-card p-4 text-sm font-medium text-muted">
          <UserSquare2 className="h-5 w-5" />
          ID Cards (soon)
        </div>
      </div>
    </div>
  );
}
