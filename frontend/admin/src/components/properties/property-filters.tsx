"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RangeSlider } from "@/components/ui/range-slider";
import { listCities } from "@/lib/lookup";
import {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type PropertyStatus,
  type PropertyType,
} from "@/types/property";
import type { City } from "@/types/lookup";

// Matches the top real bucket boundary used by the homepage's price-range
// dropdown (hero-search.tsx's PRICE_RANGES.over6m) - keeps this slider's
// bounds consistent with that other price-filtering UI.
const PRICE_MIN = 0;
const PRICE_MAX = 6_000_000;
const PRICE_STEP = 50_000;

const budgetFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export interface PropertyFiltersValue {
  search: string;
  type: PropertyType | "";
  status: PropertyStatus | "";
  cityId: string;
  priceMin: string;
  priceMax: string;
}

export const EMPTY_PROPERTY_FILTERS: PropertyFiltersValue = {
  search: "",
  type: "",
  status: "",
  cityId: "",
  priceMin: "",
  priceMax: "",
};

export function PropertyFilters({
  initialValue = EMPTY_PROPERTY_FILTERS,
  onApply,
}: {
  initialValue?: PropertyFiltersValue;
  onApply: (value: PropertyFiltersValue) => void;
}) {
  const t = useTranslations("Properties");
  const propertyType = useTranslations("PropertyType");
  const propertyStatus = useTranslations("PropertyStatus");
  const [value, setValue] = useState<PropertyFiltersValue>(initialValue);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    let cancelled = false;
    listCities()
      .then((result) => {
        if (!cancelled) setCities(result);
      })
      .catch(() => {
        // Non-blocking - filtering by city just won't be available if this fails.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply(value);
  }

  function handleReset() {
    setValue(EMPTY_PROPERTY_FILTERS);
    onApply(EMPTY_PROPERTY_FILTERS);
  }

  const budgetRange: [number, number] = [
    value.priceMin === "" ? PRICE_MIN : Number(value.priceMin),
    value.priceMax === "" ? PRICE_MAX : Number(value.priceMax),
  ];

  function handleBudgetChange([min, max]: [number, number]) {
    setValue((v) => ({
      ...v,
      priceMin: min === PRICE_MIN ? "" : String(min),
      priceMax: max === PRICE_MAX ? "" : String(max),
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-border bg-surface p-4 shadow-sm sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="flex flex-col gap-2 lg:col-span-2">
          <label htmlFor="filter-search" className="text-sm font-bold text-text">
            {t("search")}
          </label>
          <input
            id="filter-search"
            type="search"
            value={value.search}
            onChange={(event) => setValue((v) => ({ ...v, search: event.target.value }))}
            placeholder={t("searchPlaceholder")}
            className="w-full min-w-0 rounded-sm border-[1.5px] border-border-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-text focus-visible:border-gold-primary"
          />
        </div>

        <Select
          label={t("location")}
          value={value.cityId}
          onChange={(event) => setValue((v) => ({ ...v, cityId: event.target.value }))}
        >
          <option value="">{t("allLocations")}</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </Select>

        <Select
          label={t("propertyType")}
          value={value.type}
          onChange={(event) =>
            setValue((v) => ({ ...v, type: event.target.value as PropertyType | "" }))
          }
        >
          <option value="">{t("allTypes")}</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {propertyType(type)}
            </option>
          ))}
        </Select>

        <Select
          label={t("status")}
          value={value.status}
          onChange={(event) =>
            setValue((v) => ({ ...v, status: event.target.value as PropertyStatus | "" }))
          }
        >
          <option value="">{t("allStatuses")}</option>
          {PROPERTY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {propertyStatus(status)}
            </option>
          ))}
        </Select>

        <div className="flex flex-col justify-center lg:col-span-2">
          <RangeSlider
            label={t("budget")}
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={budgetRange}
            onChange={handleBudgetChange}
            formatValue={(amount) => `${budgetFormatter.format(amount)} DH`}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="submit">{t("applyFilters")}</Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          {t("resetFilters")}
        </Button>
      </div>
    </form>
  );
}
