import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Hero } from "@/components/home/hero";
import { SellRentSection } from "@/components/home/sell-rent-section";
import { PropertyCard } from "@/components/properties/property-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { listProperties } from "@/lib/properties";

// Otherwise this page would be prerendered once at build time and the
// featured listings would never reflect new/updated properties without a
// full rebuild.
export const revalidate = 60;

export async function generateMetadata() {
  const t = await getTranslations("Home");
  return { title: t("heroTitle"), description: t("heroSubtitle") };
}

export default async function HomePage() {
  const { properties } = await listProperties({ perPage: 6, sort: "-created_at" });

  return <HomeContent properties={properties} />;
}

function HomeContent({ properties }: { properties: Awaited<ReturnType<typeof listProperties>>["properties"] }) {
  const t = useTranslations("Home");

  const pillars = [
    { title: t("pillar1Title"), description: t("pillar1Description") },
    { title: t("pillar2Title"), description: t("pillar2Description") },
    { title: t("pillar3Title"), description: t("pillar3Description") },
  ];

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <div className="flex flex-col">
      <Hero eyebrow={t("eyebrow")} title={t("heroTitle")} subtitle={t("heroSubtitle")} />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-text">
                {t("featuredTitle")}
              </h2>
              <p className="mt-1 text-text-muted">{t("featuredSubtitle")}</p>
            </div>
            <Link href="/properties" className="text-sm font-semibold text-gold-primary hover:underline">
              {t("seeAllProperties")}
            </Link>
          </Reveal>

          {properties.length === 0 ? (
            <p className="text-text-muted">{t("noPropertiesYet")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property, index) => (
                <Reveal key={property.id} delayMs={index * 60}>
                  <PropertyCard property={property} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-surface-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold text-text">{t("pillarsTitle")}</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delayMs={index * 100}>
                <div className="h-full rounded-lg border border-border bg-surface p-6 shadow-sm">
                  <span className="font-mono text-sm text-gold-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold text-text">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-[0.92rem] text-text-muted">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="vendre-louer" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold text-text">
              {t("sellRentTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-text-muted">{t("sellRentSubtitle")}</p>
          </Reveal>
          <Reveal>
            <SellRentSection />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-ink px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-3xl font-semibold text-gold-secondary tabular-nums">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="mt-1 text-[0.8rem] text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="max-w-xl text-white/80">{t("ctaText")}</p>
            <Link href="/contact">
              <Button size="lg">{t("ctaButton")}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
