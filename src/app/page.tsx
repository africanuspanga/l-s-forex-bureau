import type { Metadata } from "next";
import { getBranches, getFeaturedRates, getLastUpdatedAt } from "@/lib/rates";
import Hero from "@/components/home/Hero";
import BranchLine from "@/components/home/BranchLine";
import RatesSection from "@/components/home/RatesSection";
import HowItWorks from "@/components/home/HowItWorks";
import ServicesSection from "@/components/home/ServicesSection";
import Faq from "@/components/home/Faq";
import CallBand from "@/components/CallBand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "L&S Forex Bureau | Foreign Exchange in Dar es Salaam",
  description:
    "Check today's foreign exchange rates and visit L&S Forex Bureau in Tegeta, Mbezi Beach, Mikocheni or Masaki, Dar es Salaam.",
};

export default async function Home() {
  const [rates, lastUpdated, branches] = await Promise.all([
    getFeaturedRates(),
    getLastUpdatedAt(),
    getBranches(),
  ]);

  return (
    <>
      <Hero rates={rates} />
      <BranchLine branches={branches} />
      <RatesSection rates={rates} lastUpdated={lastUpdated} />
      <HowItWorks />
      <ServicesSection rates={rates} />
      <Faq />
      <CallBand />
    </>
  );
}
