export type SettingsTabId =
  | "profile"
  | "workspace"
  | "appearance"
  | "notifications"
  | "general";

export interface SettingsTab {
  id: SettingsTabId;
  label: string;
  icon: React.ElementType;
  description: string;
}
