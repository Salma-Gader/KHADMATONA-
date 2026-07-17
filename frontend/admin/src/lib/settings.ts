import { api } from "@/lib/api";
import type { Settings, SettingsEdit, UpdateSettingsPayload } from "@/types/settings";

export function getSettings(): Promise<Settings> {
  return api.get<Settings>("/api/v1/settings");
}

export function getSettingsForEdit(): Promise<SettingsEdit> {
  return api.get<SettingsEdit>("/api/v1/settings/edit");
}

export function updateSettings(payload: UpdateSettingsPayload): Promise<SettingsEdit> {
  return api.put<SettingsEdit>("/api/v1/settings", payload);
}
