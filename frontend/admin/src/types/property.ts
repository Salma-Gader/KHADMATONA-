export type PropertyType =
  | "appartement"
  | "villa"
  | "riad"
  | "maison"
  | "terrain"
  | "bureau"
  | "local";

export type PropertyStatus = "disponible" | "reserve" | "vendu" | "loue";

export interface PropertyImage {
  id: number;
  url: string;
}

export interface Property {
  id: number;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  city_id: number;
  city_name: string | null;
  district_id: number | null;
  district_name: string | null;
  address: string;
  /** In MAD (decimal) - the API converts from stored cents. */
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  description: string | null;
  images: PropertyImage[];
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormValues {
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  city_id: number | "";
  district_id: number | "";
  address: string;
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  /** Newly selected files pending upload - not yet-saved images. */
  images: File[];
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
