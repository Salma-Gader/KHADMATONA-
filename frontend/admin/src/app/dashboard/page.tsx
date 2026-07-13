"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/dashboard/stat-card";
import { FakeBarChart } from "@/components/dashboard/fake-bar-chart";
import { FakeDonutChart } from "@/components/dashboard/fake-donut-chart";
import { PropertyStatusBadge } from "@/components/properties/status-badge";
import { useAuth } from "@/lib/auth-context";
import { listProperties } from "@/lib/properties";
import { PROPERTY_TYPE_LABELS, type Property } from "@/types/property";

// Statistiques d'illustration uniquement - non calculées depuis la base de
// données (portée MVP demandée). La table "Derniers biens ajoutés" plus bas
// est, elle, alimentée par de vraies données MySQL.
const FAKE_STATS = [
  { label: "Nombre total des biens", value: "128" },
  { label: "Biens disponibles", value: "74" },
  { label: "Biens vendus", value: "31" },
  { label: "Biens loués", value: "19" },
  { label: "Revenus mensuels", value: "482 500 MAD" },
  { label: "Nouveaux biens ce mois", value: "12" },
];

const FAKE_MONTHLY_TREND = [
  { label: "Fév", value: 14 },
  { label: "Mar", value: 18 },
  { label: "Avr", value: 22 },
  { label: "Mai", value: 19 },
  { label: "Juin", value: 27 },
  { label: "Juil", value: 12 },
];

const FAKE_STATUS_DISTRIBUTION = [
  { label: "Disponible", value: 74, color: "var(--color-success)" },
  { label: "Vendu", value: 31, color: "var(--color-info)" },
  { label: "Loué", value: 19, color: "var(--color-gold-primary)" },
  { label: "Réservé", value: 4, color: "var(--color-warning)" },
];

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listProperties({ perPage: 5 })
      .then((result) => {
        if (!cancelled) setRecentProperties(result.properties);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les derniers biens.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) return null;

  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          Bienvenue, {firstName}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Aperçu de l&apos;activité immobilière.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {FAKE_STATS.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <p className="mb-4 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            Biens ajoutés par mois
          </p>
          <FakeBarChart data={FAKE_MONTHLY_TREND} />
        </Card>
        <Card>
          <p className="mb-4 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            Répartition par statut
          </p>
          <FakeDonutChart data={FAKE_STATUS_DISTRIBUTION} />
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            Derniers biens ajoutés
          </p>
          <Link
            href="/dashboard/properties"
            className="text-[0.82rem] font-semibold text-gold-primary hover:underline"
          >
            Voir tous les biens →
          </Link>
        </div>

        {error && <Alert tone="error">{error}</Alert>}

        {isLoading ? (
          <p className="text-sm text-text-muted">Chargement…</p>
        ) : recentProperties.length === 0 ? (
          <p className="text-sm text-text-muted">Aucun bien pour le moment.</p>
        ) : (
          <Table>
            <TableHead>
              <TableHeaderCell>Titre</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Ville</TableHeaderCell>
              <TableHeaderCell>Statut</TableHeaderCell>
              <TableHeaderCell className="text-right">Prix</TableHeaderCell>
            </TableHead>
            <TableBody>
              {recentProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-semibold">
                    <Link
                      href={`/dashboard/properties/${property.id}`}
                      className="hover:text-gold-primary hover:underline"
                    >
                      {property.title}
                    </Link>
                  </TableCell>
                  <TableCell>{PROPERTY_TYPE_LABELS[property.type]}</TableCell>
                  <TableCell>{property.city}</TableCell>
                  <TableCell>
                    <PropertyStatusBadge status={property.status} />
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {currencyFormatter.format(property.price)} MAD
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
