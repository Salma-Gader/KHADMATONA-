"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RangeSlider } from "@/components/ui/range-slider";
import { listCities } from "@/lib/lookup";
import { PROPERTY_TYPES, type PropertyType } from "@/types/property";
import type { City } from "@/types/lookup";

// Matches property-filters.tsx's budget slider bounds - keeps the two price
// filtering UIs (hero quick-search, full filters panel) in sync.
const PRICE_MIN = 0;
const PRICE_MAX = 6_000_000;
const PRICE_STEP = 50_000;

const budgetFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

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

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[16px] w-[16px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-1 px-6 py-3">
      <span className="text-[0.72rem] font-extrabold tracking-[0.04em] text-white/70">{label}</span>
      {children}
    </div>
  );
}

function SelectWithChevron({
  value,
  onChange,
  ariaLabel,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="w-full min-w-0 appearance-none bg-transparent pe-7 text-base font-extrabold text-white outline-none [&>option]:text-ink"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center text-white/70">
        <ChevronDownIcon />
      </span>
    </div>
  );
}

export function HeroSearch() {
  const router = useRouter();
  const t = useTranslations("Properties");
  const propertyType = useTranslations("PropertyType");
  const [cities, setCities] = useState<City[]>([]);
  const [cityId, setCityId] = useState<string>("");
  const [type, setType] = useState<PropertyType | "">("");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);

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
    if (priceRange[0] !== PRICE_MIN) query.set("price_min", String(priceRange[0]));
    if (priceRange[1] !== PRICE_MAX) query.set("price_max", String(priceRange[1]));
    router.push(`/properties${query.toString() ? `?${query.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 sm:gap-0 sm:flex-row sm:items-stretch sm:overflow-hidden sm:rounded-lg sm:bg-ink/95 sm:shadow-2xl sm:backdrop-blur-xl"
    >
      <div className="rounded-xl bg-ink/95 shadow-lg backdrop-blur-xl sm:rounded-none sm:bg-transparent sm:shadow-none sm:backdrop-blur-none sm:border-e sm:border-white/10">
        <SearchField label={t("location")}>
          <SelectWithChevron value={cityId} onChange={setCityId} ariaLabel={t("location")}>
            <option value="">{t("allLocations")}</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </SelectWithChevron>
        </SearchField>
      </div>

      <div className="rounded-xl bg-ink/95 shadow-lg backdrop-blur-xl sm:rounded-none sm:bg-transparent sm:shadow-none sm:backdrop-blur-none sm:border-e sm:border-white/10">
        <SearchField label={t("propertyType")}>
          <SelectWithChevron
            value={type}
            onChange={(next) => setType(next as PropertyType | "")}
            ariaLabel={t("propertyType")}
          >
            <option value="">{t("allTypesLong")}</option>
            {PROPERTY_TYPES.map((value) => (
              <option key={value} value={value}>
                {propertyType(value)}
              </option>
            ))}
          </SelectWithChevron>
        </SearchField>
      </div>

      <div className="rounded-xl bg-ink/95 shadow-lg backdrop-blur-xl sm:min-w-[17rem] sm:flex-[1.4] sm:rounded-none sm:bg-transparent sm:shadow-none sm:backdrop-blur-none sm:border-e sm:border-white/10">
        <div className="px-6 py-3">
          <RangeSlider
            label={t("priceRange")}
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={priceRange}
            onChange={setPriceRange}
            formatValue={(amount) => `${budgetFormatter.format(amount)} DH`}
            variant="onDark"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full shrink-0 !rounded-xl !bg-gold-primary !py-3 !text-base !font-extrabold !text-white hover:!bg-gold-secondary sm:!rounded-none sm:w-auto sm:!bg-white sm:!text-ink sm:hover:!bg-mist"
      >
        <SearchIcon />
        {t("search")}
      </Button>
    </form>
  );
}
