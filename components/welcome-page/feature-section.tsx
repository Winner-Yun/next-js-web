import { DecorIcon } from "@/components/welcome-page/decor-icon";
import { cn } from "@/lib/utils";
import {
  FileTextIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  TerminalIcon,
} from "lucide-react";
import type React from "react";

type FeatureType = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

export function FeatureSection() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-5xl px-4 py-24 md:px-8"
    >
      {/* Header */}
      <div className=" max-w-3xl space-y-4 text-start mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-3xl lg:text-5xl">
          Everything you need to <br className="hidden sm:inline" />
          <span className="bg-linear-to-r from-[#0088FF] to-cyan-400 bg-clip-text text-transparent">
            work smarter.
          </span>
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          An all-in-one platform designed to automate attendance tracking,
          monitor workspace environments, and keep your business moving
          securely.
        </p>
      </div>

      {/* Responsive Bento Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 auto-rows-[220px]">
        {features.map((feature, index) => {
          // Creates a distinct bento box visual hierarchy (wide cards mixed with narrow cards)
          const gridSpan =
            index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5";
          return (
            <FeatureCard
              feature={feature}
              key={feature.title}
              className={gridSpan}
            />
          );
        })}
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  feature: FeatureType;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-sm overflow-hidden",
        "transition-all duration-300 hover:border-[#0088FF]/30 hover:shadow-md hover:shadow-[#0088FF]/5 hover:-translate-y-1",
        "dark:bg-linear-to-b dark:from-card dark:to-muted/20",
        className,
      )}
      {...props}
    >
      {/* Subtle Blue Glow Effect on Hover */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_50%_0%,rgba(0,136,255,0.04),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Card Header Layer */}
      <div className="flex items-start justify-between">
        {/* Icon Wrapper */}
        <div
          className={cn(
            "relative z-10 flex size-11 items-center justify-center rounded-xl border border-border/80 bg-muted/40 transition-colors group-hover:border-[#0088FF]/30 group-hover:bg-[#0088FF]/10",
            "[&_svg]:size-5 [&_svg]:stroke-[1.75] [&_svg]:text-muted-foreground group-hover:[&_svg]:text-[#0088FF] [&_svg]:transition-colors",
          )}
        >
          {feature.icon}
        </div>

        {/* Decorative Corner Element */}
        <DecorIcon
          className="size-4 opacity-40 transition-transform duration-300 group-hover:rotate-90 group-hover:text-[#0088FF] group-hover:opacity-80"
          position="top-right"
        />
      </div>

      {/* Typography/Content */}
      <div className="relative z-10 space-y-1.5">
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground/90 max-w-[90%]">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

const features: FeatureType[] = [
  {
    title: "Real-Time Dashboard Analytics",
    icon: <LayoutDashboardIcon />,
    description:
      "Monitor live system data, team occupancy levels, and daily workspace traffic updates instantly.",
  },
  {
    title: "Instant Integration",
    icon: <TerminalIcon />,
    description:
      "Sync seamlessly with your existing HR tools, Slack notifications, and biometric internal terminals.",
  },
  {
    title: "Secure Access Control",
    icon: <ShieldCheckIcon />,
    description:
      "Manage personnel identity permissions safely with precise biometric verification and role-based structures.",
  },
  {
    title: "Automated Activity Logging",
    icon: <FileTextIcon />,
    description:
      "Maintain a completely airtight audit trail of check-ins, exits, and system edits automatically.",
  },
];
