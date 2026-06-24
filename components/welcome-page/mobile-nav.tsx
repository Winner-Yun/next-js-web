"use client";

import { Button } from "@/components/ui/button";
import { navLinks } from "@/components/welcome-page/header";
import { Portal, PortalBackdrop } from "@/components/welcome-page/portal";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (!section) return;

    const headerOffset = 80;

    const sectionPosition =
      section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: sectionPosition - headerOffset,
      behavior: "smooth",
    });

    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
        className="cursor-pointer"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>

      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop onClick={() => setOpen(false)} />

          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
              "size-full p-4",
            )}
            data-slot="open"
          >
            <div className="grid gap-y-2">
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  className="justify-start cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => scrollToSection(link.id)}
                >
                  {link.label}
                </Button>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-2">
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/auth">Sign In</Link>
              </Button>

              <Button
                asChild
                className="w-full bg-brand text-white hover:bg-brand-hover"
              >
                <Link href="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
