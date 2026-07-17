import Link from "next/link";
import { useTranslations } from "next-intl";
import { getSettings } from "@/lib/settings";
import type { Settings } from "@/types/settings";

const SOCIAL_NAMES = ["Facebook", "Instagram", "LinkedIn", "WhatsApp"] as const;

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

const SOCIAL_ICONS: Record<(typeof SOCIAL_NAMES)[number], () => React.JSX.Element> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  WhatsApp: WhatsAppIcon,
};

/**
 * Each platform's own official brand color - a deliberate exception to the
 * site's own 6-color palette (globals.css), since these badges represent
 * someone else's brand identity, not KHADMATONA's. Instagram uses its real
 * multi-stop brand gradient rather than a flat swatch, same as everywhere
 * Instagram's own badge appears.
 */
const SOCIAL_BACKGROUNDS: Record<(typeof SOCIAL_NAMES)[number], string> = {
  Facebook: "#1877F2",
  Instagram: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
  LinkedIn: "#0A66C2",
  WhatsApp: "#25D366",
};

export async function SiteFooter() {
  const settings = await getSettings();

  return <SiteFooterContent settings={settings} />;
}

function SiteFooterContent({ settings }: { settings: Settings }) {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");

  const quickLinks = [
    { href: "/properties", label: t("propertiesLink") },
    { href: "/services", label: nav("services") },
    { href: "/about", label: nav("about") },
    { href: "/contact", label: nav("contact") },
  ];

  const socialLinks: Record<(typeof SOCIAL_NAMES)[number], string | null> = {
    Facebook: settings.social_facebook,
    Instagram: settings.social_instagram,
    LinkedIn: settings.social_linkedin,
    WhatsApp: settings.social_whatsapp,
  };

  const address = settings.address ?? "";
  const mapQuery = encodeURIComponent(address);

  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-5 lg:grid-cols-4 lg:px-6">
        <div>
          <p className="font-display text-xl font-semibold text-text">
            {nav("brand")} <em className="text-gold-primary not-italic">{nav("brandSuffix")}</em>
          </p>
          <p className="mt-3 max-w-xs text-sm text-text-muted">{t("tagline")}</p>

          <p className="mt-5 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("followUs")}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {SOCIAL_NAMES.map((name) => {
              const href = socialLinks[name];
              if (!href) return null;
              const Icon = SOCIAL_ICONS[name];
              return (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  style={{ background: SOCIAL_BACKGROUNDS[name] }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
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
            <li>{address}</li>
            {settings.contact_phone && (
              <li>
                <a
                  href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
                  className="hover:text-gold-primary"
                  dir="ltr"
                >
                  {settings.contact_phone}
                </a>
              </li>
            )}
            {settings.contact_email && (
              <li>
                <a href={`mailto:${settings.contact_email}`} className="hover:text-gold-primary" dir="ltr">
                  {settings.contact_email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("hours")}
          </p>
          <ul className="flex flex-col gap-2 text-sm text-text-muted">
            <li>{settings.business_hours_weekdays}</li>
            <li>{settings.business_hours_saturday}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-10 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("findUs")}
          </p>
          <div className="overflow-hidden rounded-md border border-border shadow-sm">
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
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[0.78rem] text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6">
          <p>
            © {new Date().getFullYear()} {nav("brand")} {nav("brandSuffix")}. {t("rights")}
          </p>
          <p>{t("location")}</p>
        </div>
      </div>
    </footer>
  );
}
