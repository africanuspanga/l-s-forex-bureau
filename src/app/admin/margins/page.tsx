import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCurrencies, getMarginRules } from "@/lib/rates";
import MarginsManager from "@/components/admin/MarginsManager";

export const metadata: Metadata = {
  title: "Margin Rules | L&S Forex Bureau",
};

export default async function AdminMarginsPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const [rules, currencies] = await Promise.all([getMarginRules(), getCurrencies()]);

  const ruledCodes = new Set(rules.map((r) => r.currencyCode));
  const availableCurrencies = currencies
    .filter((c) => !ruledCodes.has(c.code))
    .map((c) => ({ code: c.code, name: c.name }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Margin Rules
        </h1>
        <p className="mt-1 text-sm text-muted">
          Commercial rules applied to BoT reference rates to compute L&S
          customer rate suggestions.
        </p>
      </div>

      <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        These percentages are configurable commercial rules set by L&S
        management. With auto-publish off, suggestions always require manual
        approval. Note: auto-publish is stored for a future phase only; the
        importer never auto-publishes in this phase.
      </div>

      <MarginsManager rules={rules} availableCurrencies={availableCurrencies} />
    </div>
  );
}
