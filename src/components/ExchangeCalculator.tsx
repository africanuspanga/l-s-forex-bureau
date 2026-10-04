"use client";

import { useMemo, useState } from "react";
import type { CurrencyRate } from "@/lib/rates";

interface ExchangeCalculatorProps {
  rates: CurrencyRate[];
}

function formatAmount(value: number): string {
  const decimals = value < 100 ? 2 : 0;
  return new Intl.NumberFormat("en-TZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Locale-independent EAT (UTC+3) timestamp, so server and browser render identically. */
function formatSlipTime(iso: string): string {
  const d = new Date(Date.parse(iso) + 3 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

/** The calculator, printed as an L&S counter slip. */
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
  const [amountInput, setAmountInput] = useState<string>("100");

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
      return rate ? `1 ${wantCode} = ${formatAmount(rate.sellingRate)} TZS` : null;
    }
    if (wantCode === "TZS") {
      const rate = rateMap.get(haveCode);
      return rate ? `1 ${haveCode} = ${formatAmount(rate.buyingRate)} TZS` : null;
    }
    const from = rateMap.get(haveCode);
    const to = rateMap.get(wantCode);
    if (!from || !to) return null;
    // Cross pair: A -> TZS at buying rate, then TZS -> B at selling rate.
    return `1 ${haveCode} = ${formatAmount(from.buyingRate / to.sellingRate)} ${wantCode}`;
  })();

  const effectiveAt = rates[0]?.effectiveAt;

  const options = (
    <>
      <option value="TZS">TZS Tanzanian Shilling</option>
      {rates.map((r) => (
        <option key={r.currency.code} value={r.currency.code}>
          {r.currency.code} {r.currency.name}
        </option>
      ))}
    </>
  );

  return (
    <div className="receipt-shadow">
      <div className="receipt px-6 pt-7 text-[13px] sm:px-8">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.12em]">L&amp;S FOREX BUREAU</p>
          <p className="mt-1 text-[11px] text-muted">Rate slip · indicative</p>
        </div>

        <dl className="receipt-rule mt-5 space-y-1.5 pt-4 text-[11.5px]">
          {effectiveAt && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Rates of</dt>
              <dd className="text-right">{formatSlipTime(effectiveAt)} EAT</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Valid at</dt>
            <dd>All 4 branches</dd>
          </div>
        </dl>

        <div className="receipt-rule mt-4 space-y-4 pt-4">
          <div>
            <label htmlFor="calc-have" className="text-[11px] text-muted">
              You hand over
            </label>
            <div className="mt-1 grid grid-cols-[1fr_6.5rem] gap-4">
              <select id="calc-have" value={haveCode} onChange={(e) => setHaveCode(e.target.value)} className="receipt-field">
                {options}
              </select>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                aria-label={`Amount in ${haveCode}`}
                className="receipt-field tabular text-right"
              />
            </div>
          </div>
          <div>
            <label htmlFor="calc-want" className="text-[11px] text-muted">
              You receive
            </label>
            <select id="calc-want" value={wantCode} onChange={(e) => setWantCode(e.target.value)} className="receipt-field mt-1">
              {options}
            </select>
          </div>
        </div>

        <div className="receipt-rule mt-5 pt-4">
          <output aria-live="polite" className="flex items-baseline justify-between gap-3">
            <span className="text-xs font-bold">TOTAL {wantCode}</span>
            <span className="tabular truncate text-2xl font-bold sm:text-[1.7rem]">
              {result !== null && Number.isFinite(result) ? formatAmount(result) : "—"}
            </span>
          </output>
          <p className="tabular mt-1.5 text-right text-[11px] text-muted">
            {indicativeRate ?? "Pick two different currencies"}
          </p>
        </div>

        <p className="receipt-rule mt-5 pt-4 text-center text-[11px] leading-relaxed text-muted">
          Final rate confirmed at the counter.
          <br />
          Asante kwa kuchagua L&amp;S.
        </p>
      </div>
    </div>
  );
}
