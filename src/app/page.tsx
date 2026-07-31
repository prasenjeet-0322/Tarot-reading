import { HeroSection } from "@/components/HeroSection";
import { Header } from "@/components/Header";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { PricingSection } from "@/components/PricingSection";


import { TestimonialsSection } from "@/components/TestimonialsSection";
import { InstagramSection } from "@/components/InstagramSection";

import { Footer } from "@/components/Footer";
import { StarBackground } from "@/components/StarBackground";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0D0B1E]">
      <StarBackground />
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />


      <TestimonialsSection />
      <InstagramSection />

      <Footer />
    </main>
  );
}
