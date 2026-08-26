"use client";

import { useState, useTransition } from "react";
import { saveMargin } from "@/app/admin/actions";
import type { MarginRule } from "@/lib/types";

interface RuleRow extends MarginRule {
  isNew: boolean;
}

interface RowStatus {
  kind: "success" | "error";
  text: string;
}

function toInput(n: number): string {
  return String(n);
}

export default function MarginsManager({
  rules,
  availableCurrencies,
}: {
  rules: MarginRule[];
  availableCurrencies: { code: string; name: string }[];
}) {
  const [rows, setRows] = useState<RuleRow[]>([
    ...rules.map((r) => ({ ...r, isNew: false })),
  ]);
  const [statuses, setStatuses] = useState<Record<string, RowStatus>>({});
  const [newCode, setNewCode] = useState(availableCurrencies[0]?.code ?? "");
  const [pending, startTransition] = useTransition();

  const updateRow = (code: string, patch: Partial<RuleRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.currencyCode === code ? { ...r, ...patch } : r))
    );
  };

  const numberField = (
    row: RuleRow,
    field:
      | "buyMarginPercent"
      | "sellMarginPercent"
      | "buyFixedAdjustment"
      | "sellFixedAdjustment"
      | "roundingIncrement",
    label: string
  ) => (
    <input
      type="number"
      step="any"
      value={toInput(row[field])}
      aria-label={`${row.currencyCode} ${label}`}
      onChange={(e) => {
        const value = Number(e.target.value);
        if (Number.isFinite(value)) updateRow(row.currencyCode, { [field]: value });
      }}
      className="tabular w-24 rounded-lg border border-foreground/15 px-2.5 py-1.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
  );

  const handleSave = (row: RuleRow) => {
    startTransition(async () => {
      const result = await saveMargin({
        currencyCode: row.currencyCode,
        buyMarginPercent: row.buyMarginPercent,
        sellMarginPercent: row.sellMarginPercent,
        buyFixedAdjustment: row.buyFixedAdjustment,
        sellFixedAdjustment: row.sellFixedAdjustment,
        roundingIncrement: row.roundingIncrement,
        autoPublishEnabled: row.autoPublishEnabled,
      });
      setStatuses((prev) => ({
        ...prev,
        [row.currencyCode]: result.ok
          ? { kind: "success", text: "Saved." }
          : { kind: "error", text: result.error ?? "Failed to save." },
      }));
      if (result.ok) {
        setRows((prev) =>
          prev.map((r) =>
            r.currencyCode === row.currencyCode ? { ...r, isNew: false } : r
          )
        );
      }
    });
  };

  const handleAdd = () => {
    if (!newCode || rows.some((r) => r.currencyCode === newCode)) return;
    setRows((prev) => [
      ...prev,
      {
        currencyCode: newCode,
        buyMarginPercent: 0,
        sellMarginPercent: 0,
        buyFixedAdjustment: 0,
        sellFixedAdjustment: 0,
        roundingIncrement: 0,
        autoPublishEnabled: false,
        isNew: true,
      },
    ]);
    const remaining = availableCurrencies.filter((c) => c.code !== newCode);
    setNewCode(remaining[0]?.code ?? "");
  };

  const remainingCurrencies = availableCurrencies.filter(
    (c) => !rows.some((r) => r.currencyCode === c.code)
  );

  return (
    <section className="card-shadow overflow-hidden rounded-2xl bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-foreground/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Currency</th>
              <th className="px-4 py-3 font-medium">Buy margin %</th>
              <th className="px-4 py-3 font-medium">Sell margin %</th>
              <th className="px-4 py-3 font-medium">Buy fixed adj</th>
              <th className="px-4 py-3 font-medium">Sell fixed adj</th>
              <th className="px-4 py-3 font-medium">Rounding</th>
              <th className="px-4 py-3 font-medium">Auto-publish</th>
              <th className="px-5 py-3 font-medium">Save</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = statuses[row.currencyCode];
              return (
                <tr
                  key={row.currencyCode}
                  className="border-b border-foreground/5 last:border-0"
                >
                  <td className="px-5 py-3 font-medium text-foreground">
                    {row.currencyCode}
                    {row.isNew && (
                      <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-primary-deep">
                        new
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{numberField(row, "buyMarginPercent", "buy margin percent")}</td>
                  <td className="px-4 py-3">{numberField(row, "sellMarginPercent", "sell margin percent")}</td>
                  <td className="px-4 py-3">{numberField(row, "buyFixedAdjustment", "buy fixed adjustment")}</td>
                  <td className="px-4 py-3">{numberField(row, "sellFixedAdjustment", "sell fixed adjustment")}</td>
                  <td className="px-4 py-3">{numberField(row, "roundingIncrement", "rounding increment")}</td>
                  <td className="px-4 py-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted">
                      <input
                        type="checkbox"
                        checked={row.autoPublishEnabled}
                        onChange={(e) =>
                          updateRow(row.currencyCode, {
                            autoPublishEnabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-primary"
                      />
                      Enabled
                    </label>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex flex-col items-start gap-1">
                      <button
                        type="button"
                        onClick={() => handleSave(row)}
                        disabled={pending}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Save
                      </button>
                      {status && (
                        <span
                          role="status"
                          className={`text-xs ${
                            status.kind === "success" ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {status.text}
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add rule row */}
      <div className="flex flex-wrap items-center gap-3 border-t border-foreground/10 bg-surface px-5 py-4">
        {remainingCurrencies.length > 0 ? (
          <>
            <label htmlFor="new-rule-currency" className="text-sm text-muted">
              Add rule for
            </label>
            <select
              id="new-rule-currency"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="rounded-lg border border-foreground/15 bg-white px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary"
            >
              {remainingCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newCode}
              className="rounded-lg border border-primary px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add rule
            </button>
          </>
        ) : (
          <p className="text-sm text-muted">
            Every active currency already has a margin rule.
          </p>
        )}
      </div>
    </section>
  );
}
