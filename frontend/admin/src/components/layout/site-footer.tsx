import Link from "next/link";
import { useTranslations } from "next-intl";

// Placeholder handles - swap for the real KHADMATONA business accounts
// once they exist.
const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://facebook.com/khadmatona" },
  { name: "Instagram", href: "https://instagram.com/khadmatona" },
  { name: "LinkedIn", href: "https://linkedin.com/company/khadmatona" },
  { name: "WhatsApp", href: "https://wa.me/212600000000" },
] as const;

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path
        d="M14 21v-7h2.5l.5-3H14V9.5A1.5 1.5 0 0 1 15.5 8H17V5.2A19 19 0 0 0 14.6 5C12 5 10.5 6.6 10.5 9.2V11H8v3h2.5v7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.2" cy="7.8" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M8.2 10.5v5.5" strokeLinecap="round" />
      <circle cx="8.2" cy="7.8" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth={1.4} />
      <path
        d="M11.5 16v-3.3c0-1.4 1-2.2 2.1-2.2 1.1 0 1.9.8 1.9 2.2V16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path
        d="M12 21c-1.6 0-3.1-.4-4.4-1.1L4 21l1.1-3.5A8.9 8.9 0 1 1 12 21Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 9.3c0-.5.4-1 1-1h.6c.3 0 .5.2.6.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.4.9 1.1 1.6 2 2l.6-.5c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.4.4.6v.6c0 .6-.5 1-1 1-3.5 0-6.3-2.8-6.3-6.3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SOCIAL_ICONS: Record<(typeof SOCIAL_LINKS)[number]["name"], () => React.JSX.Element> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  WhatsApp: WhatsAppIcon,
};

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");

  const quickLinks = [
    { href: "/properties", label: t("propertiesLink") },
    { href: "/services", label: nav("services") },
    { href: "/about", label: nav("about") },
    { href: "/contact", label: nav("contact") },
  ];

  const mapQuery = encodeURIComponent(t("address"));

  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-xl font-semibold text-text">
            {nav("brand")} <em className="text-gold-primary not-italic">{nav("brandSuffix")}</em>
          </p>
          <p className="mt-3 max-w-xs text-sm text-text-muted">{t("tagline")}</p>

          <p className="mt-5 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("followUs")}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.name];
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-text-muted transition-colors hover:border-gold-primary hover:text-gold-primary"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("navigation")}
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-text-muted hover:text-gold-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("contact")}
          </p>
          <ul className="flex flex-col gap-2 text-sm text-text-muted">
            <li>{t("address")}</li>
            <li>
              <a href="tel:+212500000000" className="hover:text-gold-primary" dir="ltr">
                +212 5 00 00 00 00
              </a>
            </li>
            <li>
              <a href="mailto:contact@khadmatona.ma" className="hover:text-gold-primary" dir="ltr">
                contact@khadmatona.ma
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("hours")}
          </p>
          <ul className="flex flex-col gap-2 text-sm text-text-muted">
            <li>{t("weekdays")}</li>
            <li>{t("saturday")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("findUs")}
          </p>
          <div className="overflow-hidden rounded-lg border border-border shadow-sm">
            <iframe
              title={t("findUs")}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-56 w-full sm:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[0.82rem] font-semibold text-gold-primary hover:underline"
          >
            {t("viewOnMap")}
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-[0.78rem] text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {nav("brand")} {nav("brandSuffix")}. {t("rights")}
          </p>
          <p>{t("location")}</p>
        </div>
      </div>
    </footer>
  );
}
