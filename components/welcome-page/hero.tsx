"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, RocketIcon } from "lucide-react";

export function HeroSection() {
  return (
    <section id="hero" className="mx-auto w-full max-w-5xl">
      {/* Top Shades */}
      <div
        aria-hidden="true"
        className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
      >
        <div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)] contain-strict" />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center gap-6 pt-32 pb-30">
        {/* Top Pill Badge */}
        <a
          className={cn(
            "group mx-auto flex w-fit items-center gap-3 rounded-full border border-border/50 bg-muted/30 px-4 py-1.5 backdrop-blur-sm transition-all hover:bg-muted/50",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-500 duration-500 ease-out",
          )}
          href="#about"
        >
          <RocketIcon className="size-4 text-brand" />
          <span className="text-sm font-medium text-muted-foreground">
            Smart Attendance management system
          </span>
          <span className="block h-4 w-px bg-border" />
          <ArrowRightIcon className="size-4 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-1" />
        </a>

        {/* Headline */}
        <h1
          className={cn(
            "fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-5xl font-bold tracking-tight delay-100 duration-500 ease-out md:text-6xl lg:text-7xl",
            "text-shadow-[0_0px_50px_theme(--color-foreground/.2)]",
          )}
        >
          Work Smart. <br />
          <span className="bg-linear-to-r from-brand to-brand-cyan-400 bg-clip-text text-transparent">
            Smart Attendance.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="fade-in slide-in-from-bottom-10 mx-auto max-w-lg animate-in fill-mode-backwards text-center text-lg text-muted-foreground tracking-wide delay-200 duration-500 ease-out md:text-xl md:leading-relaxed">
          An intelligent workspace management system with automated attendance
          tracking and face recognition.
        </p>

        {/* Call to Actions */}
        <div className="fade-in slide-in-from-bottom-10 flex animate-in flex-col sm:flex-row flex-wrap items-center justify-center gap-4 fill-mode-backwards pt-6 delay-300 duration-500 ease-out">
          <Button
            onClick={() => {
              window.location.href = "/auth";
            }}
            className="rounded-full cursor-pointer border border-border/50 bg-transparent px-8 py-6 text-base font-semibold text-foreground shadow-lg transition-all hover:bg-muted/30 hover:shadow-xl hover:-translate-y-0.5"
            size="lg"
            variant="outline"
          >
            Sign in
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/auth";
            }}
            className="rounded-full cursor-pointer bg-brand px-8 py-6 text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-hover hover:shadow-xl hover:-translate-y-0.5"
            size="lg"
          >
            Get Started <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
