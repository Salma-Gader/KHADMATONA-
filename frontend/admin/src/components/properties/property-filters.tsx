"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { listCities } from "@/lib/lookup";
import {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type PropertyStatus,
  type PropertyType,
} from "@/types/property";
import type { City } from "@/types/lookup";

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

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-text">{t("budget")}</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={value.priceMin}
              onChange={(event) => setValue((v) => ({ ...v, priceMin: event.target.value }))}
              placeholder={t("min")}
              className="w-full min-w-0 rounded-sm border-[1.5px] border-border-strong bg-surface px-3 py-2.5 text-[0.9rem] text-text focus-visible:border-gold-primary"
            />
            <span className="text-text-muted">–</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={value.priceMax}
              onChange={(event) => setValue((v) => ({ ...v, priceMax: event.target.value }))}
              placeholder={t("max")}
              className="w-full min-w-0 rounded-sm border-[1.5px] border-border-strong bg-surface px-3 py-2.5 text-[0.9rem] text-text focus-visible:border-gold-primary"
            />
          </div>
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
