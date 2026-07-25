import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhatIsUnipoleSection } from "@/components/sections/WhatIsUnipoleSection";
import { WhyChooseUnipoleSection } from "@/components/sections/WhyChooseUnipoleSection";
import { KeyLocationsSection } from "@/components/sections/KeyLocationsSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <WhatIsUnipoleSection />
        <WhyChooseUnipoleSection />
        <KeyLocationsSection />
      </main>
    </>
  );
}
