import { LandingNavbar } from "../components/landing/LandingNavbar";
import { Hero } from "../components/landing/Hero";
import { TechStack } from "../components/landing/TechStack";
import { FeatureSection } from "../components/landing/FeatureSection";
import { HowItWorks } from "../components/landing/HowItWorks";
import { CTASection } from "../components/landing/CTASection";
import { Footer } from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <Hero />
        <TechStack />
        <FeatureSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
