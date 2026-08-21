import "server-only";
import { readDb, updateDb } from "./store";
import type {
  Currency,
  Rate,
  RateHistoryEntry,
  RateSource,
  SuggestedRate,
  BotReferenceRate,
  MarginRule,
  Branch,
  DatabaseShape,
} from "./types";

export interface CurrencyRate {
  currency: Currency;
  buyingRate: number;
  sellingRate: number;
  effectiveAt: string;
  trend: "up" | "down" | "flat" | null; // vs previous published rate
  changePercent: number | null;
}

export { PHONE_DISPLAY, PHONE_TEL } from "./format";

/* ------------------------------ queries ------------------------------ */

export async function getCurrencies(): Promise<Currency[]> {
  const db = await readDb();
  return db.currencies
    .filter((c) => c.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getBranches(): Promise<Branch[]> {
  const db = await readDb();
  return db.branches.filter((b) => b.active);
}

export async function getBranchBySlug(slug: string): Promise<Branch | null> {
  const db = await readDb();
  return db.branches.find((b) => b.slug === slug && b.active) ?? null;
}

/** Latest published rate per currency, with trend vs previous value. */
export async function getPublishedRates(): Promise<CurrencyRate[]> {
  const db = await readDb();
  const currencies = db.currencies
    .filter((c) => c.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const result: CurrencyRate[] = [];
  for (const currency of currencies) {
    const history = db.rateHistory
      .filter((h) => h.currencyCode === currency.code)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const published = db.rates
      .filter((r) => r.currencyCode === currency.code && r.status === "published")
      .sort((a, b) => b.effectiveAt.localeCompare(a.effectiveAt));
    const current = published[0];
    if (!current) continue;

    const prev = history.length >= 2 ? history[history.length - 2] : null;
    let trend: CurrencyRate["trend"] = null;
    let changePercent: number | null = null;
    if (prev && prev.newSellingRate > 0) {
      const diff = current.sellingRate - prev.newSellingRate;
      changePercent = (diff / prev.newSellingRate) * 100;
      trend = Math.abs(changePercent) < 0.01 ? "flat" : diff > 0 ? "up" : "down";
    }
    result.push({
      currency,
      buyingRate: current.buyingRate,
      sellingRate: current.sellingRate,
      effectiveAt: current.effectiveAt,
      trend,
      changePercent,
    });
  }
  return result;
}

export async function getFeaturedRates(): Promise<CurrencyRate[]> {
  const all = await getPublishedRates();
  return all.filter((r) => r.currency.featured);
}

/** "Last updated" timestamp = latest effectiveAt among published rates. */
export async function getLastUpdatedAt(): Promise<string | null> {
  const db = await readDb();
  const published = db.rates.filter((r) => r.status === "published");
  if (published.length === 0) return null;
  return published
    .map((r) => r.effectiveAt)
    .sort()
    .at(-1)!;
}

/** Daily trend series (sell rate) for the last N days. */
export async function getRateTrend(
  currencyCode: string,
  days: 7 | 30
): Promise<{ date: string; sell: number; buy: number }[]> {
  const db = await readDb();
  const history = db.rateHistory
    .filter((h) => h.currencyCode === currencyCode)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .slice(-days);
  return history.map((h) => ({
    date: h.timestamp.slice(0, 10),
    sell: h.newSellingRate,
    buy: h.newBuyingRate,
  }));
}

/* --------------------------- admin: drafts ---------------------------- */

export interface DraftRateInput {
  currencyCode: string;
  buyingRate: number;
  sellingRate: number;
}

/** Replace the working draft set with the given rates. */
export async function saveDraftRates(
  inputs: DraftRateInput[],
  user: string
): Promise<void> {
  await updateDb((db) => {
    db.rates = db.rates.filter((r) => r.status !== "draft");
    const now = new Date().toISOString();
    for (const input of inputs) {
      db.rates.push({
        currencyCode: input.currencyCode,
        buyingRate: input.buyingRate,
        sellingRate: input.sellingRate,
        effectiveAt: now,
        status: "draft",
        source: "manual",
        createdBy: user,
        createdAt: now,
      });
    }
  });
}

export async function getDraftRates(): Promise<Rate[]> {
  const db = await readDb();
  return db.rates.filter((r) => r.status === "draft");
}

export interface PublishResult {
  published: number;
  errors: string[];
}

/**
 * Publish all draft rates. Validates each draft, archives the previously
 * published rate for that currency and appends history entries.
 * Historical records are never overwritten.
 */
export async function publishDraftRates(user: string): Promise<PublishResult> {
  const errors: string[] = [];
  let published = 0;
  await updateDb((db) => {
    const drafts = db.rates.filter((r) => r.status === "draft");
    const now = new Date().toISOString();

    for (const draft of drafts) {
      const v = validateRateValues(draft.currencyCode, draft.buyingRate, draft.sellingRate, db);
      if (v.length > 0) {
        errors.push(...v);
        continue;
      }
      const prev = db.rates
        .filter(
          (r) => r.currencyCode === draft.currencyCode && r.status === "published"
        )
        .sort((a, b) => b.effectiveAt.localeCompare(a.effectiveAt))[0];

      if (prev) prev.status = "archived";
      draft.status = "published";
      draft.effectiveAt = now;

      db.rateHistory.push({
        id: `hist-${draft.currencyCode}-${now}`,
        currencyCode: draft.currencyCode,
        previousBuyingRate: prev?.buyingRate ?? null,
        newBuyingRate: draft.buyingRate,
        previousSellingRate: prev?.sellingRate ?? null,
        newSellingRate: draft.sellingRate,
        user,
        source: draft.source,
        timestamp: now,
      });
      published++;
    }

    // Drop drafts that failed validation so they don't linger
    db.rates = db.rates.filter((r) => r.status !== "draft");
    if (published > 0) db.meta.lastPublishedAt = now;
  });
  return { published, errors };
}

export function validateRateValues(
  currencyCode: string,
  buyingRate: number,
  sellingRate: number,
  db: DatabaseShape
): string[] {
  const errors: string[] = [];
  const known = db.currencies.some((c) => c.code === currencyCode);
  if (!known) errors.push(`${currencyCode}: unrecognised currency code`);
  if (!buyingRate || buyingRate <= 0) errors.push(`${currencyCode}: buying rate must be above zero`);
  if (!sellingRate || sellingRate <= 0) errors.push(`${currencyCode}: selling rate must be above zero`);
  if (buyingRate > 0 && sellingRate > 0 && buyingRate >= sellingRate) {
    errors.push(`${currencyCode}: buying rate must be below selling rate`);
  }
  return errors;
}

export async function getRateHistory(limit = 100): Promise<RateHistoryEntry[]> {
  const db = await readDb();
  return db.rateHistory
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit);
}

/* --------------------------- bulk rate import -------------------------- */

export interface BulkParseResult {
  rows: (DraftRateInput & { ok: boolean; error?: string })[];
  validCount: number;
}

/**
 * Parse pasted lines like: `USD | 2600 | 2660` (also accepts comma/space/tab
 * separators, optional header line).
 */
export async function parseBulkRates(text: string): Promise<BulkParseResult> {
  const db = await readDb();
  const rows: BulkParseResult["rows"] = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^(currency|code)\b/i.test(line)) continue; // header
    const parts = line.split(/[|,\t]|\s{2,}/).map((p) => p.trim()).filter(Boolean);
    const [codeRaw, buyRaw, sellRaw] = parts;
    const currencyCode = (codeRaw ?? "").toUpperCase();
    const buyingRate = Number((buyRaw ?? "").replace(/,/g, ""));
    const sellingRate = Number((sellRaw ?? "").replace(/,/g, ""));
    const errs = parts.length < 3
      ? [`${line}: expected "CODE | buy | sell"`]
      : [
          ...(!/^[A-Z]{3}$/.test(currencyCode) ? [`"${codeRaw}" is not a valid currency code`] : []),
          ...(Number.isNaN(buyingRate) ? [`"${buyRaw}" is not a number`] : []),
          ...(Number.isNaN(sellingRate) ? [`"${sellRaw}" is not a number`] : []),
        ];
    const valueErrors =
      errs.length === 0 ? validateRateValues(currencyCode, buyingRate, sellingRate, db) : [];
    const all = [...errs, ...valueErrors];
    rows.push({
      currencyCode,
      buyingRate,
      sellingRate,
      ok: all.length === 0,
      error: all[0],
    });
  }
  return { rows, validCount: rows.filter((r) => r.ok).length };
}

