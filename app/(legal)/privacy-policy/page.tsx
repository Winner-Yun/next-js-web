import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal-page/legal-page-shell";
import { PrivacyPolicyContent } from "@/components/legal-page/privacy-policy-content";

export const metadata: Metadata = {
  title: "Privacy Policy | WorkSmart",
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="August 4, 2026">
      <PrivacyPolicyContent />
    </LegalPageShell>
  );
}
