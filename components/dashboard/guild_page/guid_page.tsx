"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CalendarClockIcon,
  CheckCircle2Icon,
  GlobeIcon,
  GripVerticalIcon,
  MailIcon,
  MapPinIcon,
  MessageSquareIcon,
  MousePointerClickIcon,
  PlusIcon,
  ScrollTextIcon,
  SearchIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";


interface GuideStep {
  icon: React.ElementType;
  title: string;
  body: string;
}

interface ContactChannel {
  icon: React.ElementType;
  title: string;
  body: string;
  tags?: string[];
}

const policySteps: GuideStep[] = [
  {
    icon: PlusIcon,
    title: "Create a policy",
    body: 'Click "Create Policy" and set work hours, check-in/check-out windows, late buffer, scan deadline, and leave caps for the year.',
  },
  {
    icon: ShieldCheckIcon,
    title: "Set it active",
    body: 'A workspace runs on one active policy at a time. Click "Set Active" on any card to switch — the previous active policy is automatically deactivated.',
  },
  {
    icon: GripVerticalIcon,
    title: "Reorder your list",
    body: "Press and hold a card for under a second, then drag it over another card to swap positions. Release to save the new order — short clicks on buttons are unaffected.",
  },
  {
    icon: Trash2Icon,
    title: "Edit or delete",
    body: "Use the pencil icon to update any policy's rules. The active policy can't be deleted — set another policy active first.",
  },
];

const geofenceSteps: GuideStep[] = [
  {
    icon: MapPinIcon,
    title: "Add a zone",
    body: "Open the map dialog and drop a pin, or search an address, to define the radius where check-in and check-out are allowed.",
  },
  {
    icon: CheckCircle2Icon,
    title: "Confirm coordinates",
    body: "Newly created zones with unset coordinates are flagged with a warning toast. Open the edit icon on any highlighted zone to fix its location.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Set it active",
    body: 'Click "Set Active" so attendance is tracked against that zone. Like policies, only one geofence tracks at a time.',
  },
  {
    icon: GripVerticalIcon,
    title: "Reorder your list",
    body: "Same press-and-hold drag as policies — hold a card briefly, drag it into place, and the order is remembered next time you visit.",
  },
];

const quickFacts = [
  { label: "Total Employees", hint: "Everyone active in this workspace" },
  { label: "Absent Today", hint: "No check-in recorded yet today" },
  { label: "Late Arrivals", hint: "Checked in after the late buffer" },
  { label: "Leave Requests", hint: "Awaiting your approval" },
];

const contactChannels: ContactChannel[] = [
  {
    icon: MailIcon,
    title: "Email Support",
    body: "Our core communications channel. We monitor and respond to all incoming tickets within 24 hours.",
    tags: [
      "winnerlegendpvh1426@gmail.com",
      "phyna59@gmail.com",
      "thasopheak777@gmail.com",
      "bunnoreaksambathh@gmail.com",
    ],
  },
  {
    icon: MessageSquareIcon,
    title: "Telegram Contact",
    body: "Reach out via Telegram channels for localized direct developer updates and live automated bot support.",
    tags: ["@winnerYun", "@cheamsophy ", "@ThaSopheak1", "@BUN_NOREAKSAMBATH "],
  },
  {
    icon: GlobeIcon,
    title: "Facebook Profiles",
    body: "Connect with individual department heads and verify active team members on Facebook.",
    tags: ["@Winner Yun", "@Chem Sophy", "@Tha Sopheak", "@Bun Noreaksambath"],
  },
  {
    icon: UsersIcon,
    title: "Global Community",
    body: "Join our international user community forums to collaborate on workspace projects and discussions.",
  },
];

// ---------------------------------------------------------------------------

