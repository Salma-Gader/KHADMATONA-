export type PropertyType =
  | "appartement"
  | "villa"
  | "riad"
  | "maison"
  | "terrain"
  | "bureau"
  | "local";

export type PropertyStatus = "disponible" | "reserve" | "vendu" | "loue";

export interface Property {
  id: number;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  city: string;
  address: string;
  /** In MAD (decimal) - the API converts from stored cents. */
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  description: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormValues {
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  city: string;
  address: string;
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  image: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  appartement: "Appartement",
  villa: "Villa",
  riad: "Riad",
  maison: "Maison",
  terrain: "Terrain",
  bureau: "Bureau",
  local: "Local commercial",
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  disponible: "Disponible",
  reserve: "Réservé",
  vendu: "Vendu",
  loue: "Loué",
};
