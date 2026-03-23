import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { LogoTicker } from '@/components/home/LogoTicker';
import { FeaturesDashboard } from '@/components/home/FeaturesDashboard';
import { StatsSection } from '@/components/home/StatsSection';
import { InsightsSection } from '@/components/home/InsightsSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0d] text-white selection:bg-[#ff1f1f]/30">
      <Navbar />
      <HeroSection />
      <LogoTicker />
      <FeaturesDashboard />
      <StatsSection />
      <InsightsSection />
      <Footer />
    </main>
  );
}
