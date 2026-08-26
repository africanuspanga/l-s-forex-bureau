import type { Metadata } from "next";
import {
  getPublishedRates,
  getLastUpdatedAt,
  formatDateTime,
} from "@/lib/rates";
import RatesExplorer from "@/components/rates/RatesExplorer";
import ExchangeCalculator from "@/components/ExchangeCalculator";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Exchange Rates Today Tanzania | L&S Forex Bureau",
  description:
    "View the latest buying and selling rates available from L&S Forex Bureau in Dar es Salaam.",
};

export default async function RatesPage() {
  const [rates, lastUpdated] = await Promise.all([
    getPublishedRates(),
    getLastUpdatedAt(),
  ]);

  return (
    <>
      {/* Hero band */}
      <section className="bg-hero-mesh pt-24">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            L&S Exchange Rates
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            L&S Exchange Rates
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            View the latest buying and selling rates available from L&S Forex
            Bureau.
          </p>
        </div>
      </section>

      {/* Rates explorer */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RatesExplorer rates={rates} />
          {lastUpdated && (
            <p className="mt-6 text-sm text-muted">
              Last updated: {formatDateTime(lastUpdated)}
            </p>
          )}
        </div>
      </section>

      {/* Currency converter */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Currency Converter
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Estimate Your Conversion
          </h2>
          <div className="mt-10">
            <ExchangeCalculator rates={rates} />
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
            Rates are indicative and subject to change. Please contact or visit
            an L&S branch to confirm the final transaction rate.
          </p>
        </div>
      </section>
    </>
  );
}