/* ---------------------- BoT suggestions (margins) ---------------------- */

export function applyMarginRule(meanRate: number, rule: MarginRule, side: "buy" | "sell"): number {
  const pct = side === "buy" ? rule.buyMarginPercent : rule.sellMarginPercent;
  const fixed = side === "buy" ? rule.buyFixedAdjustment : rule.sellFixedAdjustment;
  let value = meanRate * (1 + pct / 100) + fixed;
  if (rule.roundingIncrement > 0) {
    value = Math.round(value / rule.roundingIncrement) * rule.roundingIncrement;
  }
  return Math.round(value * 100) / 100;
}

const MAX_DAILY_MOVE_PERCENT = 5; // safety threshold

/** Build suggested L&S rates from the latest valid BoT reference rates. */
export async function buildSuggestions(): Promise<SuggestedRate[]> {
  const db = await readDb();
  const suggestions: SuggestedRate[] = [];

  // latest valid BoT reference per currency
  const latestBot = new Map<string, BotReferenceRate>();
  for (const ref of db.botReferenceRates) {
    if (ref.validationStatus !== "valid") continue;
    const existing = latestBot.get(ref.currencyCode);
    if (!existing || ref.transactionDate > existing.transactionDate) {
      latestBot.set(ref.currencyCode, ref);
    }
  }

  for (const [code, ref] of latestBot) {
    const rule = db.marginRules.find((r) => r.currencyCode === code) ?? {
      currencyCode: code,
      buyMarginPercent: 0,
      sellMarginPercent: 0,
      buyFixedAdjustment: 0,
      sellFixedAdjustment: 0,
      roundingIncrement: 0,
      autoPublishEnabled: false,
    };
    const current = db.rates
      .filter((r) => r.currencyCode === code && r.status === "published")
      .sort((a, b) => b.effectiveAt.localeCompare(a.effectiveAt))[0];

    const suggestedBuyingRate = applyMarginRule(ref.meanRate, rule, "buy");
    const suggestedSellingRate = applyMarginRule(ref.meanRate, rule, "sell");

    const validations: SuggestedRate["validations"] = [];
    const push = (ruleName: string, passed: boolean, detail?: string) =>
      validations.push({ rule: ruleName, passed, detail });

    const today = new Date().toISOString().slice(0, 10);
    push("Source transaction date is current", ref.transactionDate >= today.slice(0, 8) + "01", `BoT date ${ref.transactionDate}`);
    push("Currency code recognised", db.currencies.some((c) => c.code === code));
    push("No zero values", suggestedBuyingRate > 0 && suggestedSellingRate > 0);
    push("Buying below selling", suggestedBuyingRate < suggestedSellingRate);
    if (current) {
      const move = Math.abs(suggestedSellingRate - current.sellingRate) / current.sellingRate * 100;
      push(
        `Move within ${MAX_DAILY_MOVE_PERCENT}% threshold`,
        move <= MAX_DAILY_MOVE_PERCENT,
        `${move.toFixed(2)}% move`
      );
    } else {
      push("Previous rate exists", true, "first publication for currency");
    }

    suggestions.push({
      currencyCode: code,
      suggestedBuyingRate,
      suggestedSellingRate,
      botMeanRate: ref.meanRate,
      botTransactionDate: ref.transactionDate,
      currentBuyingRate: current?.buyingRate ?? null,
      currentSellingRate: current?.sellingRate ?? null,
      validations,
      ok: validations.every((v) => v.passed),
    });
  }

  return suggestions.sort((a, b) => a.currencyCode.localeCompare(b.currencyCode));
}

