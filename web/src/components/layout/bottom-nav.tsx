"use client";

import { usePathname } from "next/navigation";
import { AppNavLink } from "@/components/layout/navigation-loading";
import { navItemsForRole } from "@/lib/permissions";
import type { UserRole } from "@/types";
import {
  ClipboardCheck,
  Home,
  IndianRupee,
  LayoutGrid,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof Home> = {
  Dashboard: Home,
  Students: Users,
  Attendance: ClipboardCheck,
  Fees: IndianRupee,
  Renewals: IndianRupee,
  More: LayoutGrid,
};

export function BottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = navItemsForRole(role).map((item) => ({
    ...item,
    icon: iconMap[item.label] ?? Home,
    shortLabel: item.label === "Dashboard" ? "Home" : item.label === "Attendance" ? "Attend" : item.label,
  }));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline-soft bg-canvas pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden">
      <div className={`grid grid-cols-${items.length}`} style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map(({ href, shortLabel, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <AppNavLink
              key={href}
              href={href}
              className={cn(
                "flex min-h-[64px] flex-col items-center justify-center gap-1 text-xs font-medium",
                active ? "text-ink" : "text-muted",
              )}
            >
              <Icon className="h-5 w-5" />
              {shortLabel}
            </AppNavLink>
          );
        })}
      </div>
    </nav>
  );
}
