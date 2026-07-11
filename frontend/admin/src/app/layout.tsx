import type { Metadata } from "next";
import { Cormorant, IBM_Plex_Mono, Manrope } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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

export const metadata: Metadata = {
  title: "KHADMATONA Admin",
  description: "KHADMATONA GROUP back-office",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* Browser extensions (grammar checkers, security/ad-block tools)
          commonly inject attributes into <html>/<body> before React
          hydrates, which otherwise trips a false-positive hydration
          mismatch warning here - see https://react.dev/link/hydration-mismatch */}
      <body className="min-h-full" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
