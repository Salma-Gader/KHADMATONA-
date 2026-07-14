import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { LeadStatus } from "@/types/lead";

const TONE: Record<LeadStatus, "gold" | "info" | "success"> = {
  new: "gold",
  contacted: "info",
  closed: "success",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const t = useTranslations("LeadStatus");
  return <Badge tone={TONE[status]}>{t(status)}</Badge>;
}
