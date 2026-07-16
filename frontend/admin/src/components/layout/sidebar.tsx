"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { useEffect, type ReactNode } from "react";

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

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path
        d="M11.5 4H6a2 2 0 0 0-2 2v5.5a2 2 0 0 0 .6 1.4l7.5 7.5a2 2 0 0 0 2.8 0l5.5-5.5a2 2 0 0 0 0-2.8L12.9 4.6A2 2 0 0 0 11.5 4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.2" cy="8.2" r="1.1" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="8" cy="15" r="3.5" />
      <path d="M10.5 12.5 18 5m0 0v3.5M18 5h-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function renderItem(
  item: NavItem,
  pathname: string,
  onClose: () => void,
  soonLabel: string,
) {
  const active =
    item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);

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
          {soonLabel}
        </span>
      </span>
    );
  }

  return (
    <Link
      key={item.href}
      href={item.href}
      onClick={onClose}
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
}

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");
  const nav = useTranslations("Nav");

  const items: NavItem[] = [
    { href: "/dashboard", label: t("overview"), icon: <HomeIcon /> },
    { href: "/dashboard/properties", label: t("properties"), icon: <BuildingIcon /> },
  ];

  const leadItems: NavItem[] = [
    { href: "/dashboard/leads/contact", label: t("contactMessages"), icon: <MailIcon /> },
    { href: "/dashboard/leads/sell", label: t("saleRequests"), icon: <TagIcon /> },
    { href: "/dashboard/leads/rent", label: t("rentalRequests"), icon: <KeyIcon /> },
    { href: "/dashboard/leads/visit", label: t("visitRequests"), icon: <CalendarIcon /> },
  ];

  const trailingItems: NavItem[] = [
    { href: "/dashboard/users", label: t("users"), icon: <UsersIcon /> },
    { href: "/dashboard/settings", label: t("settings"), icon: <SettingsIcon /> },
  ];

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Mobile/tablet overlay - dismisses the drawer on outside click. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-40 bg-ink/50 transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={clsx(
          "fixed inset-y-0 start-0 z-50 flex w-72 max-w-[85vw] shrink-0 flex-col gap-1 overflow-y-auto bg-ink p-5 text-white/70",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "max-lg:-translate-x-full max-lg:rtl:translate-x-full",
          "lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-60 lg:max-w-none",
        )}
      >
        <div className="mb-4 flex items-center justify-between px-2">
          <Link
            href="/"
            onClick={onClose}
            className="font-display text-xl font-semibold text-white transition-opacity hover:opacity-80"
          >
            {nav("brand")}
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={nav("closeMenu")}
            className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>
        {items.map((item) => renderItem(item, pathname, onClose, t("soon")))}

        <p className="mt-3 mb-1 px-3 text-[0.68rem] font-bold tracking-wide text-white/40 uppercase">
          {t("leads")}
        </p>
        {leadItems.map((item) => renderItem(item, pathname, onClose, t("soon")))}

        <div className="mt-3 border-t border-white/10 pt-3">
          {trailingItems.map((item) => renderItem(item, pathname, onClose, t("soon")))}
        </div>
      </aside>
    </>
  );
}
