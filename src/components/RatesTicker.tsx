import type { CurrencyRate } from "@/lib/rates";

interface RatesTickerProps {
  rates: CurrencyRate[];
}

function formatAmount(value: number): string {
  const decimals = value < 10 ? 2 : 0;
  return value.toLocaleString("en-TZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function TickerItems({ rates, groupKey }: { rates: CurrencyRate[]; groupKey: string }) {
  return (
    <>
      {rates.map((r) => (
        <span className="ticker-item" key={`${groupKey}-${r.currency.code}`}>
          <span aria-hidden="true">{r.currency.flag}</span>
          <span className="font-semibold">{r.currency.code}</span>
          <span className="opacity-75">Buy {formatAmount(r.buyingRate)}</span>
          <span aria-hidden="true">•</span>
          <span className="opacity-75">Sell {formatAmount(r.sellingRate)}</span>
          <span className="ticker-divider" aria-hidden="true" />
        </span>
      ))}
    </>
  );
}

export default function RatesTicker({ rates }: RatesTickerProps) {
  const items = rates.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <div className="ticker-bar">
      <p className="ticker-label">Our Forex Rates</p>
      <div className="ticker-viewport">
        <div className="ticker-track">
          <TickerItems rates={items} groupKey="a" />
          <TickerItems rates={items} groupKey="b" />
        </div>
      </div>
    </div>
  );
}
