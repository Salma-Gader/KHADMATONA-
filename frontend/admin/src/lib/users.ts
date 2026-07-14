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

export function createUser(values: UserFormValues): Promise<User> {
  return api.post<User>("/api/v1/users", values);
}

export function listRoles(): Promise<string[]> {
  return api.get<string[]>("/api/v1/roles");
}
