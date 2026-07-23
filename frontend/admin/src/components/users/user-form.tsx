"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { modal } from "@/lib/modal";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/api";
import { listRoles } from "@/lib/users";
import type { UserFormValues } from "@/types/user";

const EMPTY_VALUES: UserFormValues = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "",
};

export function UserForm({
  initialValues,
  isEditing = false,
  submitLabel,
  onSubmit,
}: {
  initialValues?: UserFormValues;
  /** Password becomes optional (blank = keep current) once editing. */
  isEditing?: boolean;
  submitLabel: string;
  onSubmit: (values: UserFormValues) => Promise<void>;
}) {
  const t = useTranslations("UserForm");
  const [values, setValues] = useState<UserFormValues>(initialValues ?? EMPTY_VALUES);
  const [roles, setRoles] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    listRoles()
      .then((data) => {
        if (cancelled) return;
        setRoles(data);
        // Only default to the first role for a brand-new (create) form -
        // an edit form already has the user's real role from initialValues,
        // which this must not clobber once the role list arrives.
        if (data.length > 0 && !initialValues?.role) {
          setValues((current) => ({ ...current, role: current.role || data[0] }));
        }
      })
      .catch(() => {
        if (!cancelled) modal.error(t("rolesLoadError"));
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initialValues/t are stable for the form's lifetime
  }, []);

  function set<K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
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
        modal.error(caught instanceof ApiError ? caught.message : t("genericError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Field
        label={t("name")}
        required
        value={values.name}
        onChange={(event) => set("name", event.target.value)}
        error={fieldErrors.name}
      />

      <Field
        label={t("email")}
        type="email"
        required
        dir="ltr"
        value={values.email}
        onChange={(event) => set("email", event.target.value)}
        error={fieldErrors.email}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label={t("password")}
          type="password"
          required={!isEditing}
          hint={isEditing ? t("passwordHint") : undefined}
          value={values.password}
          onChange={(event) => set("password", event.target.value)}
          error={fieldErrors.password}
        />
        <Field
          label={t("passwordConfirmation")}
          type="password"
          required={!isEditing}
          value={values.password_confirmation}
          onChange={(event) => set("password_confirmation", event.target.value)}
        />
      </div>

      <Select
        label={t("role")}
        required
        value={values.role}
        onChange={(event) => set("role", event.target.value)}
        error={fieldErrors.role}
      >
        {roles.length === 0 && <option value="">{t("loadingRoles")}</option>}
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </Select>

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
