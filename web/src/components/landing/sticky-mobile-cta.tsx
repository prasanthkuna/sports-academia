"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas/95 p-3 backdrop-blur-md md:hidden">
      <Link
        href="/login?role=owner"
        className="flex h-12 w-full items-center justify-center rounded-md bg-ink text-sm font-semibold text-white"
      >
        Try free demo
      </Link>
    </div>
  );
}