export async function getBotReferences(limit = 50): Promise<BotReferenceRate[]> {
  const db = await readDb();
  return db.botReferenceRates
    .slice()
    .sort((a, b) => b.fetchedAt.localeCompare(a.fetchedAt))
    .slice(0, limit);
}

export async function getMarginRules(): Promise<MarginRule[]> {
  const db = await readDb();
  return db.marginRules;
}

export async function saveMarginRule(rule: MarginRule): Promise<void> {
  await updateDb((db) => {
    const idx = db.marginRules.findIndex((r) => r.currencyCode === rule.currencyCode);
    if (idx >= 0) db.marginRules[idx] = rule;
    else db.marginRules.push(rule);
  });
}

export async function getAdminOverview(db?: DatabaseShape) {
  const data = db ?? (await readDb());
  const published = data.rates.filter((r) => r.status === "published");
  const drafts = data.rates.filter((r) => r.status === "draft");
  return {
    publishedCount: published.length,
    draftCount: drafts.length,
    activeCurrencies: data.currencies.filter((c) => c.active).length,
    lastBotSyncAt: data.meta.lastBotSyncAt,
    lastBotSyncStatus: data.meta.lastBotSyncStatus,
    lastBotSyncMessage: data.meta.lastBotSyncMessage,
    lastPublishedAt: data.meta.lastPublishedAt,
    recentHistory: data.rateHistory
      .slice()
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 10),
  };
}

/* ------------------------------ formatting ---------------------------- */
// Formatting helpers live in the client-safe ./format module and are
// re-exported here so existing server-side imports keep working.
export {
  formatTzs,
  formatRateNumber,
  formatDateTime,
  timeAgo,
} from "./format";
