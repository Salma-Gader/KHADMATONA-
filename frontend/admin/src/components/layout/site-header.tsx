"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  href: string;
  label: string;
  icon: (props: { className?: string }) => ReactElement;
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

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeNavIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PropertiesNavIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path d="M4 20V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 20v-8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20h16M7 8h1M7 12h1M7 16h1" strokeLinecap="round" />
    </svg>
  );
}

function ServicesNavIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AboutNavIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 11v5.2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ContactNavIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-11Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4.5 6.5 7.5 6 7.5-6" strokeLinecap="round" strokeLinejoin="round" />
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
    { href: "/", label: t("home"), icon: HomeNavIcon },
    { href: "/properties", label: t("properties"), icon: PropertiesNavIcon },
    { href: "/services", label: t("services"), icon: ServicesNavIcon },
    { href: "/about", label: t("about"), icon: AboutNavIcon },
    { href: "/contact", label: t("contact"), icon: ContactNavIcon },
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
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-paper/90 text-ink shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-gold-primary transition-opacity hover:opacity-85"
          onClick={() => setOpen(false)}
        >
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight text-ink">{t("brand")}</span>
            <span className="text-[0.62rem] font-bold tracking-[0.24em] text-charcoal/60 uppercase">
              {t("brandSuffix")}
            </span>
          </span>
        </Link>

        <nav aria-label={t("mainNavigation")} className="hidden items-center gap-6 text-sm font-semibold lg:flex">
          {items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative flex items-center gap-1.5 py-1 transition-colors after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:origin-center after:scale-x-0 after:bg-gold-primary after:transition-transform after:duration-300 hover:after:scale-x-100",
                  active ? "text-gold-primary after:scale-x-100" : "text-charcoal/75 hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle variant="onLight" />
          <LocaleSwitcher variant="onLight" />
          {isAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-full border border-charcoal/20 px-3.5 py-1.5 text-[0.8rem] font-bold text-charcoal/80 transition-all hover:border-gold-primary hover:text-gold-primary"
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
          <ThemeToggle variant="onLight" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("openMenu")}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-mist"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile drawer - overlay/slide-in/Escape-close, RTL-aware (slides
          from the trailing edge via `end-0`, and the closed-state
          transform direction flips via the `rtl:` variant). Light to match
          the header's fixed-light chrome. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={clsx(
          "fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("mobileMenu")}
        className={clsx(
          "fixed inset-y-0 end-0 z-50 flex w-72 max-w-[85vw] flex-col gap-1 bg-paper p-5 text-ink shadow-2xl",
          "transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-ink">{t("menu")}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("closeMenu")}
            className="rounded-md p-1 text-charcoal/70 transition-colors hover:bg-mist hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label={t("mobileMenu")} className="flex flex-col gap-1">
          {items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-gold-primary/12 text-gold-primary"
                    : "text-charcoal/75 hover:bg-mist hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

        </nav>
        <div className="mt-3">
          <LocaleSwitcher variant="onLight" className="w-full justify-center" />
        </div>
        <Link href="/#vendre-louer" onClick={() => setOpen(false)} className="mt-3">
          <Button className="w-full">{t("sellOrRent")}</Button>
        </Link>
      </div>
    </header>
  );
}
