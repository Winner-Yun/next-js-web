import { GoogleOAuthProvider } from "@react-oauth/google";

import { AzureBackground } from "@/components/ui/azureBackground";
import { AboutSection } from "@/components/welcome-page/about";
import { Contact } from "@/components/welcome-page/contact";
import { FeatureSection } from "@/components/welcome-page/feature-section";
import { Footer } from "@/components/welcome-page/footer";
import { Header } from "@/components/welcome-page/header";
import { HeroSection } from "@/components/welcome-page/hero";
import { HowToUseSection } from "@/components/welcome-page/how-to-use";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function page() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Header />
      <AzureBackground>
        <main className="grow">
          <HeroSection />
        </main>
        <section className="min-h-screen place-content-center px-4">
          <AboutSection />
        </section>
        <section className="min-h-screen place-content-center px-4">
          <FeatureSection />
        </section>
        <section className="min-h-screen place-content-center px-4">
          <HowToUseSection />
        </section>
        <section className="min-h-screen place-content-center px-4">
          <Contact />
        </section>
      </AzureBackground>
      <footer className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
        <Footer />
      </footer>
    </GoogleOAuthProvider>
  );
}
