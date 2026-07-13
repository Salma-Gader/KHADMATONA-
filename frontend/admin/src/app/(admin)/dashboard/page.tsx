"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useAuth } from "@/lib/auth-context";
import { listProperties } from "@/lib/properties";
import type { Property } from "@/types/property";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const t = useTranslations("Dashboard");
  const propertyType = useTranslations("PropertyType");
  const propertyStatus = useTranslations("PropertyStatus");
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
        if (!cancelled) setError(t("loadRecentError"));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `t` is stable per locale render, re-running on every render would refetch needlessly
  }, []);

  if (!user) return null;

  const firstName = user.name.split(" ")[0];

  // Statistiques d'illustration uniquement - non calculées depuis la base de
  // données (portée MVP demandée). La table "Derniers biens ajoutés" plus bas
  // est, elle, alimentée par de vraies données MySQL.
  const fakeStats = [
    { label: t("totalProperties"), value: "128" },
    { label: t("availableProperties"), value: "74" },
    { label: t("soldProperties"), value: "31" },
    { label: t("rentedProperties"), value: "19" },
    { label: t("monthlyRevenue"), value: "482 500 MAD" },
    { label: t("newPropertiesThisMonth"), value: "12" },
  ];

  const fakeMonthlyTrend = [
    { label: t("chartMonth1"), value: 14 },
    { label: t("chartMonth2"), value: 18 },
    { label: t("chartMonth3"), value: 22 },
    { label: t("chartMonth4"), value: 19 },
    { label: t("chartMonth5"), value: 27 },
    { label: t("chartMonth6"), value: 12 },
  ];

  const fakeStatusDistribution = [
    { label: propertyStatus("disponible"), value: 74, color: "var(--color-success)" },
    { label: propertyStatus("vendu"), value: 31, color: "var(--color-info)" },
    { label: propertyStatus("loue"), value: 19, color: "var(--color-gold-primary)" },
    { label: propertyStatus("reserve"), value: 4, color: "var(--color-warning)" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          {t("welcome", { name: firstName })}
        </h1>
        <p className="mt-1 text-sm text-text-muted">{t("welcomeSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {fakeStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <p className="mb-4 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("propertiesAddedPerMonth")}
          </p>
          <FakeBarChart data={fakeMonthlyTrend} />
        </Card>
        <Card>
          <p className="mb-4 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("statusDistribution")}
          </p>
          <FakeDonutChart data={fakeStatusDistribution} />
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            {t("latestProperties")}
          </p>
          <Link
            href="/dashboard/properties"
            className="text-[0.82rem] font-semibold text-gold-primary hover:underline"
          >
            {t("seeAllProperties")}
          </Link>
        </div>

        {error && <Alert tone="error">{error}</Alert>}

        {isLoading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : recentProperties.length === 0 ? (
          <p className="text-sm text-text-muted">{t("noPropertiesYet")}</p>
        ) : (
          <Table>
            <TableHead>
              <TableHeaderCell>{t("title")}</TableHeaderCell>
              <TableHeaderCell>{t("type")}</TableHeaderCell>
              <TableHeaderCell>{t("city")}</TableHeaderCell>
              <TableHeaderCell>{t("status")}</TableHeaderCell>
              <TableHeaderCell className="text-end">{t("price")}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {recentProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="max-w-[240px] truncate font-semibold">
                    <Link
                      href={`/dashboard/properties/${property.id}`}
                      className="hover:text-gold-primary hover:underline"
                    >
                      {property.title}
                    </Link>
                  </TableCell>
                  <TableCell>{propertyType(property.type)}</TableCell>
                  <TableCell>{property.city}</TableCell>
                  <TableCell>
                    <PropertyStatusBadge status={property.status} />
                  </TableCell>
                  <TableCell className="text-end font-mono tabular-nums">
                    <bdi dir="ltr">{currencyFormatter.format(property.price)} MAD</bdi>
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
