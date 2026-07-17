import { api } from "@/lib/api";
import type { DashboardStats } from "@/types/dashboard";
import type {
  Pagination,
  Property,
  PropertyFormValues,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

export interface ListPropertiesParams {
  page?: number;
  perPage?: number;
  search?: string;
  /** Allow-listed on the backend - used by the public listing page's filters. */
  type?: PropertyType;
  status?: PropertyStatus;
  cityId?: number;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
}

export interface PropertyList {
  properties: Property[];
  pagination: Pagination;
}

export async function listProperties(
  params: ListPropertiesParams = {},
): Promise<PropertyList> {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("per_page", String(params.perPage ?? 10));
  query.set("sort", params.sort ?? "-created_at");
  if (params.search) query.set("filter[search]", params.search);
  if (params.type) query.set("filter[type]", params.type);
  if (params.status) query.set("filter[status]", params.status);
  if (params.cityId !== undefined) query.set("filter[city_id]", String(params.cityId));
  if (params.priceMin !== undefined) {
    query.set("filter[price_min]", String(params.priceMin));
  }
  if (params.priceMax !== undefined) {
    query.set("filter[price_max]", String(params.priceMax));
  }

  const envelope = await api.getWithMeta<Property[]>(
    `/api/v1/properties?${query.toString()}`,
  );

  return {
    properties: envelope.data,
    pagination: (envelope.meta?.pagination as Pagination) ?? {
      current_page: 1,
      last_page: 1,
      per_page: params.perPage ?? 10,
      total: envelope.data.length,
    },
  };
}

export function getProperty(id: number | string): Promise<Property> {
  return api.get<Property>(`/api/v1/properties/${id}`);
}

function toFormData(values: PropertyFormValues): FormData {
  const form = new FormData();
  form.set("title", values.title);
  form.set("type", values.type);
  form.set("status", values.status);
  form.set("city_id", String(values.city_id));
  if (values.district_id !== "") form.set("district_id", String(values.district_id));
  form.set("address", values.address);
  form.set("price", String(values.price));
  form.set("surface", String(values.surface));
  form.set("bedrooms", String(values.bedrooms));
  form.set("bathrooms", String(values.bathrooms));
  if (values.description) form.set("description", values.description);
  for (const file of values.images) {
    form.append("images[]", file);
  }
  return form;
}

export function createProperty(
  values: PropertyFormValues,
): Promise<Property> {
  return api.postForm<Property>("/api/v1/properties", toFormData(values));
}

export function updateProperty(
  id: number | string,
  values: PropertyFormValues,
): Promise<Property> {
  return api.putForm<Property>(`/api/v1/properties/${id}`, toFormData(values));
}

export function deleteProperty(id: number | string): Promise<void> {
  return api.delete<void>(`/api/v1/properties/${id}`);
}

export function deletePropertyImage(
  propertyId: number | string,
  mediaId: number,
): Promise<void> {
  return api.delete<void>(`/api/v1/properties/${propertyId}/images/${mediaId}`);
}

export function getDashboardStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>("/api/v1/dashboard/stats");
}
