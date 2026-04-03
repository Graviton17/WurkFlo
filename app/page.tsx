import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { LogoTicker } from '@/components/home/LogoTicker';
import { CoreFeaturesSection } from '@/components/home/CoreFeaturesSection';
import { AnalyticsSection } from '@/components/home/AnalyticsSection';
import { InteractiveSandboxSection } from '@/components/home/InteractiveSandboxSection';
import { CtaSection } from '@/components/home/CtaSection';
import { Footer } from '@/components/layout/Footer';

import { auth } from '@/lib/auth';

export default async function Home() {
  const user = await auth.getUser();
  
  return (
    <main className="min-h-screen bg-[#0c0c0d] text-white selection:bg-[#ff1f1f]/30">
      <Navbar initialUser={user} />
      <HeroSection />
      <LogoTicker />
      <CoreFeaturesSection />
      <InteractiveSandboxSection />
      <AnalyticsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
