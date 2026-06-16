import { AnimatedWalkthroughSection } from "@/components/landing/animated-walkthrough-section";
import { BeforeAfterSection } from "@/components/landing/before-after-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { FloatingWhatsApp } from "@/components/landing/floating-whatsapp";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { MarketingFooter } from "@/components/landing/marketing-footer";
import { MarketingNav } from "@/components/landing/marketing-nav";
import { PricingSection } from "@/components/landing/pricing-section";
import { SportMarquee } from "@/components/landing/sport-marquee";
import { StatsBar } from "@/components/landing/stats-bar";
import { StickyMobileCta } from "@/components/landing/sticky-mobile-cta";
import { TestimonialsSection } from "@/components/landing/testimonials-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas pb-20 md:pb-0">
      <MarketingNav />
      <main>
        <HeroSection />
        <StatsBar />
        <SportMarquee />
        <HowItWorksSection />
        <BenefitsSection />
        <FeaturesGrid />
        <AnimatedWalkthroughSection />
        <TestimonialsSection />
        <PricingSection />
        <BeforeAfterSection />
        <FaqSection />
        <CtaSection />
      </main>
      <MarketingFooter />
      <FloatingWhatsApp />
      <StickyMobileCta />
    </div>
  );
}
