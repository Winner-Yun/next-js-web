import { CustomTrigger } from "@/components/dashboard/appShell/custom-trigger";
import { NavUser } from "@/components/dashboard/appShell/nav-user";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BellIcon, HelpCircleIcon } from "lucide-react";
import { WorkspaceSwitcher } from "../../ui/workspace-switcher";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-(--app-header-height) w-full shrink-0 items-center justify-between gap-2 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <CustomTrigger place="navbar" />
        <WorkspaceSwitcher />
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>{" "}
      <div className="flex items-center gap-3">
        <Button size="icon-sm" className="cursor-pointer" variant="outline">
          <HelpCircleIcon />
        </Button>
        <Button
          aria-label="Notifications"
          size="icon-sm"
          className="cursor-pointer"
          variant="outline"
        >
          <BellIcon />
        </Button>
        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <NavUser />
      </div>
    </header>
  );
}
