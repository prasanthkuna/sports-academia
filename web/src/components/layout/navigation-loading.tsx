"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { PageLoader } from "@/components/ui/page-loader";
import { cn } from "@/lib/utils";

type NavigationLoadingContextValue = {
  startNavigation: () => void;
};

const NavigationLoadingContext = createContext<NavigationLoadingContextValue>({
  startNavigation: () => {},
});

export function useNavigationLoading() {
  return useContext(NavigationLoadingContext);
}

/** Wraps authenticated main content — shows brand loader on tab clicks until route updates. */
export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [pathname]);

  return (
    <NavigationLoadingContext.Provider value={{ startNavigation: () => setPending(true) }}>
      <div className="relative min-h-[50vh] flex-1">
        {pending && (
          <div
            className="absolute inset-0 z-20 flex items-start justify-center bg-canvas/85 pt-[18vh] backdrop-blur-[2px] md:pt-[22vh]"
            aria-hidden={!pending}
          >
            <PageLoader />
          </div>
        )}
        {children}
      </div>
    </NavigationLoadingContext.Provider>
  );
}

type AppNavLinkProps = ComponentProps<typeof Link> & {
  active?: boolean;
};

/** In-app link that triggers the shared loader immediately on navigation. */
export function AppNavLink({ href, active, className, onClick, ...props }: AppNavLinkProps) {
  const pathname = usePathname();
  const { startNavigation } = useNavigationLoading();
  const hrefString = typeof href === "string" ? href : href.pathname ?? "";
  const isActive =
    active ??
    (pathname === hrefString || (hrefString !== "/" && pathname.startsWith(`${hrefString}/`)));

  return (
    <Link
      href={href}
      className={cn(className)}
      onClick={(event) => {
        if (!isActive && !event.defaultPrevented) {
          startNavigation();
        }
        onClick?.(event);
      }}
      {...props}
    />
  );
}
