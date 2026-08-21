import type { Metadata } from "next";
import Link from "next/link";
import { getBranches, PHONE_DISPLAY, PHONE_TEL } from "@/lib/rates";
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
      <section className="bg-hero-mesh pt-16">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="animate-fade-up inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">
            Find L&S
          </p>
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

      {/* CTA band */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-gradient card-shadow-lg rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Need Foreign Currency Today?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Our team can confirm current rates and currency availability
              before you visit.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/rates"
                className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface"
              >
                Check Exchange Rates
              </Link>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
