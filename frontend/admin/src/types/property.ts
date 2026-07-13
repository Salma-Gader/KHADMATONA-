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

// Labels are no longer hardcoded here - PropertyType/PropertyStatus values
// double as translation keys under the "PropertyType"/"PropertyStatus"
// message namespaces (messages/{locale}.json), looked up via
// useTranslations("PropertyType")(type) at each call site.
export const PROPERTY_TYPES: PropertyType[] = [
  "appartement",
  "villa",
  "riad",
  "maison",
  "terrain",
  "bureau",
  "local",
];

export const PROPERTY_STATUSES: PropertyStatus[] = [
  "disponible",
  "reserve",
  "vendu",
  "loue",
];
