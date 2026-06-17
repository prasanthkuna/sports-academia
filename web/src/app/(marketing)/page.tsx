import { CtaSection } from "@/components/landing/cta-section";
import { DayTimelineSection } from "@/components/landing/day-timeline-section";
import { DemoPlaygroundSection } from "@/components/landing/demo-playground-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeePlansSection } from "@/components/landing/fee-plans-section";
import { FlowMapSection } from "@/components/landing/flow-map-section";
import { FloatingWhatsApp } from "@/components/landing/floating-whatsapp";
import { HeroSection } from "@/components/landing/hero-section";
import { MarketingFooter } from "@/components/landing/marketing-footer";
import { MarketingNav } from "@/components/landing/marketing-nav";
import { OwnerQuestionsSection } from "@/components/landing/owner-questions-section";
import { PlanComparisonSection } from "@/components/landing/plan-comparison-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section";
import { QrPlatformSection } from "@/components/landing/qr-platform-section";
import { StickyMobileCta } from "@/components/landing/sticky-mobile-cta";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas pb-20 md:pb-0">
      <MarketingNav />
      <main>
        <HeroSection />
        <OwnerQuestionsSection />
        <ProblemSolutionSection />
        <FeePlansSection />
        <FlowMapSection />
        <DayTimelineSection />
        <QrPlatformSection />
        <DemoPlaygroundSection />
        <PlanComparisonSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <MarketingFooter />
      <FloatingWhatsApp />
      <StickyMobileCta />
    </div>
  );
}
