import { api } from "@/lib/api";
import type { Pagination } from "@/types/property";
import type { User } from "@/types/api";
import type { UserFormValues } from "@/types/user";

export interface UserList {
  users: User[];
  pagination: Pagination;
}

export async function listUsers(page = 1): Promise<UserList> {
  const envelope = await api.getWithMeta<User[]>(`/api/v1/users?page=${page}`);

  return {
    users: envelope.data,
    pagination: (envelope.meta?.pagination as Pagination) ?? {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: envelope.data.length,
    },
  };
}

export function getUser(id: number | string): Promise<User> {
  return api.get<User>(`/api/v1/users/${id}`);
}

export function createUser(values: UserFormValues): Promise<User> {
  return api.post<User>("/api/v1/users", values);
}

/**
 * A blank password means "keep the current one" - only sent to the API
 * when the admin actually typed a new one, matching UpdateUserRequest's
 * nullable password rule.
 */
export function updateUser(id: number | string, values: UserFormValues): Promise<User> {
  const payload: Record<string, unknown> = {
    name: values.name,
    email: values.email,
    role: values.role,
  };
  if (values.password) {
    payload.password = values.password;
    payload.password_confirmation = values.password_confirmation;
  }

  return api.put<User>(`/api/v1/users/${id}`, payload);
}

export function deleteUser(id: number | string): Promise<void> {
  return api.delete<void>(`/api/v1/users/${id}`);
}

export function listRoles(): Promise<string[]> {
  return api.get<string[]>("/api/v1/roles");
}
