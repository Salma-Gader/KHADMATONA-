import { api } from "@/lib/api";
import type { Pagination, Property, PropertyFormValues } from "@/types/property";

export interface ListPropertiesParams {
  page?: number;
  perPage?: number;
  search?: string;
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
  query.set("sort", "-created_at");
  if (params.search) query.set("filter[search]", params.search);

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

export function createProperty(
  values: PropertyFormValues,
): Promise<Property> {
  return api.post<Property>("/api/v1/properties", values);
}

export function updateProperty(
  id: number | string,
  values: PropertyFormValues,
): Promise<Property> {
  return api.put<Property>(`/api/v1/properties/${id}`, values);
}

export function deleteProperty(id: number | string): Promise<void> {
  return api.delete<void>(`/api/v1/properties/${id}`);
}
