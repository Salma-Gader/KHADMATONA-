"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PropertyStatusBadge } from "@/components/properties/status-badge";
import { ApiError } from "@/lib/api";
import { getProperty } from "@/lib/properties";
import { PROPERTY_TYPE_LABELS, type Property } from "@/types/property";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getProperty(id)
      .then((data) => {
        if (!cancelled) setProperty(data);
      })
      .catch((caught) => {
        if (cancelled) return;
        setError(
          caught instanceof ApiError && caught.status === 404
            ? "Ce bien est introuvable."
            : "Impossible de charger ce bien.",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return <p className="text-sm text-text-muted">Chargement…</p>;
  }

  if (error || !property) {
    return <Alert tone="error">{error ?? "Bien introuvable."}</Alert>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/dashboard/properties"
            className="text-sm font-semibold text-gold-primary hover:underline"
          >
            ← Retour à la liste
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold text-balance text-text sm:text-3xl">
            {property.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PropertyStatusBadge status={property.status} />
            <Badge tone="neutral">{PROPERTY_TYPE_LABELS[property.type]}</Badge>
          </div>
        </div>
        <Link href={`/dashboard/properties/${property.id}/edit`} className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto">
            Modifier
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-5 aspect-video overflow-hidden rounded-md bg-surface-muted">
            {property.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- external, arbitrary demo image URL
              <img
                src={property.image}
                alt={property.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-muted">
                Aucune image
              </div>
            )}
          </div>
          <p className="mb-2 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            Description
          </p>
          <p className="max-w-none text-[0.95rem] text-text">
            {property.description ?? "Aucune description."}
          </p>
        </Card>

        <Card>
          <p className="mb-4 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            Détails
          </p>
          <dl className="flex flex-col gap-3 text-sm">
            <Row label="Prix" value={`${currencyFormatter.format(property.price)} MAD`} />
            <Row label="Ville" value={property.city} />
            <Row label="Adresse" value={property.address} />
            <Row label="Surface" value={`${property.surface} m²`} />
            <Row label="Chambres" value={String(property.bedrooms)} />
            <Row label="Salles de bain" value={String(property.bathrooms)} />
            <Row
              label="Ajouté le"
              value={dateFormatter.format(new Date(property.created_at))}
            />
          </dl>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd className="text-right font-semibold text-text">{value}</dd>
    </div>
  );
}
