"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import clsx from "clsx";
import type { Locale } from "@/i18n/locales";
import { setLocaleCookie } from "@/lib/locale";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

export function LocaleSwitcher({
  className,
  variant = "default",
}: {
  className?: string;
  /** "onDark"/"onLight" are for permanently-fixed chrome (e.g. the public
   * navbar) - see ThemeToggle's variant doc for why these use fixed brand
   * colors instead of theme-reactive tokens. */
  variant?: "default" | "onDark" | "onLight";
}) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: Locale) {
    if (next === locale) return;
    setLocaleCookie(next);
    startTransition(() => {
      // Soft, RSC-level re-render - no full page reload, no URL change.
      // Every client component re-reads translations from the refreshed
      // NextIntlClientProvider context automatically.
      router.refresh();
    });
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-0.5 rounded-full border p-0.5 text-[0.72rem] font-bold",
        variant === "onDark" && "border-white/20",
        variant === "onLight" && "border-charcoal/20",
        variant === "default" && "border-border-strong",
        isPending && "opacity-60",
        className,
      )}
    >
      {LOCALES.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => handleChange(item.code)}
          disabled={isPending}
          aria-current={item.code === locale || undefined}
          className={clsx(
            "rounded-full px-2.5 py-1 transition-colors",
            item.code === locale
              ? "bg-gold-primary text-white"
              : variant === "onDark"
                ? "text-white/70 hover:text-white"
                : variant === "onLight"
                  ? "text-charcoal/70 hover:text-ink"
                  : "text-text-muted hover:text-text",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
