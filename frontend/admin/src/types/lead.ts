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
