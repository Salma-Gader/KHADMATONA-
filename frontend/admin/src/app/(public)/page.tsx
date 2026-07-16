import Link from "next/link";
import { useTranslations } from "next-intl";
import { Hero } from "@/components/home/hero";
import { PropertyTypeGrid } from "@/components/home/property-type-grid";
import { SellRentSection } from "@/components/home/sell-rent-section";
import { PropertyCard } from "@/components/properties/property-card";
import { ServiceCard } from "@/components/properties/service-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { listProperties } from "@/lib/properties";
import { getSettings } from "@/lib/settings";
import type { Settings } from "@/types/settings";

// Otherwise this page would be prerendered once at build time and the
// featured listings would never reflect new/updated properties without a
// full rebuild.
export const revalidate = 60;

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path
        d="M12 3.5 5 6v5.5c0 4.4 3 7.9 7 9 4-1.1 7-4.6 7-9V6l-7-2.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m9 12 2.2 2.2L15.5 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path d="m3 11 4-3 4 3-2.5 2.5a1.8 1.8 0 0 0 2.5 2.5L15 12l4 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m17 8 4 3-5 5-3-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: `${settings.hero_title_before} ${settings.hero_title_accent} ${settings.hero_title_after}`,
    description: settings.hero_subtitle,
  };
}

export default async function HomePage() {
  const [{ properties }, settings] = await Promise.all([
    listProperties({ perPage: 6, sort: "-created_at" }),
    getSettings(),
  ]);

  return <HomeContent properties={properties} settings={settings} />;
}

function HomeContent({
  properties,
  settings,
}: {
  properties: Awaited<ReturnType<typeof listProperties>>["properties"];
  settings: Settings;
}) {
  const t = useTranslations("Home");

  const pillars = [
    { title: t("pillar1Title"), description: t("pillar1Description"), icon: <ShieldCheckIcon /> },
    { title: t("pillar2Title"), description: t("pillar2Description"), icon: <HandshakeIcon /> },
    { title: t("pillar3Title"), description: t("pillar3Description"), icon: <ClockIcon /> },
  ];

  const stats = [
    { value: settings.stat1_value ?? "", label: settings.stat1_label ?? "" },
    { value: settings.stat2_value ?? "", label: settings.stat2_label ?? "" },
    { value: settings.stat3_value ?? "", label: settings.stat3_label ?? "" },
    { value: settings.stat4_value ?? "", label: settings.stat4_label ?? "" },
  ];

  return (
    <div className="flex flex-col">
      <Hero
        eyebrow={settings.hero_eyebrow ?? ""}
        titleBefore={settings.hero_title_before ?? ""}
        titleAccent={settings.hero_title_accent ?? ""}
        titleAfter={settings.hero_title_after ?? ""}
        subtitle={settings.hero_subtitle ?? ""}
      />

      <section className="px-4 py-12 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-7xl">
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

      <section className="px-4 py-12 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold text-text">
              {t("browseByTypeTitle")}
            </h2>
          </Reveal>
          <Reveal>
            <PropertyTypeGrid />
          </Reveal>
        </div>
      </section>

      <section className="bg-surface-muted px-4 py-12 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold text-text">{t("pillarsTitle")}</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delayMs={index * 100}>
                <ServiceCard
                  index={index + 1}
                  icon={pillar.icon}
                  title={pillar.title}
                  description={pillar.description}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="vendre-louer" className="scroll-mt-20 px-4 py-12 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-7xl">
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

      <section className="border-t border-border bg-ink px-4 py-12 text-white sm:px-5 lg:px-6">
        <div className="mx-auto max-w-7xl">
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
