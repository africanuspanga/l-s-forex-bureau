"use client";

import { useState, useTransition } from "react";
import {
  previewBulk,
  publish,
  saveDrafts,
  type PublishActionResult,
} from "@/app/admin/actions";
import type { BulkParseResult } from "@/lib/rates";
import { formatRateNumber } from "@/lib/format";

const PLACEHOLDER = "USD | 2600 | 2660\nEUR | 3030 | 3110\nGBP | 3550 | 3640";

interface Message {
  kind: "success" | "error";
  text: string;
}

export default function BulkManager() {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<BulkParseResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [saved, setSaved] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const handlePreview = () => {
    setMessages([]);
    setSaved(false);
    setPublishResult(null);
    startTransition(async () => {
      const result = await previewBulk(text);
      if (!result.ok || !result.parsed) {
        setParsed(null);
        setMessages([{ kind: "error", text: result.error ?? "Could not parse input." }]);
        return;
      }
      setParsed(result.parsed);
    });
  };

  const handleSaveValid = () => {
    if (!parsed) return;
    setMessages([]);
    const validRows = parsed.rows
      .filter((r) => r.ok)
      .map((r) => ({
        currencyCode: r.currencyCode,
        buyingRate: r.buyingRate,
        sellingRate: r.sellingRate,
      }));
    startTransition(async () => {
      const result = await saveDrafts(validRows);
      if (result.ok) {
        setSaved(true);
        setMessages([
          { kind: "success", text: `Saved ${result.saved ?? validRows.length} valid row(s) as draft.` },
        ]);
      } else {
        setMessages([{ kind: "error", text: result.error ?? "Failed to save drafts." }]);
      }
    });
  };

  const handlePublish = () => {
    setMessages([]);
    startTransition(async () => {
      setPublishResult(await publish());
    });
  };

  const hasErrors = (parsed?.rows.length ?? 0) > (parsed?.validCount ?? 0);

  return (
    <div className="flex flex-col gap-4">
      <section className="card-shadow rounded-2xl bg-white p-6">
        <label
          htmlFor="bulk-rates"
          className="text-sm font-medium text-foreground"
        >
          Rate lines
        </label>
        <textarea
          id="bulk-rates"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setParsed(null);
            setSaved(false);
            setPublishResult(null);
          }}
          placeholder={PLACEHOLDER}
          rows={8}
          className="tabular mt-2 w-full rounded-lg border border-foreground/15 bg-white px-3.5 py-2.5 font-mono text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={pending || text.trim().length === 0}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && !parsed ? "Parsing…" : "Preview"}
          </button>
          {parsed && (
            <p className="text-sm text-muted">
              {parsed.validCount} of {parsed.rows.length} row(s) valid
              {hasErrors ? " — fix the highlighted rows before publishing." : "."}
            </p>
          )}
        </div>
      </section>

      {parsed && (
        <section className="card-shadow overflow-hidden rounded-2xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Currency</th>
                  <th className="px-4 py-3 font-medium">Buy</th>
                  <th className="px-4 py-3 font-medium">Sell</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {parsed.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-foreground/5 last:border-0 ${
                      row.ok ? "" : "bg-red-50"
                    }`}
                  >
                    <td className="px-5 py-2.5 font-medium text-foreground">
                      {row.currencyCode || "—"}
                    </td>
                    <td className="tabular px-4 py-2.5 text-foreground">
                      {Number.isFinite(row.buyingRate) ? formatRateNumber(row.buyingRate) : "—"}
                    </td>
                    <td className="tabular px-4 py-2.5 text-foreground">
                      {Number.isFinite(row.sellingRate) ? formatRateNumber(row.sellingRate) : "—"}
                    </td>
                    <td className="px-5 py-2.5">
                      {row.ok ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          OK
                        </span>
                      ) : (
                        <span className="text-xs text-red-700">{row.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsed.validCount > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground/10 bg-surface px-5 py-4">
              <p className="max-w-xl text-xs text-muted">
                Publishing replaces the live website rates. Previous rates are
                archived to history, never overwritten.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveValid}
                  disabled={pending || saved}
                  className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saved ? "Saved as draft" : "Save valid rows as draft"}
                </button>
                {saved && (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={pending}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pending ? "Publishing…" : "Publish"}
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      )}

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
