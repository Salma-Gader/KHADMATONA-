import { api } from "@/lib/api";
import type { LeadFormValues } from "@/types/lead";

export interface LeadConfirmation {
  id: number;
  type: string;
  name: string;
  created_at: string;
}

export function submitLead(values: LeadFormValues): Promise<LeadConfirmation> {
  // Optional fields are only sent when actually filled in - an empty
  // string would otherwise fail the backend's `nullable` + format rules
  // (e.g. the phone regex), since "present but empty" isn't the same as
  // "absent" for Laravel's validator.
  const payload: Record<string, unknown> = {
    type: values.type,
    name: values.name,
    email: values.email,
  };
  if (values.phone.trim()) payload.phone = values.phone.trim();
  if (values.message.trim()) payload.message = values.message.trim();
  if (values.property_id !== undefined) payload.property_id = values.property_id;

  return api.post<LeadConfirmation>("/api/v1/leads", payload);
}
