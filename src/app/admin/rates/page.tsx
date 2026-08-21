import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCurrencies, getDraftRates, getPublishedRates } from "@/lib/rates";
import RatesManager, {
  type RateManagerRow,
} from "@/components/admin/RatesManager";

export const metadata: Metadata = {
  title: "Manage Rates | L&S Forex Bureau",
};

export default async function AdminRatesPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const [currencies, published, drafts] = await Promise.all([
    getCurrencies(),
    getPublishedRates(),
    getDraftRates(),
  ]);

  const publishedMap = new Map(published.map((r) => [r.currency.code, r]));
  const draftMap = new Map(drafts.map((d) => [d.currencyCode, d]));

  const rows: RateManagerRow[] = currencies.map((currency) => {
    const pub = publishedMap.get(currency.code);
    const draft = draftMap.get(currency.code);
    return {
      code: currency.code,
      name: currency.name,
      flag: currency.flag,
      active: currency.active,
      featured: currency.featured,
      publishedBuy: pub?.buyingRate ?? null,
      publishedSell: pub?.sellingRate ?? null,
      draftBuy: String(draft?.buyingRate ?? pub?.buyingRate ?? ""),
      draftSell: String(draft?.sellingRate ?? pub?.sellingRate ?? ""),
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Manage Rates
        </h1>
        <p className="mt-1 text-sm text-muted">
          Edit draft rates per currency, then save and publish when ready.
        </p>
      </div>
      <RatesManager rows={rows} />
    </div>
  );
}
