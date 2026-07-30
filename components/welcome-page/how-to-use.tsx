"use client";

import { ChevronRightIcon } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

type Step = {
  step: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    step: "01",
    title: "Sign In",
    description:
      "Click Continue with Google and sign in with your Google account — no separate password to set up.",
  },
  {
    step: "02",
    title: "Create or Join a Workspace",
    description:
      "Set up your own workspace or join an existing team using an invite link to get everyone connected.",
  },
  {
    step: "03",
    title: "Configure Attendance Rules",
    description:
      "Define geofenced locations, work policies, and holidays so attendance is tracked accurately and automatically.",
  },
  {
    step: "04",
    title: "Manage from the Dashboard",
    description:
      "Monitor real-time attendance, review reports, and manage your team from a single unified dashboard.",
  },
];

// Fixed categorical order (blue, orange, aqua, yellow) — validated with
// scripts/validate_palette.js for CVD-safe adjacent contrast in both themes.
// Badge text flips to dark ink on the two lighter fills (aqua/yellow) since
// white text drops below the 3:1 large-text floor there.
const accents = [
  {
    border: "border-[#2a78d6] dark:border-[#3987e5]",
    badge: "bg-[#2a78d6] text-white dark:bg-[#3987e5]",
  },
  {
    border: "border-[#eb6834] dark:border-[#d95926]",
    badge: "bg-[#eb6834] text-white dark:bg-[#d95926]",
  },
  {
    border: "border-[#1baf7a] dark:border-[#199e70]",
    badge: "bg-[#1baf7a] text-[#0b0b0b] dark:bg-[#199e70]",
  },
  {
    border: "border-[#eda100] dark:border-[#c98500]",
    badge: "bg-[#eda100] text-[#0b0b0b] dark:bg-[#c98500]",
  },
];

export function HowToUseSection() {
  return (
    <section
      className="mx-auto w-full max-w-5xl px-4 py-24 md:px-8"
      id="how-to-use"
    >
      {/* Header */}
      <div className="mb-16 max-w-2xl space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          How To{" "}
          <span className="bg-linear-to-r from-brand to-cyan-400 bg-clip-text text-transparent">
            Use
          </span>
        </h2>

        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Four simple steps to go from sign in to managing your workspace&apos;s
          attendance end to end.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-0">
        {steps.map((item, index) => {
          const accent = accents[index % accents.length];

          return (
            <Fragment key={item.step}>
              <div className="relative min-w-0 flex-1 pt-5">
                <span
                  className={cn(
                    "absolute top-0 left-6 z-10 flex size-11 items-center justify-center rounded-full text-lg font-bold ring-4 ring-background",
                    accent.badge,
                  )}
                >
                  {item.step}
                </span>

                <div
                  className={cn(
                    "h-full rounded-2xl border-2 bg-card px-5 pb-6 pt-9 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
                    accent.border,
                  )}
                >
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground/90">
                    {item.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden shrink-0 items-center justify-center px-2 lg:flex"
                >
                  <ChevronRightIcon className="size-6 text-muted-foreground/40" />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
