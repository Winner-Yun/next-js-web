import {
  BellIcon,
  Building2Icon,
  CalendarCheck2Icon,
  CalendarClockIcon,
  Clock3Icon,
  FileBarChart2Icon,
  LayoutDashboardIcon,
  MapPinnedIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboardIcon />,
        isActive: true,
      },
    ],
  },

  {
    label: "Workspace",
    items: [
      {
        title: "Workspace",
        path: "/workspace",
        icon: <Building2Icon />,
      },
      {
        title: "Employees",
        path: "/employees",
        icon: <UsersIcon />,
      },
      {
        title: "Departments",
        path: "/departments",
        icon: <UserCogIcon />,
      },
    ],
  },

  {
    label: "Attendance",
    items: [
      {
        title: "Attendance",
        path: "/attendance",
        icon: <Clock3Icon />,
      },
      {
        title: "Geofences",
        path: "/geofences",
        icon: <MapPinnedIcon />,
      },
      {
        title: "Work Schedule",
        path: "/schedule",
        icon: <CalendarClockIcon />,
      },
      {
        title: "Leave Requests",
        path: "/leave",
        icon: <CalendarCheck2Icon />,
      },
    ],
  },

  {
    label: "Management",
    items: [
      {
        title: "Reports",
        path: "/reports",
        icon: <FileBarChart2Icon />,
      },
      {
        title: "Notifications",
        path: "/notifications",
        icon: <BellIcon />,
      },
      {
        title: "Roles & Permissions",
        path: "/roles",
        icon: <ShieldCheckIcon />,
      },
    ],
  },

  {
    label: "System",
    items: [
      {
        title: "Settings",
        path: "/settings",
        icon: <SettingsIcon />,
      },
    ],
  },
];

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item],
    ),
  ),
];
