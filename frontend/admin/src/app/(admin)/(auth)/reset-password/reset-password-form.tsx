"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { api, ApiError } from "@/lib/api";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!token || !email) {
    return (
      <Alert tone="error" title={t("invalidResetLinkTitle")}>
        {t.rich("invalidResetLinkBody", {
          link: (chunks) => (
            <Link href="/forgot-password" className="underline">
              {chunks}
            </Link>
          ),
        })}
      </Alert>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);
    setIsSubmitting(true);

    try {
      await api.post("/api/v1/auth/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      router.push("/login?reset=success");
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.errors).length > 0) {
        setFieldErrors({
          password: error.fieldError("password") ?? "",
          email: error.fieldError("email") ?? "",
        });
      } else {
        setFormError(error instanceof ApiError ? error.message : t("genericError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h2 className="mb-1 font-display text-2xl font-semibold text-text">
        {t("newPasswordTitle")}
      </h2>
      <p className="mb-6 text-sm text-text-muted">{t("newPasswordFor", { email })}</p>

      {(formError || fieldErrors.email) && (
        <div className="mb-5">
          <Alert tone="error">{formError ?? fieldErrors.email}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Field
          label={t("newPassword")}
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          hint={t("newPasswordHint")}
        />
        <Field
          label={t("confirmNewPassword")}
          type="password"
          name="password_confirmation"
          autoComplete="new-password"
          required
          value={passwordConfirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
        />
        <Button type="submit" isLoading={isSubmitting}>
          {t("resetPassword")}
        </Button>
      </form>
    </>
  );
}
