import type { Metadata } from "next";
import CallBand from "@/components/CallBand";
import { getBranches } from "@/lib/rates";
import BranchesExplorer from "@/components/branches/BranchesExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "L&S Forex Bureau Branches in Dar es Salaam",
  description:
    "Find L&S Forex Bureau in Tegeta, Mbezi Beach, Mikocheni or Masaki, Dar es Salaam.",
};

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-mesh pt-34">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="eyebrow eyebrow-accent animate-fade-up">Find L&amp;S</p>
          <h1
            className="animate-fade-up font-display mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Four Locations Across Dar es Salaam
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-lg text-white/75"
            style={{ animationDelay: "160ms" }}
          >
            Choose the L&S branch most convenient for you.
          </p>
        </div>
      </section>

      {/* Explorer */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <BranchesExplorer branches={branches} />
        </div>
      </section>
      <CallBand />
    </>
  );
}
