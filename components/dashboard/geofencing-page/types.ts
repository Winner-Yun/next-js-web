export interface GeofenceZone {
  id: string;
  assignedEmail: string;
  zoneName: string;
  lat: number;
  lng: number;
  radius: number;
  status: "active" | "breached" | "inactive";
}
