import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhatIsUnipoleSection } from "@/components/sections/WhatIsUnipoleSection";
import { UnipoleAssemblySection } from "@/components/sections/UnipoleAssemblySection";
import { WhyChooseUnipoleSection } from "@/components/sections/WhyChooseUnipoleSection";
import { KeyLocationsSection } from "@/components/sections/KeyLocationsSection";
import { InventorySection } from "@/components/inventory/InventorySection";
import { UnipoleDetailModalController } from "@/components/inventory/UnipoleDetailModalController";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <WhatIsUnipoleSection />
        <UnipoleAssemblySection />
        <WhyChooseUnipoleSection />
        <KeyLocationsSection />
        <InventorySection />
      </main>
      {/* Suspense isolates useSearchParams (in the controller) so the rest of the page keeps prerendering statically. */}
      <Suspense fallback={null}>
        <UnipoleDetailModalController />
      </Suspense>
    </>
  );
}
