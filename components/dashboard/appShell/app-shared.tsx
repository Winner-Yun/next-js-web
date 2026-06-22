import {
  BellIcon,
  BotIcon,
  Building2Icon,
  CalendarCheck2Icon,
  CalendarClockIcon,
  Clock3Icon,
  FileBarChart2Icon,
  LayoutDashboardIcon,
  MapPinnedIcon,
  MonitorSmartphoneIcon,
  SettingsIcon,
  ShieldCheckIcon,
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
      },
    ],
  },

  {
    label: "Workspace",
    items: [
      {
        title: "Workspaces",
        path: "/workspaces",
        icon: <Building2Icon />,
      },
      {
        title: "Employees",
        path: "/employees",
        icon: <UsersIcon />,
      },
      {
        title: "Geofences",
        path: "/geofencing",
        icon: <MapPinnedIcon />,
      },
      {
        title: "Workspaces Policies",
        path: "/policies",
        icon: <CalendarClockIcon />,
      },
    ],
  },

  {
    label: "Attendance",
    items: [
      {
        title: "Attendance Logs",
        path: "/attendance",
        icon: <Clock3Icon />,
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
        title: "Devices & Terminals",
        path: "/devices",
        icon: <MonitorSmartphoneIcon />,
      },
      {
        title: "Bot Integrations",
        path: "/integrations",
        icon: <BotIcon />,
      },
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
