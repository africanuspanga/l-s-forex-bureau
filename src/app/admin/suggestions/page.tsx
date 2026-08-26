import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import {
  buildSuggestions,
  formatRateNumber,
  getBotReferences,
  timeAgo,
} from "@/lib/rates";
import AcceptSuggestionButton from "@/components/admin/AcceptSuggestionButton";

export const metadata: Metadata = {
  title: "BoT Suggestions | L&S Forex Bureau",
};

export default async function AdminSuggestionsPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const [suggestions, botRefs] = await Promise.all([
    buildSuggestions(),
    getBotReferences(20),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          BoT Rate Suggestions
        </h1>
        <p className="mt-1 text-sm text-muted">
          Rates derived from the Bank of Tanzania reference feed.
        </p>
      </div>

      <div className="rounded-xl border border-primary/20 bg-surface-alt px-4 py-3 text-sm text-foreground">
        Bank of Tanzania rates are a reference source. Suggestions are computed
        from your margin rules and only become L&S customer rates when you
        approve and publish them.
      </div>

      {suggestions.length === 0 ? (
        <section className="card-shadow rounded-2xl bg-white px-6 py-12 text-center">
          <p className="font-medium text-foreground">
            No BoT reference rates imported yet.
          </p>
          <p className="mt-1 text-sm text-muted">
            Run the importer from the{" "}
            <Link href="/admin" className="font-medium text-primary hover:underline">
              Dashboard
            </Link>
            .
          </p>
        </section>
      ) : (
        <section className="card-shadow overflow-hidden rounded-2xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Currency</th>
                  <th className="px-4 py-3 font-medium">BoT mean</th>
                  <th className="px-4 py-3 font-medium">BoT date</th>
                  <th className="px-4 py-3 font-medium">Current buy / sell</th>
                  <th className="px-4 py-3 font-medium">Suggested buy / sell</th>
                  <th className="px-4 py-3 font-medium">Validations</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s) => (
                  <tr
                    key={s.currencyCode}
                    className="border-b border-foreground/5 align-top last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">
                      {s.currencyCode}
                    </td>
                    <td className="tabular px-4 py-3 text-foreground">
                      {formatRateNumber(s.botMeanRate)}
                    </td>
                    <td className="px-4 py-3 text-muted">{s.botTransactionDate}</td>
                    <td className="tabular px-4 py-3 text-muted">
                      {s.currentBuyingRate !== null && s.currentSellingRate !== null
                        ? `${formatRateNumber(s.currentBuyingRate)} / ${formatRateNumber(s.currentSellingRate)}`
                        : "-"}
                    </td>
                    <td className="tabular px-4 py-3 font-medium text-foreground">
                      {formatRateNumber(s.suggestedBuyingRate)} /{" "}
                      {formatRateNumber(s.suggestedSellingRate)}
                    </td>
                    <td className="px-4 py-3">
                      <ul className="flex flex-wrap gap-1.5">
                        {s.validations.map((v, i) => (
                          <li
                            key={i}
                            title={v.detail ?? v.rule}
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              v.passed
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <span aria-hidden>{v.passed ? "✓" : "✗"}</span>
                            {v.rule}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-5 py-3">
                      <AcceptSuggestionButton
                        currencyCode={s.currencyCode}
                        buyingRate={s.suggestedBuyingRate}
                        sellingRate={s.suggestedSellingRate}
                        disabled={!s.ok}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-foreground/10 bg-surface px-5 py-3 text-xs text-muted">
            Accepted suggestions are saved as drafts. Publish them from{" "}
            <Link href="/admin/rates" className="font-medium text-primary hover:underline">
              Manage Rates
            </Link>
            .
          </p>
        </section>
      )}

      {/* Recent BoT reference imports */}
      <section className="card-shadow rounded-2xl bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Recent BoT reference imports
        </h2>
        {botRefs.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-xs uppercase tracking-wide text-muted">
                  <th className="py-2 pr-4 font-medium">Currency</th>
                  <th className="py-2 pr-4 font-medium">Mean</th>
                  <th className="py-2 pr-4 font-medium">Transaction date</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Fetched</th>
                </tr>
              </thead>
              <tbody>
                {botRefs.map((ref) => (
                  <tr key={ref.id} className="border-b border-foreground/5 last:border-0">
                    <td className="py-2 pr-4 font-medium text-foreground">
                      {ref.currencyCode}
                    </td>
                    <td className="tabular py-2 pr-4 text-foreground">
                      {formatRateNumber(ref.meanRate)}
                    </td>
                    <td className="py-2 pr-4 text-muted">{ref.transactionDate}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          ref.validationStatus === "valid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        title={ref.validationErrors?.join("; ")}
                      >
                        {ref.validationStatus}
                      </span>
                    </td>
                    <td className="py-2 text-muted">{timeAgo(ref.fetchedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-foreground/10 bg-surface px-4 py-3 text-sm text-muted">
            No BoT reference imports on record.
          </p>
        )}
      </section>
    </div>
  );
}
