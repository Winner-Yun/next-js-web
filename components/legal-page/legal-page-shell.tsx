import Image from "next/image";
import type { ReactNode } from "react";

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10 flex items-center gap-3">
          <Image
            src="/worksmart.png"
            alt="WorkSmart"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="font-heading text-lg font-semibold text-foreground">
            WorkSmart
          </span>
        </header>

        <h1 className="font-heading text-3xl font-semibold text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>

        <div className="my-8 h-px w-full bg-muted/60" />

        <article
          className="
            space-y-6 text-sm leading-relaxed text-foreground/90
            [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold
            [&_h2]:text-foreground [&_h2]:pt-2
            [&_p]:text-muted-foreground
            [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-muted-foreground
            [&_strong]:text-foreground [&_strong]:font-medium
            [&_a]:text-brand [&_a]:hover:underline
          "
        >
          {children}
        </article>

        <div className="my-10 h-px w-full bg-muted/60" />

        <footer className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} WorkSmart. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
