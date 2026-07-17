// Pure constants only - no `next/headers` import here, so this file is
// safe to import from client components too (unlike request.ts, which
// would break client bundling if imported outside a Server Component).
export const SUPPORTED_LOCALES = ["fr", "en", "ar"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// Matches the backend's APP_FALLBACK_LOCALE=fr (CLAUDE.md §17).
export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isSupportedLocale(value: string | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
