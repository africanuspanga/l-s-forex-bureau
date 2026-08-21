import Link from "next/link";
import {
  formatDateTime,
  getRateTrend,
  timeAgo,
  type CurrencyRate,
} from "@/lib/rates";
import RateCard from "./RateCard";
import type { TrendPoint } from "./TrendChart";

interface RatesSectionProps {
  rates: CurrencyRate[];
  lastUpdated: string | null;
}

export default async function RatesSection({ rates, lastUpdated }: RatesSectionProps) {
  const trends = await Promise.all(
    rates.map(async (rate) => {
      const [trend7, trend30] = await Promise.all([
        getRateTrend(rate.currency.code, 7),
        getRateTrend(rate.currency.code, 30),
      ]);
      return { code: rate.currency.code, trend7, trend30 };
    })
  );
  const trendMap = new Map<string, { trend7: TrendPoint[]; trend30: TrendPoint[] }>(
    trends.map((t) => [t.code, { trend7: t.trend7, trend30: t.trend30 }])
  );

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-primary/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Live L&amp;S Rates
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Today&apos;s Foreign Exchange Rates
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Check the latest L&amp;S Forex Bureau buying and selling rates before
            visiting one of our branches.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rates.map((rate) => {
            const t = trendMap.get(rate.currency.code) ?? { trend7: [], trend30: [] };
            return (
              <RateCard
                key={rate.currency.code}
                rate={rate}
                trend7={t.trend7}
                trend30={t.trend30}
              />
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <Link
            href="/rates"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            See All Exchange Rates
          </Link>
          <p className="max-w-xl text-xs leading-relaxed text-muted">
            Rates are indicative and subject to change. Please contact or visit an
            L&amp;S branch to confirm the final transaction rate.
          </p>
          {lastUpdated && (
            <>
              <p className="flex items-center gap-2 text-sm text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                </svg>
                Last updated: {formatDateTime(lastUpdated)}
              </p>
              <span className="rounded-full border border-primary/10 bg-surface px-4 py-1.5 text-xs font-medium text-muted">
                Rates updated {timeAgo(lastUpdated)}
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
