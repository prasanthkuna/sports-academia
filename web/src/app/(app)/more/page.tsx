import Link from "next/link";
import {
  ClipboardList,
  FileSpreadsheet,
  IndianRupee,
  Receipt,
  Settings,
  Users,
  UserSquare2,
} from "lucide-react";

const links = [
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/batches", label: "Batches", icon: ClipboardList },
  { href: "/receipts", label: "Receipts", icon: Receipt },
  { href: "/reports", label: "Reports", icon: FileSpreadsheet },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">More</h1>
        <p className="text-sm text-muted">Additional modules</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-lg bg-surface-card p-4 text-sm font-medium text-ink"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
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
