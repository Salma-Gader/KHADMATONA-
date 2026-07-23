"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { modal } from "@/lib/modal";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { submitLead } from "@/lib/leads";
import type { LeadType } from "@/types/lead";

export function LeadForm({
  type,
  propertyId,
  submitLabel,
  messagePlaceholder,
  showMessage = true,
}: {
  type: LeadType;
  propertyId?: number;
  submitLabel?: string;
  messagePlaceholder?: string;
  showMessage?: boolean;
}) {
  const t = useTranslations("Leads");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await submitLead({ type, name, email, phone, message, property_id: propertyId });
      setSent(true);
    } catch (caught) {
      if (caught instanceof ApiError && Object.keys(caught.errors).length > 0) {
        const flattened: Record<string, string> = {};
        for (const [field, messages] of Object.entries(caught.errors)) {
          flattened[field] = messages[0];
        }
        setFieldErrors(flattened);
      } else {
        modal.error(caught instanceof ApiError ? caught.message : t("genericError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sent) {
    return (
      <Alert tone="success" title={t("sentTitle")}>
        {t("sentBody", { name: name.split(" ")[0] })}
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label={t("fullName")}
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={fieldErrors.name}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label={t("email")}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
        />
        <Field
          label={t("phone")}
          type="tel"
          placeholder={t("phonePlaceholder")}
          dir="ltr"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={fieldErrors.phone}
          hint={t("optional")}
        />
      </div>
      {showMessage && (
        <Textarea
          label={t("message")}
          placeholder={messagePlaceholder ?? t("messagePlaceholder")}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          error={fieldErrors.message}
        />
      )}

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {submitLabel ?? t("send")}
      </Button>
    </form>
  );
}
