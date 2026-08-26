"use client";

import { useMemo, useState } from "react";
import type { CurrencyRate } from "@/lib/rates";

type CategoryFilter = "all" | "major" | "regional";

const FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All currencies" },
  { value: "major", label: "Major currencies" },
  { value: "regional", label: "Regional currencies" },
];

function formatRate(value: number): string {
  const decimals = value < 10 ? 2 : 0;
  return value.toLocaleString("en-TZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function timeAgoLabel(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function RatesExplorer({ rates }: { rates: CurrencyRate[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rates.filter((r) => {
      if (filter !== "all" && r.currency.category !== filter) return false;
      if (!q) return true;
      return (
        r.currency.code.toLowerCase().includes(q) ||
        r.currency.name.toLowerCase().includes(q)
      );
    });
  }, [rates, query, filter]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                filter === f.value
                  ? "bg-primary text-white"
                  : "bg-white text-muted ring-1 ring-primary/15 hover:bg-surface-alt hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search currency or code"
            aria-label="Search currencies"
            className="w-full rounded-xl bg-white py-2.5 pl-10 pr-4 text-sm text-foreground ring-1 ring-primary/15 placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="card mt-6 hidden overflow-hidden md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-primary/10 bg-surface text-xs font-semibold uppercase tracking-wider text-muted">
              <th scope="col" className="px-6 py-4">Currency</th>
              <th scope="col" className="px-6 py-4">Currency Name</th>
              <th scope="col" className="px-6 py-4 text-right">We Buy</th>
              <th scope="col" className="px-6 py-4 text-right">We Sell</th>
              <th scope="col" className="px-6 py-4 text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {visible.map((r) => (
              <tr key={r.currency.code} className="transition-colors hover:bg-surface/60">
                <td className="px-6 py-4">
                  <span className="flex items-center gap-3 font-semibold text-foreground">
                    <span aria-hidden="true" className="text-xl leading-none">
                      {r.currency.flag}
                    </span>
                    {r.currency.code}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">{r.currency.name}</td>
                <td className="tabular px-6 py-4 text-right font-semibold text-foreground">
                  {formatRate(r.buyingRate)}
                </td>
                <td className="tabular px-6 py-4 text-right font-semibold text-primary">
                  {formatRate(r.sellingRate)}
                </td>
                <td className="px-6 py-4 text-right text-muted">
                  {timeAgoLabel(r.effectiveAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="px-6 py-12 text-center text-sm text-muted">
            No currencies match your search.
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="mt-6 grid gap-4 md:hidden">
        {visible.map((r) => (
          <div key={r.currency.code} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <span aria-hidden="true" className="text-2xl leading-none">
                  {r.currency.flag}
                </span>
                <span>
                  <span className="block font-semibold text-foreground">
                    {r.currency.code}
                  </span>
                  <span className="block text-xs text-muted">{r.currency.name}</span>
                </span>
              </span>
              <span className="text-xs text-muted">{timeAgoLabel(r.effectiveAt)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  We Buy
                </p>
                <p className="tabular mt-1 font-semibold text-foreground">
                  {formatRate(r.buyingRate)}
                </p>
              </div>
              <div className="rounded-xl bg-surface px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  We Sell
                </p>
                <p className="tabular mt-1 font-semibold text-primary">
                  {formatRate(r.sellingRate)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="card px-6 py-12 text-center text-sm text-muted">
            No currencies match your search.
          </p>
        )}
      </div>
    </div>
  );
}
