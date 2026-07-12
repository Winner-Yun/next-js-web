export interface Holiday {
  id: string;
  workspace_id: string;
  name: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface HolidayConfig {
  workspace_id: string;
  include_public_holidays: boolean;
  include_weekend: string;
  updated_at: string;
}

export interface PaginatedHolidays {
  page: number;
  limit: number;
  total: number;
  data: Holiday[];
}
