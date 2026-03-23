import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { LogoTicker } from '@/components/home/LogoTicker';
import { CoreFeaturesSection } from '@/components/home/CoreFeaturesSection';
import { InsightsSection } from '@/components/home/InsightsSection';
import { AnalyticsSection } from '@/components/home/AnalyticsSection';
import { InteractiveSandboxSection } from '@/components/home/InteractiveSandboxSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0d] text-white selection:bg-[#ff1f1f]/30">
      <Navbar />
      <HeroSection />
      <LogoTicker />
      <CoreFeaturesSection />
      <InteractiveSandboxSection />
      <AnalyticsSection />
      <InsightsSection />
      <Footer />
    </main>
  );
}
