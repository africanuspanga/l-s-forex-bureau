import type { Metadata } from "next";
import { getFeaturedRates, getLastUpdatedAt } from "@/lib/rates";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import RatesSection from "@/components/home/RatesSection";
import HowItWorks from "@/components/home/HowItWorks";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChoose from "@/components/home/WhyChoose";
import ConversionCta from "@/components/home/ConversionCta";
import Faq from "@/components/home/Faq";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "L&S Forex Bureau | Foreign Exchange in Dar es Salaam",
  description:
    "Check today's foreign exchange rates and visit L&S Forex Bureau in Tegeta, Mbezi Beach, Mikocheni or Masaki, Dar es Salaam.",
};

export default async function Home() {
  const [rates, lastUpdated] = await Promise.all([
    getFeaturedRates(),
    getLastUpdatedAt(),
  ]);

  return (
    <>
      <Hero rates={rates} />
      <TrustStrip />
      <RatesSection rates={rates} lastUpdated={lastUpdated} />
      <HowItWorks />
      <ServicesSection />
      <WhyChoose />
      <ConversionCta />
      <Faq />
    </>
  );
}
