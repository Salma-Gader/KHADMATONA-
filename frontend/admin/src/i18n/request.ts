import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isSupportedLocale, LOCALE_COOKIE, type Locale } from "./locales";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;

  let locale: Locale;
  if (isSupportedLocale(cookieLocale)) {
    locale = cookieLocale;
  } else {
    // No stored preference yet (first visit) - honor the browser's
    // Accept-Language before falling back, same precedence the backend's
    // SetLocale middleware already uses for guests.
    const acceptLanguage = (await headers()).get("accept-language") ?? "";
    const preferred = acceptLanguage.split(",")[0]?.split("-")[0];
    locale = isSupportedLocale(preferred) ? preferred : DEFAULT_LOCALE;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
