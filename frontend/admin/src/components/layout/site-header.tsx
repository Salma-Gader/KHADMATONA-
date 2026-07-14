"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  href: string;
  label: string;
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
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

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path
        d="M12 3.5 5 6v5.5c0 4.4 3 7.9 7 9 4-1.1 7-4.6 7-9V6l-7-2.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m9 12 2.2 2.2L15.5 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations("Nav");
  const { user } = useAuth();
  const isAdmin = Boolean(user?.roles?.includes("Admin"));

  const items: NavItem[] = [
    { href: "/", label: t("home") },
    { href: "/properties", label: t("properties") },
    { href: "/services", label: t("services") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Body scroll lock while the mobile drawer is open - a premium detail
  // that also prevents the page from scrolling "through" the overlay.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 text-white shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-ink/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 font-display text-xl font-semibold text-white transition-opacity hover:opacity-85"
          onClick={() => setOpen(false)}
        >
          {t("brand")} <em className="text-gold-secondary not-italic">{t("brandSuffix")}</em>
        </Link>

        <nav aria-label={t("mainNavigation")} className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          {items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative py-1 transition-colors after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:origin-center after:scale-x-0 after:bg-gold-secondary after:transition-transform after:duration-300 hover:after:scale-x-100",
                  active ? "text-gold-secondary after:scale-x-100" : "text-white/75 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle variant="onDark" />
          <LocaleSwitcher variant="onDark" />
          {isAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-[0.8rem] font-bold text-white/90 transition-all hover:border-gold-secondary hover:text-gold-secondary"
            >
              <ShieldIcon />
              {t("administration")}
            </Link>
          )}
          <Link href="/#vendre-louer">
            <Button size="sm">{t("sellOrRent")}</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle variant="onDark" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("openMenu")}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile drawer - overlay/slide-in/Escape-close, RTL-aware (slides
          from the trailing edge via `end-0`, and the closed-state
          transform direction flips via the `rtl:` variant). Dark to match
          the header, so the "premium dark" chrome carries through. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={clsx(
          "fixed inset-0 z-40 bg-ink/60 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("mobileMenu")}
        className={clsx(
          "fixed inset-y-0 end-0 z-50 flex w-72 max-w-[85vw] flex-col gap-1 bg-[#111111] p-5 text-white shadow-2xl",
          "transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
        )}
        style={{ backgroundColor: "#111111" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-white">{t("menu")}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("closeMenu")}
            className="rounded-md p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label={t("mobileMenu")} className="flex flex-col gap-1">
          {items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-sm px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-gold-primary/18 text-gold-secondary"
                    : "text-white/75 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}

        </nav>
        <div className="mt-3">
          <LocaleSwitcher variant="onDark" className="w-full justify-center" />
        </div>
        <Link href="/#vendre-louer" onClick={() => setOpen(false)} className="mt-3">
          <Button className="w-full">{t("sellOrRent")}</Button>
        </Link>
      </div>
    </header>
  );
}
