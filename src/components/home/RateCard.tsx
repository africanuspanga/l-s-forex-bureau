"use client";

import { useState } from "react";
import type { CurrencyRate } from "@/lib/rates";
import TrendChart, { type TrendPoint } from "./TrendChart";

interface RateCardProps {
  rate: CurrencyRate;
  trend7: TrendPoint[];
  trend30: TrendPoint[];
}

function formatTzs(value: number): string {
  const decimals = value < 10 ? 2 : 0;
  return `TZS ${value.toLocaleString("en-TZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

const TREND_STYLES = {
  up: { arrow: "↗", classes: "bg-emerald-50 text-emerald-600" },
  down: { arrow: "↘", classes: "bg-red-50 text-red-600" },
  flat: { arrow: "→", classes: "bg-surface text-muted" },
} as const;

export default function RateCard({ rate, trend7, trend30 }: RateCardProps) {
  const [open, setOpen] = useState(false);
  const trend = rate.trend ? TREND_STYLES[rate.trend] : null;

  return (
    <article className="rounded-2xl border border-primary/5 bg-white p-6 card-shadow transition-transform hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none" aria-hidden="true">
            {rate.currency.flag}
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              {rate.currency.code}
            </h3>
            <p className="text-xs text-muted">{rate.currency.name}</p>
          </div>
        </div>
        {trend && (
          <span
            className={`tabular inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${trend.classes}`}
          >
            <span aria-hidden="true">{trend.arrow}</span>
            {rate.changePercent !== null &&
              `${rate.changePercent > 0 ? "+" : ""}${rate.changePercent.toFixed(2)}%`}
          </span>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Buying</dt>
          <dd className="tabular mt-1 text-lg font-bold text-foreground">
            {formatTzs(rate.buyingRate)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Selling</dt>
          <dd className="tabular mt-1 text-lg font-bold text-foreground">
            {formatTzs(rate.sellingRate)}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-5 flex w-full items-center justify-between rounded-xl border border-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/5"
      >
        Rate history
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 border-t border-primary/5 pt-4">
          <TrendChart trend7={trend7} trend30={trend30} />
        </div>
      )}
    </article>
  );
}
