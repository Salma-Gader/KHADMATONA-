"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Subtle fade+rise on every route change - keyed on the pathname so React
 * remounts (and thus replays the CSS animation on) the wrapped subtree
 * each navigation. Respects prefers-reduced-motion globally (globals.css).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
