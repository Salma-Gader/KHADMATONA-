"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { listCities } from "@/lib/lookup";
import { PROPERTY_TYPES, type PropertyType } from "@/types/property";
import type { City } from "@/types/lookup";

type PriceRange = "" | "under1m" | "1to3m" | "3to6m" | "over6m";

const PRICE_RANGES: Record<Exclude<PriceRange, "">, { min?: number; max?: number }> = {
  under1m: { max: 1_000_000 },
  "1to3m": { min: 1_000_000, max: 3_000_000 },
  "3to6m": { min: 3_000_000, max: 6_000_000 },
  over6m: { min: 6_000_000 },
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[16px] w-[16px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" strokeLinecap="round" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.2" />
    </svg>
  );
}

function SearchField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <span className="text-[0.62rem] font-bold tracking-[0.08em] text-white/55 uppercase">{label}</span>
      {children}
    </div>
  );
}

const selectClasses =
  "w-full min-w-0 rounded-md border border-transparent bg-white px-3 py-2.5 text-[0.86rem] text-ink focus-visible:border-gold-primary";

export function HeroSearch() {
  const router = useRouter();
  const t = useTranslations("Properties");
  const propertyType = useTranslations("PropertyType");
  const [cities, setCities] = useState<City[]>([]);
  const [cityId, setCityId] = useState<string>("");
  const [type, setType] = useState<PropertyType | "">("");
  const [priceRange, setPriceRange] = useState<PriceRange>("");

  useEffect(() => {
    let cancelled = false;
    listCities()
      .then((result) => {
        if (!cancelled) setCities(result);
      })
      .catch(() => {
        // Non-blocking - the search still works without the city list,
        // it just falls back to "all cities".
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams();
    if (cityId) query.set("city_id", cityId);
    if (type) query.set("type", type);
    if (priceRange) {
      const range = PRICE_RANGES[priceRange];
      if (range.min !== undefined) query.set("price_min", String(range.min));
      if (range.max !== undefined) query.set("price_max", String(range.max));
    }
    router.push(`/properties${query.toString() ? `?${query.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-md bg-ink/95 p-3 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-end sm:gap-2.5"
    >
      <SearchField label={t("location")}>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-charcoal/40">
            <LocationPinIcon />
          </span>
          <select
            value={cityId}
            onChange={(event) => setCityId(event.target.value)}
            aria-label={t("location")}
            className={clsx(selectClasses, "ps-8")}
          >
            <option value="">{t("allLocations")}</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </SearchField>

      <SearchField label={t("propertyType")}>
        <select
          value={type}
          onChange={(event) => setType(event.target.value as PropertyType | "")}
          aria-label={t("propertyType")}
          className={selectClasses}
        >
          <option value="">{t("allTypesLong")}</option>
          {PROPERTY_TYPES.map((value) => (
            <option key={value} value={value}>
              {propertyType(value)}
            </option>
          ))}
        </select>
      </SearchField>

      <SearchField label={t("priceRange")}>
        <select
          value={priceRange}
          onChange={(event) => setPriceRange(event.target.value as PriceRange)}
          aria-label={t("priceRange")}
          className={selectClasses}
        >
          <option value="">{t("anyPrice")}</option>
          <option value="under1m">{t("priceRangeUnder1M")}</option>
          <option value="1to3m">{t("priceRange1MTo3M")}</option>
          <option value="3to6m">{t("priceRange3MTo6M")}</option>
          <option value="over6m">{t("priceRangeOver6M")}</option>
        </select>
      </SearchField>

      <Button type="submit" size="md" className="w-full shrink-0 sm:w-auto">
        <SearchIcon />
        {t("search")}
      </Button>
    </form>
  );
}
