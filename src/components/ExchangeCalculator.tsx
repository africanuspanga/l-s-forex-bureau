"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CurrencyRate } from "@/lib/rates";

interface ExchangeCalculatorProps {
  rates: CurrencyRate[];
}

function formatAmount(value: number): string {
  const decimals = value < 10 ? 2 : 0;
  return new Intl.NumberFormat("en-TZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

const inputClasses =
  "w-full rounded-xl border border-primary/10 bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10";

export default function ExchangeCalculator({ rates }: ExchangeCalculatorProps) {
  const rateMap = useMemo(
    () => new Map(rates.map((r) => [r.currency.code, r])),
    [rates]
  );

  const [haveCode, setHaveCode] = useState<string>(
    rates.some((r) => r.currency.code === "USD")
      ? "USD"
      : rates[0]?.currency.code ?? "TZS"
  );
  const [wantCode, setWantCode] = useState<string>("TZS");
  const [amountInput, setAmountInput] = useState<string>("");

  const amount = parseFloat(amountInput.replace(/,/g, ""));
  const hasAmount = amountInput.trim() !== "" && Number.isFinite(amount) && amount > 0;

  // Customer sells foreign currency -> L&S buys it at buyingRate (foreign -> TZS).
  const toTzs = (code: string, value: number): number => {
    if (code === "TZS") return value;
    const rate = rateMap.get(code);
    return rate ? value * rate.buyingRate : NaN;
  };

  // Customer buys foreign currency with TZS -> L&S sells at sellingRate (TZS -> foreign).
  const fromTzs = (code: string, tzs: number): number => {
    if (code === "TZS") return tzs;
    const rate = rateMap.get(code);
    return rate ? tzs / rate.sellingRate : NaN;
  };

  const result = hasAmount ? fromTzs(wantCode, toTzs(haveCode, amount)) : null;

  const indicativeRate = ((): string | null => {
    if (haveCode === wantCode) return null;
    if (haveCode === "TZS") {
      const rate = rateMap.get(wantCode);
      return rate ? `1 ${wantCode} = TZS ${formatAmount(rate.sellingRate)}` : null;
    }
    if (wantCode === "TZS") {
      const rate = rateMap.get(haveCode);
      return rate ? `1 ${haveCode} = TZS ${formatAmount(rate.buyingRate)}` : null;
    }
    const from = rateMap.get(haveCode);
    const to = rateMap.get(wantCode);
    if (!from || !to) return null;
    // Cross pair: A -> TZS at buying rate, then TZS -> B at selling rate.
    return `1 ${haveCode} = ${formatAmount(from.buyingRate / to.sellingRate)} ${wantCode}`;
  })();

  const renderOptions = () => (
    <>
      <option value="TZS">🇹🇿 TZS - Tanzanian Shilling</option>
      {rates.map((r) => (
        <option key={r.currency.code} value={r.currency.code}>
          {r.currency.flag} {r.currency.code} - {r.currency.name}
        </option>
      ))}
    </>
  );

  return (
    <div className="card p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
        Check Your Exchange
      </h2>
      <p className="mt-1 text-sm text-muted">Indicative conversion, confirmed at the branch.</p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="calc-have-currency" className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            I have
          </label>
          <div className="mt-2 grid grid-cols-[1fr_auto] gap-3">
            <div className="relative">
              <select
                id="calc-have-currency"
                value={haveCode}
                onChange={(e) => setHaveCode(e.target.value)}
                className={`${inputClasses} appearance-none pr-9 font-medium`}
              >
                {renderOptions()}
              </select>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="Amount"
              aria-label="Amount you have"
              className={`${inputClasses} tabular w-28 sm:w-36`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="calc-want-currency" className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            I want
          </label>
          <div className="mt-2 grid grid-cols-[1fr_auto] gap-3">
            <div className="relative">
              <select
                id="calc-want-currency"
                value={wantCode}
                onChange={(e) => setWantCode(e.target.value)}
                className={`${inputClasses} appearance-none pr-9 font-medium`}
              >
                {renderOptions()}
              </select>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <div
              aria-live="polite"
              className="tabular flex w-28 items-center rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-foreground sm:w-36"
            >
              {result !== null && Number.isFinite(result) ? formatAmount(result) : "-"}
            </div>
          </div>
        </div>

        {indicativeRate && (
          <p className="text-sm text-muted">
            Indicative L&amp;S Rate:{" "}
            <span className="tabular font-semibold text-foreground">{indicativeRate}</span>
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/rates" className="btn btn-primary flex-1">
            View All Rates
          </Link>
          <Link href="/branches" className="btn btn-outline flex-1">
            Visit a Branch
          </Link>
        </div>

        <p className="text-xs leading-relaxed text-muted">
          Rates shown online are indicative and may change with market conditions.
          Final rates are confirmed at the branch at the time of transaction.
        </p>
      </div>
    </div>
  );
}
