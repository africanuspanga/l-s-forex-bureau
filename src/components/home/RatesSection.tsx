import Link from "next/link";
import {
  formatDateTime,
  formatRateNumber,
  getRateTrend,
  type CurrencyRate,
} from "@/lib/rates";

interface RatesSectionProps {
  rates: CurrencyRate[];
  lastUpdated: string | null;
}

/** 7-day selling-rate line, drawn inline in the table row. */
function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const w = 96;
  const h = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const d = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (points.length - 1)) * w).toFixed(1)},${(h - 3 - ((v - min) / span) * (h - 6)).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-24" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Change({ rate }: { rate: CurrencyRate }) {
  if (rate.changePercent === null || rate.trend === null) {
    return <span className="text-muted">—</span>;
  }
  const sign = rate.changePercent > 0 ? "+" : "";
  const color = rate.trend === "up" ? "text-emerald-700" : rate.trend === "down" ? "text-red-700" : "text-muted";
  return (
    <span className={`tabular ${color}`}>
      {sign}
      {rate.changePercent.toFixed(2)}%
    </span>
  );
}

export default async function RatesSection({ rates, lastUpdated }: RatesSectionProps) {
  const trends = new Map(
    await Promise.all(
      rates.map(async (rate) => {
        const series = await getRateTrend(rate.currency.code, 7);
        return [rate.currency.code, series.map((p) => p.sell)] as const;
      })
    )
  );

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">Today&apos;s rates</p>
            <h2 className="font-display mt-4 text-3xl leading-[1] text-foreground sm:text-[2.6rem]">
              What we pay, what we charge
            </h2>
          </div>
          {lastUpdated && (
            <p className="font-mono text-xs text-muted">Published {formatDateTime(lastUpdated)}</p>
          )}
        </div>

        <div className="mt-10 overflow-x-auto rounded-lg border border-primary/10 bg-white">
          <table className="w-full border-collapse md:min-w-[34rem] text-left">
            <caption className="sr-only">L&amp;S buying and selling rates in Tanzanian shillings</caption>
            <thead>
              <tr className="border-b border-primary/10 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                <th scope="col" className="px-5 py-4 font-medium sm:px-6">Currency</th>
                <th scope="col" className="px-3 py-4 text-right font-medium">We buy</th>
                <th scope="col" className="px-3 py-4 text-right font-medium">We sell</th>
                <th scope="col" className="hidden px-3 py-4 text-right font-medium md:table-cell">Change</th>
                <th scope="col" className="hidden px-5 py-4 text-right font-medium sm:px-6 md:table-cell">Last 7 days</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate.currency.code} className="border-b border-primary/[0.07] last:border-0">
                  <th scope="row" className="px-5 py-4 font-normal sm:px-6">
                    <span className="font-display text-base text-foreground">{rate.currency.code}</span>
                    <span className="ml-3 hidden text-sm text-muted sm:inline">{rate.currency.name}</span>
                  </th>
                  <td className="tabular px-3 py-4 text-right font-mono text-[15px] font-semibold">
                    {formatRateNumber(rate.buyingRate)}
                  </td>
                  <td className="tabular px-3 py-4 text-right font-mono text-[15px] font-semibold">
                    {formatRateNumber(rate.sellingRate)}
                  </td>
                  <td className="hidden px-3 py-4 text-right font-mono text-xs md:table-cell">
                    <Change rate={rate} />
                  </td>
                  <td className="hidden px-5 py-4 text-primary sm:px-6 md:table-cell">
                    <div className="flex justify-end">
                      <Sparkline points={trends.get(rate.currency.code) ?? []} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-muted">
            TZS per unit of foreign currency. Indicative — your branch confirms the final rate.
          </p>
          <Link href="/rates" className="btn btn-dark">
            Search all rates
          </Link>
        </div>
      </div>
    </section>
  );
}
