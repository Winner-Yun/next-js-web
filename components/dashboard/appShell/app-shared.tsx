import {
  BellIcon,
  Building2Icon,
  CalendarCheck2Icon,
  CalendarClockIcon,
  Clock3Icon,
  FileBarChart2Icon,
  LayoutDashboardIcon,
  MapPinnedIcon,
  MessageCircleIcon,
  SettingsIcon,
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
        path: "/workpolicies",
        icon: <CalendarClockIcon />,
      },
      {
        title: "Workspaces Holidays",
        path: "/holidays",
        icon: <CalendarCheck2Icon />,
      },
    ],
  },

  {
    label: "Attendance",
    items: [
      {
        title: "Attendance Logs",
        path: "/attendance-logs",
        icon: <Clock3Icon />,
      },

      {
        title: "Leave Requests",
        path: "/leave-requests",
        icon: <CalendarCheck2Icon />,
      },
    ],
  },

  {
    label: "Management",
    items: [
      {
        title: "Reports",
        path: "/report-page",
        icon: <FileBarChart2Icon />,
      },
      {
        title: "Notifications",
        path: "/notifications",
        icon: <BellIcon />,
      },
      {
        title: "Chat & Messaging",
        path: "/chat-page",
        icon: <MessageCircleIcon />,
      },
    ],
  },

  {
    label: "System",
    items: [
      {
        title: "Settings",
        path: "/setting-page",
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
