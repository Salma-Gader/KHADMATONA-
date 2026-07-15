import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { LeadForm } from "@/components/leads/lead-form";
import { PropertyStatusBadge } from "@/components/properties/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { getProperty } from "@/lib/properties";

export const revalidate = 60;

const currencyFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

async function loadProperty(id: string) {
  try {
    return await getProperty(id);
  } catch (caught) {
    if (caught instanceof ApiError && caught.status === 404) {
      notFound();
    }
    throw caught;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await loadProperty(id);
  const propertyType = await getTranslations("PropertyType");

  return {
    title: property.title,
    description: `${propertyType(property.type)} à ${property.city_name} — ${property.surface} m², ${property.bedrooms} chambres.`,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await loadProperty(id);

  return <PropertyDetailContent property={property} />;
}

function PropertyDetailContent({ property }: { property: Awaited<ReturnType<typeof loadProperty>> }) {
  const t = useTranslations("PropertyDetail");
  const propertyType = useTranslations("PropertyType");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Link href="/properties" className="text-sm font-semibold text-gold-primary hover:underline">
        {t("backToList")}
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-balance font-display text-3xl font-semibold text-text sm:text-4xl">
            {property.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PropertyStatusBadge status={property.status} />
            <Badge tone="neutral">{propertyType(property.type)}</Badge>
          </div>
        </div>
        <p className="font-mono text-2xl font-semibold tabular-nums text-text" dir="ltr">
          {currencyFormatter.format(property.price)}{" "}
          <span className="text-sm font-semibold text-text-muted">MAD</span>
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div>
            <div className="aspect-video overflow-hidden rounded-lg bg-surface-muted">
              {property.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element -- media-library-served image
                <img
                  src={property.cover_image}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted">
                  {t("noImage")}
                </div>
              )}
            </div>
            {property.images.length > 1 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {property.images.map((image) => (
                  // eslint-disable-next-line @next/next/no-img-element -- media-library-served thumbnail
                  <img
                    key={image.id}
                    src={image.url}
                    alt=""
                    className="h-16 w-16 rounded-md object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <Card>
            <p className="mb-4 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
              {t("features")}
            </p>
            <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <Spec label={t("bedrooms")} value={String(property.bedrooms)} />
              <Spec label={t("bathrooms")} value={String(property.bathrooms)} />
              <Spec label={t("surface")} value={`${property.surface} m²`} />
              <Spec
                label={t("city")}
                value={
                  property.district_name
                    ? `${property.district_name}, ${property.city_name}`
                    : (property.city_name ?? "—")
                }
              />
            </dl>
          </Card>

          <Card>
            <p className="mb-2 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
              {t("description")}
            </p>
            <p className="text-[0.95rem] leading-relaxed text-text">
              {property.description ?? t("noDescription")}
            </p>
            <p className="mt-4 text-[0.8rem] text-text-muted">
              {t("addressPublished", {
                address: property.address,
                date: dateFormatter.format(new Date(property.created_at)),
              })}
            </p>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <h2 className="font-display text-xl font-semibold text-text">
              {t("visitRequestTitle")}
            </h2>
            <p className="mt-1 mb-5 text-[0.85rem] text-text-muted">
              {property.title} — {property.city_name}
            </p>
            <LeadForm
              type="visit_request"
              propertyId={property.id}
              submitLabel={t("requestVisit")}
              messagePlaceholder={t("visitMessagePlaceholder")}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.72rem] text-text-muted uppercase">{label}</dt>
      <dd className="mt-0.5 font-semibold text-text">{value}</dd>
    </div>
  );
}
