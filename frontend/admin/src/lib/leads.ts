import { api } from "@/lib/api";
import type { Lead, LeadFormValues, LeadStatus, LeadType } from "@/types/lead";
import type { Pagination } from "@/types/property";

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

// Admin-only endpoints below (auth:sanctum + role:Admin) - distinct from
// the public submitLead() above.

export interface ListLeadsParams {
  type?: LeadType;
  page?: number;
  perPage?: number;
  search?: string;
  status?: LeadStatus;
  sort?: string;
}

export interface LeadList {
  leads: Lead[];
  pagination: Pagination;
}

export async function listLeads(params: ListLeadsParams = {}): Promise<LeadList> {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("per_page", String(params.perPage ?? 10));
  query.set("sort", params.sort ?? "-created_at");
  if (params.type) query.set("filter[type]", params.type);
  if (params.status) query.set("filter[status]", params.status);
  if (params.search) query.set("filter[search]", params.search);

  const envelope = await api.getWithMeta<Lead[]>(`/api/v1/leads?${query.toString()}`);

  return {
    leads: envelope.data,
    pagination: (envelope.meta?.pagination as Pagination) ?? {
      current_page: 1,
      last_page: 1,
      per_page: params.perPage ?? 10,
      total: envelope.data.length,
    },
  };
}

export function getLead(id: number | string): Promise<Lead> {
  return api.get<Lead>(`/api/v1/leads/${id}`);
}

export function updateLeadStatus(id: number | string, status: LeadStatus): Promise<Lead> {
  return api.patch<Lead>(`/api/v1/leads/${id}`, { status });
}

export function deleteLead(id: number | string): Promise<void> {
  return api.delete<void>(`/api/v1/leads/${id}`);
}
