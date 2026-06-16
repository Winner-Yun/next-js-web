"use client";

import { cn } from "@/lib/utils";
import { Rocket, Shield, Sparkles, Users } from "lucide-react";
import type React from "react";

type AboutFeature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const features: AboutFeature[] = [
  {
    title: "Built for Speed",
    description:
      "Engineered for high performance, rapid data processing, and seamless, low-latency operational workflows.",
    icon: <Rocket />,
  },
  {
    title: "Secure by Design",
    description:
      "Protection is embedded at every core architectural layer, ensuring all biometric and system data stays encrypted.",
    icon: <Shield />,
  },
  {
    title: "Modern Experience",
    description:
      "A clean layout interface with responsive, interactive touchpoints built to optimize daily user productivity.",
    icon: <Sparkles />,
  },
  {
    title: "Community Driven",
    description:
      "Continuously evolving based on direct user feedback to solve real-world workspace management demands.",
    icon: <Users />,
  },
];

export function AboutSection() {
  return (
    <section id="about" className="mx-auto w-full max-w-5xl px-4 py-24 md:px-8">
      {/* Header */}
      <div className="mb-16 max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          About <br />
          <span className="bg-linear-to-r from-brand to-brand-cyan-400 bg-clip-text text-transparent">
            Our Platform
          </span>
        </h1>

        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          We focus on building an intelligent, intuitive, and secure operational
          framework that helps modern teams automate attendance, simplify
          check-ins, and optimize workspaces without overhead.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((item) => (
          <div
            key={item.title}
            className={cn(
              "group relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 overflow-hidden",
              "transition-all duration-300 hover:border-brand/30 hover:shadow-md hover:shadow-brand/5 hover:-translate-y-0.5",
              "dark:bg-linear-to-b dark:from-card dark:to-muted/10",
            )}
          >
            {/* Ambient background glow on card hover */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(35%_35%_at_10%_10%,rgba(0,136,255,0.03),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Icon Wrapper */}
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl border border-border/80 bg-muted/40 transition-colors group-hover:border-brand/30 group-hover:bg-brand/10",
                "[&_svg]:size-4.5 [&_svg]:stroke-[1.75] [&_svg]:text-muted-foreground group-hover:[&_svg]:text-[#0088FF] [&_svg]:transition-colors",
              )}
            >
              {item.icon}
            </div>

            {/* Typography Content */}
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-foreground tracking-tight">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground/90">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
