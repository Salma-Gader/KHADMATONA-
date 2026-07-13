"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type PropertyFormValues,
  type PropertyStatus,
  type PropertyType,
} from "@/types/property";

const EMPTY_VALUES: PropertyFormValues = {
  title: "",
  type: "appartement",
  status: "disponible",
  city: "",
  address: "",
  price: 0,
  surface: 0,
  bedrooms: 0,
  bathrooms: 0,
  description: "",
  image: "",
};

export function PropertyForm({
  initialValues,
  submitLabel,
  onSubmit,
}: {
  initialValues?: Partial<PropertyFormValues>;
  submitLabel: string;
  onSubmit: (values: PropertyFormValues) => Promise<void>;
}) {
  const t = useTranslations("PropertyForm");
  const propertyType = useTranslations("PropertyType");
  const propertyStatus = useTranslations("PropertyStatus");
  const [values, setValues] = useState<PropertyFormValues>({
    ...EMPTY_VALUES,
    ...initialValues,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function set<K extends keyof PropertyFormValues>(
    key: K,
    value: PropertyFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (caught) {
      if (caught instanceof ApiError && Object.keys(caught.errors).length > 0) {
        const flattened: Record<string, string> = {};
        for (const [field, messages] of Object.entries(caught.errors)) {
          flattened[field] = messages[0];
        }
        setFieldErrors(flattened);
      } else {
        setFormError(caught instanceof ApiError ? caught.message : t("genericError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {formError && <Alert tone="error">{formError}</Alert>}

      <Field
        label={t("title")}
        required
        value={values.title}
        onChange={(event) => set("title", event.target.value)}
        error={fieldErrors.title}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select
          label={t("propertyType")}
          value={values.type}
          onChange={(event) => set("type", event.target.value as PropertyType)}
          error={fieldErrors.type}
        >
          {PROPERTY_TYPES.map((value) => (
            <option key={value} value={value}>
              {propertyType(value)}
            </option>
          ))}
        </Select>

        <Select
          label={t("status")}
          value={values.status}
          onChange={(event) =>
            set("status", event.target.value as PropertyStatus)
          }
          error={fieldErrors.status}
        >
          {PROPERTY_STATUSES.map((value) => (
            <option key={value} value={value}>
              {propertyStatus(value)}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label={t("city")}
          required
          value={values.city}
          onChange={(event) => set("city", event.target.value)}
          error={fieldErrors.city}
        />
        <Field
          label={t("address")}
          required
          value={values.address}
          onChange={(event) => set("address", event.target.value)}
          error={fieldErrors.address}
        />
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        <Field
          label={t("price")}
          type="number"
          min={0}
          required
          value={values.price}
          onChange={(event) => set("price", Number(event.target.value))}
          error={fieldErrors.price}
        />
        <Field
          label={t("surface")}
          type="number"
          min={0}
          required
          value={values.surface}
          onChange={(event) => set("surface", Number(event.target.value))}
          error={fieldErrors.surface}
        />
        <Field
          label={t("bedrooms")}
          type="number"
          min={0}
          value={values.bedrooms}
          onChange={(event) => set("bedrooms", Number(event.target.value))}
          error={fieldErrors.bedrooms}
        />
        <Field
          label={t("bathrooms")}
          type="number"
          min={0}
          value={values.bathrooms}
          onChange={(event) => set("bathrooms", Number(event.target.value))}
          error={fieldErrors.bathrooms}
        />
      </div>

      <Field
        label={t("image")}
        value={values.image}
        onChange={(event) => set("image", event.target.value)}
        error={fieldErrors.image}
        hint={t("imageHint")}
      />

      <Textarea
        label={t("description")}
        value={values.description}
        onChange={(event) => set("description", event.target.value)}
        error={fieldErrors.description}
      />

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
