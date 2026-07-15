export interface GeofenceZone {
  id: string;
  workspace_id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}
