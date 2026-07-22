"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { LeadForm } from "@/components/leads/lead-form";

export function SellRentSection() {
  const t = useTranslations("SellRent");
  const [mode, setMode] = useState<"sell_request" | "rent_request">("sell_request");

  return (
    <div className="mx-auto max-w-xl rounded-md border border-border bg-surface p-6 shadow-md sm:p-8">
      <div className="mb-6 flex gap-2 rounded-md bg-surface-muted p-1">
        <button
          type="button"
          onClick={() => setMode("sell_request")}
          className={clsx(
            "flex-1 rounded-sm px-4 py-2.5 text-sm font-bold transition-colors",
            mode === "sell_request"
              ? "bg-gold-primary text-white shadow-sm"
              : "text-text-muted hover:text-text",
          )}
        >
          {t("sellTab")}
        </button>
        <button
          type="button"
          onClick={() => setMode("rent_request")}
          className={clsx(
            "flex-1 rounded-sm px-4 py-2.5 text-sm font-bold transition-colors",
            mode === "rent_request"
              ? "bg-gold-primary text-white shadow-sm"
              : "text-text-muted hover:text-text",
          )}
        >
          {t("rentTab")}
        </button>
      </div>

      <LeadForm
        key={mode}
        type={mode}
        submitLabel={mode === "sell_request" ? t("sellSubmit") : t("rentSubmit")}
        messagePlaceholder={
          mode === "sell_request" ? t("sellPlaceholder") : t("rentPlaceholder")
        }
      />
    </div>
  );
}
