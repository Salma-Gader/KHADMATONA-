import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Arabic, Manrope, Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

// Bold, geometric headline face matching the reference brand look -
// replaces the previous serif display face. Weights cover the site's
// existing font-semibold (600) heading usage plus headroom for a bolder
// hero if needed later.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// The design system's own artifact flags this gap explicitly: "Production
// should self-host a matching-weight Arabic UI face (e.g. IBM Plex Sans
// Arabic or Noto Kufi Arabic) rather than relying on system fallback."
// Same type family as IBM Plex Mono for brand consistency. Wired into
// --font-display/--font-body under [dir="rtl"] in globals.css, so every
// existing font-display/font-body usage picks it up automatically.
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "KHADMATONA Group — Biens immobiliers premium à Marrakech",
    template: "%s · KHADMATONA Group",
  },
  description:
    "KHADMATONA Group vous accompagne dans l'achat, la vente et la location de biens immobiliers premium à Marrakech.",
};

// Reads localStorage synchronously before first paint and applies the
// stored theme immediately - without this, the page would flash the
// default (light) theme for a frame before React hydrates and corrects it.
const NO_FLASH_THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("khadmatona-theme");
    var theme = stored === "dark" || stored === "light" ? stored : null;
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${poppins.variable} ${manrope.variable} ${ibmPlexMono.variable} ${ibmPlexSansArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      {/* Browser extensions (grammar checkers, security/ad-block tools)
          commonly inject attributes into <html>/<body> before React
          hydrates, which otherwise trips a false-positive hydration
          mismatch warning here - see https://react.dev/link/hydration-mismatch */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
