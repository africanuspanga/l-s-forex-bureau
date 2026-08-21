"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from "@/lib/auth";
import {
  parseBulkRates,
  publishDraftRates,
  saveDraftRates,
  saveMarginRule,
  type BulkParseResult,
  type DraftRateInput,
  type PublishResult,
} from "@/lib/rates";
import { updateDb } from "@/lib/store";
import { runBotImport } from "@/lib/bot";
import type { MarginRule } from "@/lib/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const UNAUTHORISED: ActionResult = { ok: false, error: "Unauthorised" };

function revalidateAdminAndPublic(): void {
  revalidatePath("/");
  revalidatePath("/rates");
  revalidatePath("/admin");
  revalidatePath("/admin/rates");
  revalidatePath("/admin/bulk");
  revalidatePath("/admin/suggestions");
  revalidatePath("/admin/history");
  revalidatePath("/admin/margins");
}

/* --------------------------------- auth --------------------------------- */

export type LoginState = ActionResult | null;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get("password");
  if (typeof password !== "string" || password.length === 0) {
    return { ok: false, error: "Enter the admin password." };
  }
  if (!(await verifyPassword(password))) {
    return { ok: false, error: "Incorrect password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------ draft rates ------------------------------ */

export interface SaveDraftsResult extends ActionResult {
  saved?: number;
}

export async function saveDrafts(
  rows: DraftRateInput[]
): Promise<SaveDraftsResult> {
  if (!(await isAuthenticated())) return UNAUTHORISED;
  const clean = rows
    .filter(
      (r) =>
        typeof r.currencyCode === "string" &&
        Number.isFinite(r.buyingRate) &&
        Number.isFinite(r.sellingRate)
    )
    .map((r) => ({
      currencyCode: r.currencyCode,
      buyingRate: r.buyingRate,
      sellingRate: r.sellingRate,
    }));
  if (clean.length === 0) {
    return { ok: false, error: "No valid rows to save." };
  }
  await saveDraftRates(clean, "admin");
  revalidateAdminAndPublic();
  return { ok: true, saved: clean.length };
}

export interface PublishActionResult extends ActionResult {
  published?: number;
  errors?: string[];
}

export async function publish(): Promise<PublishActionResult> {
  if (!(await isAuthenticated())) return UNAUTHORISED;
  const result: PublishResult = await publishDraftRates("admin");
  revalidateAdminAndPublic();
  if (result.errors.length > 0) {
    return {
      ok: result.published > 0,
      published: result.published,
      errors: result.errors,
      error:
        result.published === 0
          ? "Nothing was published — fix the validation errors below."
          : undefined,
    };
  }
  return { ok: true, published: result.published, errors: [] };
}

/* ------------------------------- bulk update ----------------------------- */

export interface PreviewBulkResult extends ActionResult {
  parsed?: BulkParseResult;
}

export async function previewBulk(text: string): Promise<PreviewBulkResult> {
  if (!(await isAuthenticated())) return UNAUTHORISED;
  if (typeof text !== "string" || text.trim().length === 0) {
    return { ok: false, error: "Paste at least one rate line." };
  }
  const parsed = await parseBulkRates(text);
  if (parsed.rows.length === 0) {
    return { ok: false, error: "No rate lines found in the pasted text." };
  }
  return { ok: true, parsed };
}

/* ------------------------------- suggestions ----------------------------- */

export async function acceptSuggestion(
  currencyCode: string,
  buyingRate: number,
  sellingRate: number
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return UNAUTHORISED;
  if (
    typeof currencyCode !== "string" ||
    !/^[A-Z]{3}$/.test(currencyCode) ||
    !Number.isFinite(buyingRate) ||
    !Number.isFinite(sellingRate) ||
    buyingRate <= 0 ||
    sellingRate <= 0 ||
    buyingRate >= sellingRate
  ) {
    return { ok: false, error: "Invalid suggested rate values." };
  }
  await saveDraftRates(
    [{ currencyCode, buyingRate, sellingRate }],
    "admin"
  );
  revalidateAdminAndPublic();
  return { ok: true };
}

/* ------------------------------- margin rules ---------------------------- */

export async function saveMargin(rule: MarginRule): Promise<ActionResult> {
  if (!(await isAuthenticated())) return UNAUTHORISED;
  const numericFields = [
    rule.buyMarginPercent,
    rule.sellMarginPercent,
    rule.buyFixedAdjustment,
    rule.sellFixedAdjustment,
    rule.roundingIncrement,
  ];
  if (
    typeof rule.currencyCode !== "string" ||
    !/^[A-Z]{3}$/.test(rule.currencyCode) ||
    !numericFields.every((n) => typeof n === "number" && Number.isFinite(n))
  ) {
    return { ok: false, error: "Invalid margin rule values." };
  }
  await saveMarginRule({
    currencyCode: rule.currencyCode,
    buyMarginPercent: rule.buyMarginPercent,
    sellMarginPercent: rule.sellMarginPercent,
    buyFixedAdjustment: rule.buyFixedAdjustment,
    sellFixedAdjustment: rule.sellFixedAdjustment,
    roundingIncrement: rule.roundingIncrement,
    autoPublishEnabled: Boolean(rule.autoPublishEnabled),
  });
  revalidateAdminAndPublic();
  return { ok: true };
}

/* ----------------------------- currency flags ---------------------------- */

export async function saveCurrencyFlags(
  currencyCode: string,
  active: boolean,
  featured: boolean
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return UNAUTHORISED;
  if (typeof currencyCode !== "string" || !/^[A-Z]{3}$/.test(currencyCode)) {
    return { ok: false, error: "Invalid currency code." };
  }
  let found = false;
  await updateDb((db) => {
    const currency = db.currencies.find((c) => c.code === currencyCode);
    if (currency) {
      currency.active = Boolean(active);
      currency.featured = Boolean(featured);
      found = true;
    }
  });
  if (!found) return { ok: false, error: `Unknown currency ${currencyCode}.` };
  revalidateAdminAndPublic();
  return { ok: true };
}

/* -------------------------------- BoT import ----------------------------- */

export interface RunImportResult extends ActionResult {
  status?: "ok" | "failed";
  message?: string;
  importedCount?: number;
  transactionDate?: string | null;
}

export async function runImport(): Promise<RunImportResult> {
  if (!(await isAuthenticated())) return UNAUTHORISED;
  const result = await runBotImport();
  revalidateAdminAndPublic();
  return {
    ok: result.status === "ok",
    status: result.status,
    message: result.message,
    importedCount: result.importedCount,
    transactionDate: result.transactionDate,
    error: result.status === "failed" ? result.message : undefined,
  };
}
