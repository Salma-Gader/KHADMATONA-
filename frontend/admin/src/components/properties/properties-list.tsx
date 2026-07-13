"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api";
import { listProperties } from "@/lib/properties";
import { Alert } from "@/components/ui/alert";
import { Pagination } from "@/components/ui/pagination";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyCardSkeleton } from "@/components/properties/property-card-skeleton";
import {
  PropertyFilters,
  type PropertyFiltersValue,
} from "@/components/properties/property-filters";
import type { Pagination as PaginationData, Property } from "@/types/property";

function filtersFromSearchParams(params: URLSearchParams): PropertyFiltersValue {
  return {
    search: params.get("search") ?? "",
    type: (params.get("type") as PropertyFiltersValue["type"]) ?? "",
    status: (params.get("status") as PropertyFiltersValue["status"]) ?? "",
    priceMin: params.get("price_min") ?? "",
    priceMax: params.get("price_max") ?? "",
  };
}

export function PropertiesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Properties");
  const errors = useTranslations("Errors");

  const [filters, setFilters] = useState<PropertyFiltersValue>(() =>
    filtersFromSearchParams(searchParams),
  );
  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await listProperties({
          page,
          search: filters.search || undefined,
          type: filters.type || undefined,
          status: filters.status || undefined,
          priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
          priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
        });
        if (cancelled) return;
        setProperties(result.properties);
        setPagination(result.pagination);
      } catch (caught) {
        if (cancelled) return;
        setError(
          caught instanceof ApiError ? caught.message : errors("generic"),
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [page, filters, errors]);

  function handleApply(next: PropertyFiltersValue) {
    setFilters(next);
    setPage(1);

    const query = new URLSearchParams();
    if (next.search) query.set("search", next.search);
    if (next.type) query.set("type", next.type);
    if (next.status) query.set("status", next.status);
    if (next.priceMin) query.set("price_min", next.priceMin);
    if (next.priceMax) query.set("price_max", next.priceMax);
    router.replace(query.toString() ? `/properties?${query.toString()}` : "/properties");
  }

  return (
    <div className="flex flex-col gap-8">
      <PropertyFilters initialValue={filters} onApply={handleApply} />

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border-strong bg-surface-muted p-12 text-center">
          <h3 className="font-display text-xl font-semibold text-text">
            {t("noResultsTitle")}
          </h3>
          <p className="max-w-sm text-text-muted">{t("noResultsSubtitle")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
