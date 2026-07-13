import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  const t = await getTranslations("Services");
  return { title: t("title"), description: t("subtitle") };
}

export default function ServicesPage() {
  const t = useTranslations("Services");

  const services = [
    { title: t("service1Title"), description: t("service1Description") },
    { title: t("service2Title"), description: t("service2Description") },
    { title: t("service3Title"), description: t("service3Description") },
    { title: t("service4Title"), description: t("service4Description") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Reveal>
        <h1 className="font-display text-3xl font-semibold text-text sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-text-muted">{t("subtitle")}</p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {services.map((service, index) => (
          <Reveal key={service.title} delayMs={index * 80}>
            <div className="h-full rounded-lg border border-border bg-surface p-6 shadow-sm">
              <span className="font-mono text-sm text-gold-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 font-display text-xl font-semibold text-text">
                {service.title}
              </h2>
              <p className="mt-2 text-[0.92rem] text-text-muted">
                {service.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 rounded-lg border border-border bg-surface-muted p-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-text">{t("ctaTitle")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-text-muted">{t("ctaSubtitle")}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/properties">
            <Button>{t("ctaSeeProperties")}</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary">{t("ctaContact")}</Button>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
