"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { PageTransition } from "@/components/ui/page-transition";
import { useAuth } from "@/lib/auth-context";

function FullScreenSpinner({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist">
      <span
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-gold-primary"
        role="status"
        aria-label={label}
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading, error, refresh } = useAuth();
  const router = useRouter();
  const t = useTranslations("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Only redirect once the session check has actually completed and
  // confirmed there's no one logged in - not while it's still in flight,
  // and not when it failed to complete at all (that's the `error` case
  // below, which is a different situation from "confirmed logged out").
  useEffect(() => {
    if (!isLoading && !user && !error) {
      router.replace("/login");
    }
  }, [isLoading, user, error, router]);

  if (isLoading) {
    return <FullScreenSpinner label={t("loading")} />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist px-6">
        <div className="w-full max-w-sm text-center">
          <Alert tone="error" title={t("sessionErrorTitle")}>
            {error}
          </Alert>
          <Button onClick={() => refresh()} className="mt-5">
            {t("tryAgain")}
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    // Confirmed logged out - the effect above is redirecting to /login.
    // Keep showing a spinner (never a bare blank page) while that
    // navigation completes.
    return <FullScreenSpinner label={t("redirecting")} />;
  }

  return (
    <div className="flex min-h-screen bg-mist">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
