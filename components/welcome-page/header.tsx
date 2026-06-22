"use client";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/welcome-page/mobile-nav";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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

    if (!section) {
      console.log("Section not found:", id);
      return;
    }

    const headerOffset = 80;

    const sectionPosition =
      section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: sectionPosition - headerOffset,
      behavior: "smooth",
    });
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

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-1">
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

          {/* Actions */}
          <div className="flex items-center gap-3 border-l border-border pl-6">
            <Button asChild size="sm" variant="ghost">
              <Link href="/auth">Sign In</Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="cursor-pointer bg-brand text-white shadow-sm hover:bg-brand-hover"
            >
              <Link href="/auth">Get Started</Link>
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
