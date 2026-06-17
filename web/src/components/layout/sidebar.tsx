"use client";

import { usePathname, useRouter } from "next/navigation";
import { AppNavLink } from "@/components/layout/navigation-loading";
import { navItemsForRole } from "@/lib/permissions";
import type { UserRole } from "@/types";
import { createClient } from "@/lib/supabase/client";
import {
  ClipboardCheck,
  Home,
  IndianRupee,
  LayoutGrid,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  Dashboard: Home,
  Students: Users,
  Attendance: ClipboardCheck,
  Fees: IndianRupee,
  Renewals: IndianRupee,
  More: LayoutGrid,
};

export function Sidebar({
  academyName,
  role,
  plan,
}: {
  academyName: string;
  role: UserRole;
  plan: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const items = navItemsForRole(role);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-60 shrink-0 border-r border-hairline-soft bg-canvas md:flex md:flex-col">
      <div className="border-b border-hairline-soft px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Academy</p>
        <p className="mt-1 truncate text-sm font-semibold text-ink">{academyName}</p>
        <p className="mt-0.5 text-xs text-brand">{plan === "pro" ? "Pro" : "Starter"}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map(({ href, label }) => {
          const Icon = iconMap[label as keyof typeof iconMap] ?? Home;
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <AppNavLink
              key={href}
              href={href}
              className={cn(
                "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium",
                active
                  ? "border-l-[3px] border-brand bg-brand-soft pl-[9px] text-ink"
                  : "text-muted hover:bg-surface-soft hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </AppNavLink>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className="m-3 flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted hover:bg-surface-soft hover:text-ink"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
}
