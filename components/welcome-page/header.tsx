"use client";

import { ThemeSwitcher } from "@/components/dashboard/appShell/theme-switcher";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/welcome-page/mobile-nav";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
    label: "How to Use",
    id: "how-to-use",
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

    if (!section) {
      return;
    }

    const headerOffset = 80;

    const sectionPosition =
      section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: sectionPosition - headerOffset,
      behavior: "smooth",
    });

    const navItem = navLinks.find((link) => link.id === id);

    if (navItem) {
      document.title = `${navItem.label} | WorkSmart`;
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        scrolled &&
          "border-b border-border bg-background/80 backdrop-blur-md shadow-sm",
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("hero")}
          className="group flex cursor-pointer items-center gap-2.5 rounded-md transition-opacity hover:opacity-80"
        >
          <Image
            src="/worksmart.png"
            alt="WorkSmart logo"
            width={30}
            height={30}
            style={{ width: "auto", height: "auto" }}
          />
          <span className="text-xl font-bold tracking-tight">Work Smart</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Button
                key={link.label}
                size="sm"
                variant="ghost"
                onClick={() => scrollToSection(link.id)}
                className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Button>
            ))}
          </div>

          <ThemeSwitcher />

          {/* Mobile */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
