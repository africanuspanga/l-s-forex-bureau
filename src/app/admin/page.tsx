import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import {
  formatDateTime,
  formatRateNumber,
  getAdminOverview,
  getBotReferences,
  timeAgo,
} from "@/lib/rates";
import RunImportButton from "@/components/admin/RunImportButton";

export const metadata: Metadata = {
  title: "Admin Dashboard | L&S Forex Bureau",
};

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card-shadow rounded-2xl bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="tabular mt-1 font-display text-2xl font-semibold text-foreground">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const [overview, botRefs] = await Promise.all([
    getAdminOverview(),
    getBotReferences(10),
  ]);
  const validBotRefs = botRefs.filter((r) => r.validationStatus === "valid");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Overview of live rates, drafts and the Bank of Tanzania feed.
          </p>
        </div>
        <RunImportButton />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Published rates" value={String(overview.publishedCount)} />
        <StatCard
          label="Draft rates"
          value={String(overview.draftCount)}
          sub={overview.draftCount > 0 ? "Awaiting publication" : undefined}
        />
        <StatCard label="Active currencies" value={String(overview.activeCurrencies)} />
        <div className="card-shadow rounded-2xl bg-white p-5">
          <p className="text-sm text-muted">Last BoT sync</p>
          <p className="tabular mt-1 font-display text-lg font-semibold text-foreground">
            {overview.lastBotSyncAt ? formatDateTime(overview.lastBotSyncAt) : "Never"}
          </p>
          {overview.lastBotSyncStatus && (
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`rounded-full px-2 py-0.5 font-medium ${
                  overview.lastBotSyncStatus === "ok"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {overview.lastBotSyncStatus === "ok" ? "OK" : "Failed"}
              </span>
              {overview.lastBotSyncMessage && (
                <span className="text-muted">{overview.lastBotSyncMessage}</span>
              )}
            </p>
          )}
        </div>
        <StatCard
          label="Last L&S publication"
          value={overview.lastPublishedAt ? timeAgo(overview.lastPublishedAt) : "Never"}
          sub={overview.lastPublishedAt ? formatDateTime(overview.lastPublishedAt) : undefined}
        />
      </div>

      {/* Data-source health */}
      <section className="card-shadow rounded-2xl bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Data-source health
          </h2>
          {overview.lastBotSyncStatus && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                overview.lastBotSyncStatus === "ok"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {overview.lastBotSyncStatus === "ok" ? "Feed healthy" : "Feed failing"}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted">
          {overview.lastBotSyncMessage ??
            "No Bank of Tanzania import has run yet. Use the button above to run one."}
        </p>
        {validBotRefs.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-xs uppercase tracking-wide text-muted">
                  <th className="py-2 pr-4 font-medium">Currency</th>
                  <th className="py-2 pr-4 font-medium">BoT mean rate</th>
                  <th className="py-2 pr-4 font-medium">Transaction date</th>
                  <th className="py-2 font-medium">Fetched</th>
                </tr>
              </thead>
              <tbody>
                {validBotRefs.map((ref) => (
                  <tr key={ref.id} className="border-b border-foreground/5 last:border-0">
                    <td className="py-2 pr-4 font-medium text-foreground">
                      {ref.currencyCode}
                    </td>
                    <td className="tabular py-2 pr-4 text-foreground">
                      {formatRateNumber(ref.meanRate)}
                    </td>
                    <td className="py-2 pr-4 text-muted">{ref.transactionDate}</td>
                    <td className="py-2 text-muted">{timeAgo(ref.fetchedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-muted">
              {validBotRefs.length} valid reference rate
              {validBotRefs.length === 1 ? "" : "s"} in the last {botRefs.length} import
              record{botRefs.length === 1 ? "" : "s"}.
            </p>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-foreground/10 bg-surface px-4 py-3 text-sm text-muted">
            No valid BoT reference rates on file yet.
          </p>
        )}
      </section>

      {/* Recent rate changes */}
      <section className="card-shadow rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Recent rate changes
          </h2>
          <Link
            href="/admin/history"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {overview.recentHistory.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-xs uppercase tracking-wide text-muted">
                  <th className="py-2 pr-4 font-medium">Currency</th>
                  <th className="py-2 pr-4 font-medium">Buy</th>
                  <th className="py-2 pr-4 font-medium">Sell</th>
                  <th className="py-2 pr-4 font-medium">User</th>
                  <th className="py-2 pr-4 font-medium">Source</th>
                  <th className="py-2 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentHistory.map((h) => (
                  <tr key={h.id} className="border-b border-foreground/5 last:border-0">
                    <td className="py-2 pr-4 font-medium text-foreground">
                      {h.currencyCode}
                    </td>
                    <td className="tabular py-2 pr-4 text-foreground">
                      {h.previousBuyingRate !== null
                        ? formatRateNumber(h.previousBuyingRate)
                        : "-"}{" "}
                      → {formatRateNumber(h.newBuyingRate)}
                    </td>
                    <td className="tabular py-2 pr-4 text-foreground">
                      {h.previousSellingRate !== null
                        ? formatRateNumber(h.previousSellingRate)
                        : "-"}{" "}
                      → {formatRateNumber(h.newSellingRate)}
                    </td>
                    <td className="py-2 pr-4 text-muted">{h.user}</td>
                    <td className="py-2 pr-4">
                      <span className="rounded-full bg-surface-alt px-2 py-0.5 text-xs font-medium text-foreground">
                        {h.source}
                      </span>
                    </td>
                    <td className="py-2 text-muted">{timeAgo(h.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-foreground/10 bg-surface px-4 py-3 text-sm text-muted">
            No rate changes recorded yet.
          </p>
        )}
      </section>
    </div>
  );
}
