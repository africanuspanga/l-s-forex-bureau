"use client";

import { useState } from "react";

export interface TrendPoint {
  date: string;
  sell: number;
  buy: number;
}

interface TrendChartProps {
  trend7: TrendPoint[];
  trend30: TrendPoint[];
}

function formatAxisDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function formatValue(value: number): string {
  const decimals = value < 10 ? 2 : 0;
  return value.toLocaleString("en-TZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const WIDTH = 320;
const HEIGHT = 120;
const PAD_X = 6;
const PAD_Y = 12;

export default function TrendChart({ trend7, trend30 }: TrendChartProps) {
  const [range, setRange] = useState<7 | 30>(7);
  const showToggle = trend7.length >= 2 && trend30.length >= 2;
  const data = range === 7 ? trend7 : trend30;

  if (data.length < 2) {
    return (
      <p className="py-6 text-center text-xs text-muted">
        Rate history will appear here as rates are updated.
      </p>
    );
  }

  const values = data.map((d) => d.sell);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || max * 0.001 || 1;

  const x = (i: number) => PAD_X + (i / (data.length - 1)) * (WIDTH - PAD_X * 2);
  const y = (v: number) => HEIGHT - PAD_Y - ((v - min) / span) * (HEIGHT - PAD_Y * 2);

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(d.sell).toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L${x(data.length - 1).toFixed(2)},${HEIGHT - 2} L${x(0).toFixed(2)},${HEIGHT - 2} Z`;

  const minIndex = values.indexOf(min);
  const maxIndex = values.indexOf(max);
  const gradientId = `trend-fill-${range}`;

  return (
    <div>
      {showToggle && (
        <div className="mb-3 inline-flex rounded-full border border-primary/10 bg-surface p-0.5 text-xs font-semibold">
          {([7, 30] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setRange(d)}
              className={`rounded-full px-3 py-1 transition ${
                range === d ? "bg-primary text-white" : "text-muted hover:text-foreground"
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
      )}

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Selling rate history">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#09c3fe" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#09c3fe" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke="#013ae1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(data.length - 1)} cy={y(values[values.length - 1])} r={3.5} fill="#013ae1" stroke="#fff" strokeWidth={1.5} />
        <circle cx={x(minIndex)} cy={y(min)} r={3} fill="#fff" stroke="#5a6a92" strokeWidth={1.5} />
        <circle cx={x(maxIndex)} cy={y(max)} r={3} fill="#fff" stroke="#5a6a92" strokeWidth={1.5} />
      </svg>

      <div className="mt-1 flex items-center justify-between text-[11px] text-muted">
        <span className="tabular">
          Low <span className="font-semibold text-foreground">{formatValue(min)}</span>
          <span className="ml-1">({formatAxisDate(data[minIndex].date)})</span>
        </span>
        <span className="tabular">
          High <span className="font-semibold text-foreground">{formatValue(max)}</span>
          <span className="ml-1">({formatAxisDate(data[maxIndex].date)})</span>
        </span>
      </div>
    </div>
  );
}