function GuideSection({
  icon: SectionIcon,
  eyebrow,
  title,
  description,
  steps,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  description: string;
  steps: GuideStep[];
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-brand/10 text-brand shrink-0">
          <SectionIcon className="size-5" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </span>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pl-0 sm:pl-11">
        {steps.map((step, i) => (
          <Card
            key={step.title}
            className="border-muted/80 bg-background/60 shadow-none"
          >
            <CardContent className="p-4 flex gap-3">
              <div className="flex flex-col items-center gap-1.5 pt-0.5">
                <div className="p-1.5 rounded-full bg-muted/60 text-muted-foreground">
                  <step.icon className="size-3.5" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-xs font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function HelpGuidePage() {
  return (
    <div className="w-full space-y-10 p-px animate-in fade-in duration-300 flex flex-col min-h-screen justify-between">
      <div className="space-y-10">
        {/* Header */}
        <div className="border-b border-muted/60 pb-6 space-y-3">
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-bold tracking-wider px-2 bg-brand/10 text-brand border-brand/20 shadow-none"
          >
            Guide
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            How to use Workspace Policies &amp; Geofencing
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            These two settings decide when attendance counts as on time and
            where it&apos;s allowed to happen. Set a policy for the clock, and a
            geofence for the map — both work the same way: create one, mark it
            active, and drag to reorder your list.
          </p>
        </div>

        {/* Dashboard orientation — grounds the guide in the actual screen */}
        <section className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            What you&apos;ll see on the dashboard
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {quickFacts.map((fact) => (
              <Card
                key={fact.label}
                className="border-muted/80 bg-background/60 shadow-none"
              >
                <CardHeader className="p-3.5 pb-0">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {fact.label}
                  </span>
                </CardHeader>
                <CardContent className="p-3.5 pt-1.5">
                  <p className="text-[11px] text-muted-foreground/80 leading-snug">
                    {fact.hint}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <GuideSection
          icon={ScrollTextIcon}
          eyebrow="Workspace Policies"
          title="Define the clock: hours, buffers, leave"
          description="A policy is the rulebook attendance is checked against — work hours, check-in and check-out windows, how late counts as late, and yearly leave caps."
          steps={policySteps}
        />

        <GuideSection
          icon={MapPinIcon}
          eyebrow="Geofences"
          title="Define the map: where check-in is allowed"
          description="A geofence is the zone attendance is checked against — employees can only check in or out from inside the active zone's radius."
          steps={geofenceSteps}
        />

        {/* Reorder callout — the one interaction that isn't obvious from the UI alone */}
        <Card className="border-muted/70 bg-muted/20 shadow-none">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-brand/10 text-brand shrink-0">
              <MousePointerClickIcon className="size-3.5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-foreground">
                Tip: reordering works the same everywhere
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Click and hold any policy or geofence card for about half a
                second, then drag it over another card to swap positions.
                Release the mouse to save — your order is remembered the next
                time you open this workspace. Quick clicks on buttons like
                &quot;Set Active&quot; or the pencil icon still work as normal.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search / find */}
        <div className="flex items-start gap-3 pt-2">
          <div className="p-1.5 rounded-full bg-muted/60 text-muted-foreground shrink-0">
            <SearchIcon className="size-3.5" />
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xl">
            Use the search box above either list to filter by name or ID — handy
            once a workspace has more than a handful of policies or zones.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-full bg-muted/60 text-muted-foreground shrink-0">
            <CalendarClockIcon className="size-3.5" />
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xl">
            Changes to the active policy or geofence apply immediately —
            employees checking in after a switch are measured against the new
            rules right away.
          </p>
        </div>

        {/* ----------------- CONTACT US SECTION ----------------- */}
        <section className="space-y-5 pt-6 border-t border-muted/60">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Contact <span className="text-brand">Information</span>
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              All formal workspace contact channels are listed below for
              verification and structural reference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactChannels.map((channel) => (
              <Card
                key={channel.title}
                className="border-muted/80 bg-background/60 shadow-none"
              >
                <CardContent className="p-5 space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground shrink-0">
                      <channel.icon className="size-4" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {channel.title}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground/90 leading-relaxed">
                    {channel.body}
                  </p>

                  {channel.tags && channel.tags.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {channel.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-1 rounded bg-muted/30 text-muted-foreground border border-muted/30 truncate"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* ----------------- WORK SMART SYSTEMS FOOTER ----------------- */}
      <footer className="border-t border-muted/60 pt-8 mt-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Work <span className="text-brand">Smart</span>
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              An intelligent workspace management platform engineered to
              optimize attendance tracking, identity validation, and modern
              operational workflows.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[10px] text-muted-foreground border-t border-muted/40 pt-4 pb-2">
          <p>© 2026 Work Smart Systems. All rights reserved.</p>
          <p>
            Built by the{" "}
            <span className="font-bold text-foreground">Work Smart Team</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
