import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal-page/legal-page-shell";
import { TermsOfServiceContent } from "@/components/legal-page/terms-of-service-content";

export const metadata: Metadata = {
  title: "Terms of Service | WorkSmart",
  robots: { index: false, follow: false },
};

export default function TermsOfServicePage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="August 4, 2026">
      <TermsOfServiceContent />
    </LegalPageShell>
  );
}
