"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { api, ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.post("/api/v1/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sent) {
    return (
      <>
        <h2 className="mb-4 font-display text-2xl font-semibold text-text">
          Check your email
        </h2>
        <Alert tone="success">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent
          a link to reset the password.
        </Alert>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-semibold text-gold-primary hover:underline"
        >
          ← Back to sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <h2 className="mb-1 font-display text-2xl font-semibold text-text">
        Forgot your password?
      </h2>
      <p className="mb-6 text-sm text-text-muted">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {error && (
        <div className="mb-5">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" isLoading={isSubmitting}>
          Send reset link
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 inline-block text-sm font-semibold text-gold-primary hover:underline"
      >
        ← Back to sign in
      </Link>
    </>
  );
}
