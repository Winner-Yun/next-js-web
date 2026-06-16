"use client";

import { cn } from "@/lib/utils";
import { Globe, Mail, MessageCircle, Users } from "lucide-react";
import type React from "react";

const emails = [
  "winnerlegendpvh1426@gmail.com",
  "test@example.com",
  "test@example.com",
  "test@example.com",
];

const facebookUsers = [
  "@Winner Yun",
  "@ui.team",
  "@app.support",
  "@community.page",
];

const telegramUsers = [
  "@winnerYun",
  "@ui.team",
  "@app.support",
  "@community.page",
];

type ContactItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  details?: string[];
  usernames?: string[];
};

const data: ContactItem[] = [
  {
    title: "Email Support",
    description:
      "Our core communications channel. We monitor and respond to all incoming tickets within 24 hours.",
    icon: <Mail />,
    details: emails,
  },
  {
    title: "Telegram Contact",
    description:
      "Reach out via Telegram channels for localized direct developer updates and live automated bot support.",
    icon: <MessageCircle />,
    usernames: telegramUsers,
  },
  {
    title: "Facebook Profiles",
    description:
      "Connect with individual department heads and verify active team members on Facebook.",
    icon: <Globe />,
    usernames: facebookUsers,
  },
  {
    title: "Global Community",
    description:
      "Join our international user community forums to collaborate on workspace projects and discussions.",
    icon: <Users />,
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-5xl px-4 py-24 md:px-8"
    >
      {/* Header */}
      <div className="mb-16 flex max-w-2xl flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Contact <br />
          <span className="bg-linear-to-r from-[#0088FF] to-cyan-400 bg-clip-text text-transparent">
            Information
          </span>
        </h1>

        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          All formal workspace contact channels are listed below for
          verification and structural reference.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {data.map((item) => (
          <div
            key={item.title}
            className={cn(
              "group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-sm overflow-hidden",
              "transition-all duration-300 hover:border-[#0088FF]/30 hover:shadow-md hover:shadow-[#0088FF]/5 hover:-translate-y-0.5",
              "dark:bg-linear-to-b dark:from-card dark:to-muted/10",
            )}
          >
            {/* Ambient background glow on card hover */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(35%_35%_at_10%_10%,rgba(0,136,255,0.03),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div>
              {/* Card Header (Icon + Title) */}
              <div className="flex items-center gap-3.5 mb-4">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl border border-border/80 bg-muted/40 transition-colors group-hover:border-[#0088FF]/30 group-hover:bg-[#0088FF]/10",
                    "[&_svg]:size-4.5 [&_svg]:stroke-[1.75] [&_svg]:text-muted-foreground group-hover:[&_svg]:text-[#0088FF] [&_svg]:transition-colors",
                  )}
                >
                  {item.icon}
                </div>
                <h2 className="text-lg font-semibold text-foreground tracking-tight">
                  {item.title}
                </h2>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground/90 mb-4">
                {item.description}
              </p>
            </div>

            {/* Reference Data Layout Blocks (Anchored neatly to the bottom of the card) */}
            <div className="mt-auto w-full">
              {/* EMAIL LIST */}
              {item.details && (
                <div className="grid grid-cols-1 gap-1.5 rounded-xl border border-border/40 bg-muted/20 p-3.5 sm:grid-cols-2">
                  {item.details.map((email, index) => (
                    <span
                      key={`${email}-${index}`}
                      className="text-xs font-medium text-muted-foreground/80 hover:text-[#0088FF] transition-colors cursor-text select-all truncate"
                      title="Click and drag to copy email"
                    >
                      {email}
                    </span>
                  ))}
                </div>
              )}

              {/* FACEBOOK USERNAMES */}
              {item.usernames && (
                <div className="flex flex-wrap gap-2">
                  {item.usernames.map((u) => (
                    <span
                      key={u}
                      className={cn(
                        "text-xs font-medium rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1 text-muted-foreground/80 select-all cursor-text",
                        "transition-all duration-200 hover:border-[#0088FF]/20 hover:bg-[#0088FF]/5 hover:text-[#0088FF]",
                      )}
                      title="Click and drag to copy username"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
