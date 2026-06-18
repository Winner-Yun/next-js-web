"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type Place = "sidebar" | "navbar";

export function CustomTrigger({ place }: { place: Place }) {
  const isMobile = useIsMobile();
  const { open, openMobile } = useSidebar();

  const sidebarOpen = isMobile ? openMobile : open;

  return (
    <SidebarTrigger
      className={cn(
        "transition-opacity duration-300 ease-out motion-reduce:transition-none",

        // navbar trigger disappears when sidebar is open
        place === "navbar" && sidebarOpen && "pointer-events-none opacity-0",

        // sidebar trigger always stays clickable
        place === "sidebar" && "opacity-100",
      )}
    />
  );
}
