import { AboutSection } from "@/components/welcome-page/about";
import { Contact } from "@/components/welcome-page/contact";
import { FeatureSection } from "@/components/welcome-page/feature-section";
import { Footer } from "@/components/welcome-page/footer";
import { Header } from "@/components/welcome-page/header";
import { HeroSection } from "@/components/welcome-page/hero";

export default function page() {
  return (
    <>
      <Header />
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
        <Contact />
      </section>
      <footer className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
        <Footer />
      </footer>
    </>
  );
}
