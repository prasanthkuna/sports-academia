"use client";

import { AppIcon } from "@/components/layout/app-icon";
import { AppNavLink } from "@/components/layout/navigation-loading";
import type { AppLinkItem } from "@/lib/app-icons";
import { cn } from "@/lib/utils";

type AppLinkGridProps = {
  items: AppLinkItem[];
  className?: string;
  itemClassName?: string;
};

/** Grid of in-app links — triggers shared brand loader on navigation. */
export function AppLinkGrid({ items, className, itemClassName }: AppLinkGridProps) {
  return (
    <div className={className}>
      {items.map(({ href, label, icon }) => (
        <AppNavLink
          key={href}
          href={href}
          className={cn(
            "flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-lg bg-surface-card p-4 text-sm font-medium text-ink",
            itemClassName,
          )}
        >
          <AppIcon name={icon} className="h-5 w-5" />
          {label}
        </AppNavLink>
      ))}
    </div>
  );
}
