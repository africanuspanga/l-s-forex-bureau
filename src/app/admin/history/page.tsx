import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { formatDateTime, formatRateNumber, getRateHistory } from "@/lib/rates";

export const metadata: Metadata = {
  title: "Rate History | L&S Forex Bureau",
};

const SOURCE_STYLES: Record<string, string> = {
  manual: "bg-surface-alt text-foreground",
  bot_suggestion: "bg-primary/10 text-primary",
  bulk_import: "bg-accent-soft text-primary-deep",
  seed: "bg-foreground/10 text-muted",
};

export default async function AdminHistoryPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const history = await getRateHistory(200);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Rate History
        </h1>
        <p className="mt-1 text-sm text-muted">
          Every publication is retained. Historical rate records are never
          overwritten.
        </p>
      </div>

      <section className="card-shadow overflow-hidden rounded-2xl bg-white">
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Currency</th>
                  <th className="px-4 py-3 font-medium">Buy</th>
                  <th className="px-4 py-3 font-medium">Sell</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-foreground/5 last:border-0">
                    <td className="px-5 py-2.5 text-muted">
                      {formatDateTime(h.timestamp)}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      {h.currencyCode}
                    </td>
                    <td className="tabular px-4 py-2.5 text-foreground">
                      {h.previousBuyingRate !== null
                        ? formatRateNumber(h.previousBuyingRate)
                        : "—"}{" "}
                      → {formatRateNumber(h.newBuyingRate)}
                    </td>
                    <td className="tabular px-4 py-2.5 text-foreground">
                      {h.previousSellingRate !== null
                        ? formatRateNumber(h.previousSellingRate)
                        : "—"}{" "}
                      → {formatRateNumber(h.newSellingRate)}
                    </td>
                    <td className="px-4 py-2.5 text-muted">{h.user}</td>
                    <td className="px-5 py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          SOURCE_STYLES[h.source] ?? "bg-surface-alt text-foreground"
                        }`}
                      >
                        {h.source}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-12 text-center text-sm text-muted">
            No rate history recorded yet.
          </p>
        )}
      </section>
    </div>
  );
}
