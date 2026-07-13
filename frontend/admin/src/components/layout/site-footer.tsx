import Link from "next/link";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");

  const quickLinks = [
    { href: "/properties", label: t("propertiesLink") },
    { href: "/services", label: nav("services") },
    { href: "/about", label: nav("about") },
    { href: "/contact", label: nav("contact") },
  ];

  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-xl font-semibold text-text">
            {nav("brand")} <em className="text-gold-primary not-italic">{nav("brandSuffix")}</em>
          </p>
          <p className="mt-3 max-w-xs text-sm text-text-muted">{t("tagline")}</p>
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
