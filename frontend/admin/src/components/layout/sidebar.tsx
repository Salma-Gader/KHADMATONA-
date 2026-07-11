"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  comingSoon?: boolean;
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" strokeLinecap="round" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6M18.5 19a5 5 0 0 0-4-4.9" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path
        d="M12 3v2m0 14v2M4.2 6.2l1.4 1.4m12.8 12.8 1.4 1.4M3 12h2m14 0h2M4.2 17.8l1.4-1.4m12.8-12.8 1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const items: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: <HomeIcon /> },
  { href: "/dashboard/properties", label: "Properties", icon: <BuildingIcon />, comingSoon: true },
  { href: "/dashboard/users", label: "Users", icon: <UsersIcon />, comingSoon: true },
  { href: "/dashboard/settings", label: "Settings", icon: <SettingsIcon />, comingSoon: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 bg-ink p-5 text-white/70 md:flex">
      <p className="mb-4 px-2 font-display text-xl font-semibold text-white">
        Khadmatona
      </p>
      {items.map((item) => {
        const active = pathname === item.href;
        if (item.comingSoon) {
          return (
            <span
              key={item.href}
              aria-disabled="true"
              className="flex items-center justify-between gap-2 rounded-sm px-3 py-2 text-sm text-white/35"
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] font-bold tracking-wide uppercase">
                Soon
              </span>
            </span>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold transition-colors",
              active
                ? "bg-gold-primary/18 text-gold-secondary"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
