"use client";

import { usePathname } from "next/navigation";
import { AppNavLink } from "@/components/layout/navigation-loading";
import {
  ClipboardCheck,
  Home,
  IndianRupee,
  LayoutGrid,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/students", label: "Students", icon: Users },
  { href: "/attendance", label: "Attend", icon: ClipboardCheck },
  { href: "/fees", label: "Fees", icon: IndianRupee },
  { href: "/more", label: "More", icon: LayoutGrid },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline-soft bg-canvas pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden">
      <div className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
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
              {label}
            </AppNavLink>
          );
        })}
      </div>
    </nav>
  );
}
