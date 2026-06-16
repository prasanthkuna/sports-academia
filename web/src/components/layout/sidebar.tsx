"use client";

import { usePathname, useRouter } from "next/navigation";
import { AppNavLink } from "@/components/layout/navigation-loading";
import {
  ClipboardCheck,
  Home,
  IndianRupee,
  LayoutGrid,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/students", label: "Students", icon: Users },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/fees", label: "Fees", icon: IndianRupee },
  { href: "/more", label: "More", icon: LayoutGrid },
];

export function Sidebar({ academyName }: { academyName: string }) {
  const pathname = usePathname();
  const router = useRouter();

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
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map(({ href, label, icon: Icon }) => {
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
