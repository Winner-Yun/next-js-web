"use client";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/welcome-page/mobile-nav";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ActivityIcon } from "lucide-react";

export const navLinks = [
  {
    label: "About",
    id: "about",
  },
  {
    label: "Features",
    id: "features",
  },
  {
    label: "Contacts",
    id: "contact",
  },
];

export function Header() {
  const scrolled = useScroll(10);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300 ease-in-out",
        {
          "border-border bg-background/80 backdrop-blur-md shadow-sm": scrolled,
        },
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        {/* Brand */}
        <button
          onClick={() => scrollToSection("hero")}
          className="group flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-80 cursor-pointer"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-brand to-brand-cyan-400 text-white shadow-sm">
            <ActivityIcon className="size-5" />
          </div>

          <span className="text-xl font-bold tracking-tight">Work Smart</span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.label}
                size="sm"
                variant="ghost"
                onClick={() => scrollToSection(link.id)}
                className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              >
                {link.label}
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 border-l border-border pl-6">
            <Button
              size="sm"
              variant="ghost"
              className="font-medium cursor-pointer"
            >
              Sign In
            </Button>

            <Button
              size="sm"
              className="bg-brand text-white shadow-sm hover:bg-brand-hover cursor-pointer"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
