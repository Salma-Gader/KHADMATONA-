import { Badge } from "@/components/ui/badge";
import { PROPERTY_STATUS_LABELS, type PropertyStatus } from "@/types/property";

const TONE: Record<PropertyStatus, "success" | "warning" | "info" | "gold"> = {
  disponible: "success",
  reserve: "warning",
  vendu: "info",
  loue: "gold",
};

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return <Badge tone={TONE[status]}>{PROPERTY_STATUS_LABELS[status]}</Badge>;
}
