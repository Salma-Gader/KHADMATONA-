"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPES, type PropertyType } from "@/types/property";

export function HeroSearch() {
  const router = useRouter();
  const t = useTranslations("Properties");
  const propertyType = useTranslations("PropertyType");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<PropertyType | "">("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (type) query.set("type", type);
    router.push(`/properties${query.toString() ? `?${query.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 rounded-xl border border-white/25 bg-white/10 p-2.5 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center"
    >
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t("heroSearchPlaceholder")}
        aria-label={t("searchAriaLabel")}
        className="w-full min-w-0 flex-1 rounded-lg border border-transparent bg-white px-4 py-3.5 text-[0.95rem] text-ink placeholder:text-charcoal/50 transition-shadow focus-visible:border-gold-primary"
      />
      <select
        value={type}
        onChange={(event) => setType(event.target.value as PropertyType | "")}
        aria-label={t("propertyType")}
        className="w-full rounded-lg border border-transparent bg-white px-4 py-3.5 text-[0.95rem] text-ink focus-visible:border-gold-primary sm:w-56"
      >
        <option value="">{t("allTypesLong")}</option>
        {PROPERTY_TYPES.map((value) => (
          <option key={value} value={value}>
            {propertyType(value)}
          </option>
        ))}
      </select>
      <Button
        type="submit"
        size="lg"
        className="w-full shrink-0 hover:-translate-y-0.5 sm:w-auto"
      >
        {t("search")}
      </Button>
    </form>
  );
}
