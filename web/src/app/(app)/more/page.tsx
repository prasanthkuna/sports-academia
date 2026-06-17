import { AppLinkGrid } from "@/components/layout/app-link-grid";
import type { AppLinkItem } from "@/lib/app-icons";
import { getAcademyContext } from "@/lib/auth";
import { canAccess } from "@/lib/permissions";

export default async function MorePage() {
  const ctx = await getAcademyContext();
  const role = ctx?.role ?? "staff";

  const links: AppLinkItem[] = [];
  if (canAccess(role, "fee_plans")) links.push({ href: "/fee-plans", label: "Fee plans", icon: "fees" });
  if (canAccess(role, "leads")) links.push({ href: "/leads", label: "Leads", icon: "users" });
  if (canAccess(role, "batches")) links.push({ href: "/batches", label: "Batches", icon: "batches" });
  if (canAccess(role, "receipts")) links.push({ href: "/receipts", label: "Receipts", icon: "receipt" });
  if (canAccess(role, "reports")) links.push({ href: "/reports", label: "Reports", icon: "reports" });
  if (canAccess(role, "team")) links.push({ href: "/team", label: "Team", icon: "users" });
  if (canAccess(role, "import")) links.push({ href: "/import", label: "Excel import", icon: "reports" });
  if (canAccess(role, "id_cards")) links.push({ href: "/id-cards", label: "ID cards", icon: "userPlus" });
  if (canAccess(role, "reminders")) links.push({ href: "/reminders", label: "Reminders", icon: "fees" });
  if (canAccess(role, "audit")) links.push({ href: "/audit", label: "Audit logs", icon: "settings" });
  if (canAccess(role, "settings")) links.push({ href: "/settings", label: "Settings", icon: "settings" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">More</h1>
        <p className="text-sm text-muted">Modules & configuration</p>
      </div>
      <AppLinkGrid items={links} className="grid grid-cols-2 gap-3 md:grid-cols-3" itemClassName="p-4" />
    </div>
  );
}
