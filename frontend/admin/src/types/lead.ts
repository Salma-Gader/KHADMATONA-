export type LeadType = "visit_request" | "sell_request" | "rent_request" | "contact";

export interface LeadFormValues {
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id?: number;
}

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  visit_request: "Demande de visite",
  sell_request: "Vendre un bien",
  rent_request: "Mettre un bien en location",
  contact: "Contact",
};

// Admin-side shape - full submission detail, as returned by the
// auth:sanctum + role:Admin lead endpoints (AdminLeadResource on the
// backend). Distinct from LeadFormValues/LeadConfirmation above, which
// belong to the public capture flow.
export type LeadStatus = "new" | "contacted" | "closed";

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

export interface Lead {
  id: number;
  type: LeadType;
  status: LeadStatus;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  property_id: number | null;
  created_at: string;
  updated_at: string;
}
