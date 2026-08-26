"use client";

import { useState, useTransition } from "react";
import {
  publish,
  saveCurrencyFlags,
  saveDrafts,
  type PublishActionResult,
} from "@/app/admin/actions";
import { formatRateNumber } from "@/lib/format";

export interface RateManagerRow {
  code: string;
  name: string;
  flag: string;
  active: boolean;
  featured: boolean;
  publishedBuy: number | null;
  publishedSell: number | null;
  draftBuy: string;
  draftSell: string;
}

interface Message {
  kind: "success" | "error";
  text: string;
}

export default function RatesManager({ rows: initialRows }: { rows: RateManagerRow[] }) {
  const [rows, setRows] = useState<RateManagerRow[]>(initialRows);
  const [messages, setMessages] = useState<Message[]>([]);
  const [publishResult, setPublishResult] = useState<PublishActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const updateRow = (code: string, patch: Partial<RateManagerRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.code === code ? { ...r, ...patch } : r))
    );
  };

  const parseRows = (): { valid: { currencyCode: string; buyingRate: number; sellingRate: number }[]; errors: string[] } => {
    const valid: { currencyCode: string; buyingRate: number; sellingRate: number }[] = [];
    const errors: string[] = [];
    for (const row of rows) {
      if (!row.active) continue;
      const buyingRate = Number(row.draftBuy.replace(/,/g, ""));
      const sellingRate = Number(row.draftSell.replace(/,/g, ""));
      if (!Number.isFinite(buyingRate) || !Number.isFinite(sellingRate)) {
        errors.push(`${row.code}: enter numeric buy and sell rates.`);
        continue;
      }
      valid.push({ currencyCode: row.code, buyingRate, sellingRate });
    }
    return { valid, errors };
  };

  const handleSaveDraft = () => {
    const { valid, errors } = parseRows();
    setPublishResult(null);
    if (errors.length > 0) {
      setMessages(errors.map((text) => ({ kind: "error", text })));
      return;
    }
    startTransition(async () => {
      const result = await saveDrafts(valid);
      setMessages(
        result.ok
          ? [{ kind: "success", text: `Saved ${result.saved ?? valid.length} draft rate(s).` }]
          : [{ kind: "error", text: result.error ?? "Failed to save drafts." }]
      );
    });
  };

  const handlePublish = () => {
    setMessages([]);
    startTransition(async () => {
      setPublishResult(await publish());
    });
  };

  const handleFlagToggle = (code: string, field: "active" | "featured", value: boolean) => {
    updateRow(code, { [field]: value });
    startTransition(async () => {
      const row = rows.find((r) => r.code === code);
      if (!row) return;
      const active = field === "active" ? value : row.active;
      const featured = field === "featured" ? value : row.featured;
      const result = await saveCurrencyFlags(code, active, featured);
      if (!result.ok) {
        updateRow(code, { [field]: !value });
        setMessages([{ kind: "error", text: result.error ?? "Failed to update currency." }]);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="card-shadow overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-foreground/10 text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Currency</th>
                <th className="px-4 py-3 font-medium">Live buy</th>
                <th className="px-4 py-3 font-medium">Live sell</th>
                <th className="px-4 py-3 font-medium">Draft buy</th>
                <th className="px-4 py-3 font-medium">Draft sell</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-5 py-3 font-medium">Homepage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.code}
                  className={`border-b border-foreground/5 last:border-0 ${row.active ? "" : "opacity-50"}`}
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">
                      {row.flag} {row.code}
                    </p>
                    <p className="text-xs text-muted">{row.name}</p>
                  </td>
                  <td className="tabular px-4 py-3 text-muted">
                    {row.publishedBuy !== null ? formatRateNumber(row.publishedBuy) : "-"}
                  </td>
                  <td className="tabular px-4 py-3 text-muted">
                    {row.publishedSell !== null ? formatRateNumber(row.publishedSell) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={row.draftBuy}
                      onChange={(e) => updateRow(row.code, { draftBuy: e.target.value })}
                      disabled={!row.active}
                      aria-label={`${row.code} draft buying rate`}
                      className="tabular w-28 rounded-lg border border-foreground/15 px-2.5 py-1.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-surface"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={row.draftSell}
                      onChange={(e) => updateRow(row.code, { draftSell: e.target.value })}
                      disabled={!row.active}
                      aria-label={`${row.code} draft selling rate`}
                      className="tabular w-28 rounded-lg border border-foreground/15 px-2.5 py-1.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-surface"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted">
                      <input
                        type="checkbox"
                        checked={row.active}
                        onChange={(e) => handleFlagToggle(row.code, "active", e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                      Active
                    </label>
                  </td>
                  <td className="px-5 py-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted">
                      <input
                        type="checkbox"
                        checked={row.featured}
                        onChange={(e) => handleFlagToggle(row.code, "featured", e.target.checked)}
                        disabled={!row.active}
                        className="h-4 w-4 accent-primary"
                      />
                      Featured
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground/10 bg-surface px-5 py-4">
          <p className="max-w-xl text-xs text-muted">
            Publishing replaces the live website rates. Previous rates are
            archived to history, never overwritten.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={pending}
              className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={pending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Working…" : "Publish Rates"}
            </button>
          </div>
        </div>
      </section>

      {messages.map((m, i) => (
        <p
          key={i}
          role="status"
          className={`rounded-lg border px-4 py-2.5 text-sm ${
            m.kind === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {m.text}
        </p>
      ))}

      {publishResult && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            publishResult.ok
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {publishResult.published !== undefined && publishResult.published > 0 && (
            <p className="font-medium">
              Published {publishResult.published} rate(s) to the live website.
            </p>
          )}
          {publishResult.error && <p className="font-medium">{publishResult.error}</p>}
          {publishResult.errors && publishResult.errors.length > 0 && (
            <ul className="mt-1.5 list-inside list-disc">
              {publishResult.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
