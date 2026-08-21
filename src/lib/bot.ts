import "server-only";
import { readDb, updateDb } from "@/lib/store";
import type { BotReferenceRate } from "@/lib/types";

/**
 * Bank of Tanzania reference-rate importer.
 *
 * IMPORTANT: this module NEVER writes to `db.rates` (the L&S customer-facing
 * rates). BoT data is reference-only — it lands in `db.botReferenceRates` as
 * an audit trail. Rate suggestions and publishing live elsewhere (see
 * src/lib/rates.ts and the admin area). On any failure the previously
 * published L&S rates remain untouched.
 */

export interface BotImportResult {
  status: "ok" | "failed";
  message: string;
  importedCount: number;
  transactionDate: string | null;
  skippedReason?: string;
}

export interface ParsedBotRow {
  currencyCode: string;
  buyingRate: number;
  sellingRate: number;
  meanRate: number;
}

export interface ParsedBotPage {
  transactionDate: string | null; // YYYY-MM-DD
  rows: ParsedBotRow[];
  warnings: string[];
}

const BOT_URL = "https://www.bot.go.tz/ExchangeRate/excRates";
const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

const FETCH_TIMEOUT_MS = 15000;
/** Tolerance for `buying <= mean <= selling` consistency checks. */
const MEAN_TOLERANCE = 0.005;
/** Minimum number of parsed rows before we trust the page parse at all. */
const MIN_PARSED_ROWS = 5;

const MONTHS: Record<string, string> = {
  jan: "01", january: "01",
  feb: "02", february: "02",
  mar: "03", march: "03",
  apr: "04", april: "04",
  may: "05",
  jun: "06", june: "06",
  jul: "07", july: "07",
  aug: "08", august: "08",
  sep: "09", september: "09",
  oct: "10", october: "10",
  nov: "11", november: "11",
  dec: "12", december: "12",
};

/** Today's date in Africa/Dar_es_Salaam (BoT's timezone), YYYY-MM-DD. */
export function todayInDarEsSalaam(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Dar_es_Salaam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  // en-CA yields YYYY-MM-DD already; normalize defensively.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(parts);
  return m ? parts : now.toISOString().slice(0, 10);
}

/** Strip HTML tags and decode the common entities BoT pages use. */
function stripHtml(fragment: string): string {
  return fragment
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse "2,335.42" or "2335.42" into a number; null when not numeric. */
function parseNumberCell(text: string): number | null {
  const cleaned = text.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Normalize a currency cell ("US Dollar / USD", "1 USD", "USD") to ISO code. */
function extractCurrencyCode(text: string): string | null {
  const codes = text.toUpperCase().match(/\b[A-Z]{3}\b/g);
  if (!codes) return null;
  // Prefer a code that sits alone or in parentheses (typical ISO code column).
  return codes[codes.length - 1];
}

/**
 * Extract a transaction/effective date near the rates table. Supports
 * "21-Aug-26" (BoT row format), "21 Aug 2026", "August 21, 2026",
 * "2026-08-21", "21/08/2026" (day-first).
 */
function extractDate(htmlText: string): string | null {
  // 2026-08-21
  let m = /(\d{4})-(\d{2})-(\d{2})/.exec(htmlText);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  // 21-Aug-26 / 21-August-2026 (BoT "Transaction Date" column format)
  m = /(\d{1,2})-([A-Za-z]{3,9})-(\d{2,4})\b/.exec(htmlText);
  if (m) {
    const month = MONTHS[m[2].toLowerCase()];
    if (month) {
      const year = m[3].length === 2 ? `20${m[3]}` : m[3];
      return `${year}-${month}-${m[1].padStart(2, "0")}`;
    }
  }

  // 21 Aug 2026 / 21 August 2026
  m = /(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s*,?\s+(\d{4})/.exec(htmlText);
  if (m) {
    const month = MONTHS[m[2].toLowerCase()];
    if (month) return `${m[3]}-${month}-${m[1].padStart(2, "0")}`;
  }

  // August 21, 2026
  m = /([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\s*,\s*(\d{4})/.exec(htmlText);
  if (m) {
    const month = MONTHS[m[1].toLowerCase()];
    if (month) return `${m[3]}-${month}-${m[2].padStart(2, "0")}`;
  }

  // 21/08/2026 or 21.08.2026 (day-first, as on BoT)
  m = /\b(\d{1,2})[/.](\d{1,2})[/.](\d{4})\b/.exec(htmlText);
  if (m) {
    const day = Number(m[1]);
    const month = Number(m[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${m[3]}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }
  return null;
}

/**
 * Defensive regex/string-based parser for the BoT exchange-rates page.
 * BoT page structures change over time, so this walks every HTML table row,
 * extracts its cells, and heuristically maps them to (code, buying, selling,
 * mean), tolerating extra columns and whitespace. Pure and side-effect free.
 */
export function parseBotHtml(html: string): ParsedBotPage {
  const warnings: string[] = [];
  const rows: ParsedBotRow[] = [];

  const rowMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
  const rowDates: string[] = [];
  for (const rowHtml of rowMatches) {
    const cells = (rowHtml.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) ?? []).map(stripHtml);
    if (cells.length < 3) continue;

    // Capture a date from any cell in the row (BoT has a Transaction Date column).
    for (const cell of cells) {
      const d = extractDate(cell);
      if (d) {
        rowDates.push(d);
        break;
      }
    }

    // Find the cell holding the ISO currency code.
    const codeIndex = cells.findIndex((c) => extractCurrencyCode(c) !== null && !/^\d/.test(c));
    if (codeIndex === -1) continue;
    const currencyCode = extractCurrencyCode(cells[codeIndex]);
    if (!currencyCode) continue;

    // Numeric cells, in document order.
    const numericCells = cells
      .map((c, i) => ({ value: parseNumberCell(c), index: i }))
      .filter((c): c is { value: number; index: number } => c.value !== null);
    if (numericCells.length < 3) continue;

    // Typical BoT order: buying, selling, mean. If the three numbers don't
    // satisfy buying < mean < selling, try picking the triple that does.
    let buying: number | null = null;
    let selling: number | null = null;
    let mean: number | null = null;
    for (let i = 0; i + 2 < numericCells.length; i++) {
      const a = numericCells[i].value;
      const b = numericCells[i + 1].value;
      const c = numericCells[i + 2].value;
      if (a < c && b >= c && Math.abs(b - c) / c < 0.5) {
        // a < c <= b, and b,c close — likely buying, selling, mean
        buying = a; selling = b; mean = c;
        break;
      }
    }
    if (buying === null || selling === null || mean === null) {
      // Fall back to the last three numeric cells in order.
      const last3 = numericCells.slice(-3);
      buying = last3[0].value;
      selling = last3[1].value;
      mean = last3[2].value;
    }

    rows.push({ currencyCode, buyingRate: buying, sellingRate: selling, meanRate: mean });
  }

  // De-duplicate by currency code (keep first occurrence).
  const seen = new Set<string>();
  const deduped = rows.filter((r) => {
    if (seen.has(r.currencyCode)) return false;
    seen.add(r.currencyCode);
    return true;
  });

  // Prefer the modal date from table rows (the Transaction Date column);
  // fall back to page text, then to today in Dar es Salaam.
  let transactionDate: string | null = null;
  if (rowDates.length > 0) {
    const counts = new Map<string, number>();
    for (const d of rowDates) counts.set(d, (counts.get(d) ?? 0) + 1);
    transactionDate = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }
  if (!transactionDate) {
    const pageText = stripHtml(html);
    transactionDate = extractDate(pageText);
  }
  if (!transactionDate) {
    transactionDate = todayInDarEsSalaam();
    warnings.push(
      `No transaction date found on BoT page; defaulted to today (Africa/Dar_es_Salaam): ${transactionDate}`
    );
  }

  return { transactionDate, rows: deduped, warnings };
}

/** Per-row validation. Returns the list of validation errors (empty = valid). */
export function validateBotRow(
  row: ParsedBotRow,
  knownCurrencyCodes: Set<string>
): string[] {
  const errors: string[] = [];
  if (!/^[A-Z]{3}$/.test(row.currencyCode)) {
    errors.push(`Currency code "${row.currencyCode}" is not a 3-letter uppercase ISO code.`);
  } else if (!knownCurrencyCodes.has(row.currencyCode)) {
    // Not fatal: store anyway, but flag it.
    errors.push(`Currency code "${row.currencyCode}" is not in the L&S currency list.`);
  }
  if (row.buyingRate <= 0 || row.sellingRate <= 0 || row.meanRate <= 0) {
    errors.push("Rates must all be greater than zero.");
  }
  if (row.buyingRate >= row.sellingRate) {
    errors.push(`Buying rate (${row.buyingRate}) must be below selling rate (${row.sellingRate}).`);
  }
  const tol = row.meanRate * MEAN_TOLERANCE;
  if (row.buyingRate > row.meanRate + tol || row.sellingRate < row.meanRate - tol) {
    errors.push(
      `Mean rate (${row.meanRate}) outside buying/selling band (tolerance ${MEAN_TOLERANCE * 100}%).`
    );
  }
  return errors;
}

async function recordSyncFailure(message: string): Promise<void> {
  await updateDb((db) => {
    db.meta.lastBotSyncAt = new Date().toISOString();
    db.meta.lastBotSyncStatus = "failed";
    db.meta.lastBotSyncMessage = message;
  });
}

/**
 * Fetch the BoT page, parse and validate it, and store reference rows.
 * Never touches `db.rates`; failed validation keeps existing published rates.
 */
export async function runBotImport(): Promise<BotImportResult> {
  const fail = async (message: string): Promise<BotImportResult> => {
    await recordSyncFailure(message);
    return { status: "failed", message, importedCount: 0, transactionDate: null };
  };

  // 1. Fetch the BoT page server-side.
  let html: string;
  try {
    const res = await fetch(BOT_URL, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) {
      return fail(`BoT reference import failed: HTTP ${res.status} from ${BOT_URL}. Existing L&S rates remain published.`);
    }
    html = await res.text();
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return fail(`BoT reference import failed: fetch error (${detail}). Existing L&S rates remain published.`);
  }

  // 2. Parse.
  const parsed = parseBotHtml(html);
  if (parsed.rows.length < MIN_PARSED_ROWS) {
    return fail(
      `BoT reference import failed validation: only ${parsed.rows.length} currency rows parsed (need ${MIN_PARSED_ROWS}+). Existing L&S rates remain published.`
    );
  }
  const transactionDate = parsed.transactionDate ?? todayInDarEsSalaam();

  // 3. Once-per-business-day skip: a VALID row for this date already exists.
  const db = await readDb();
  const alreadyImported = db.botReferenceRates.some(
    (r) => r.transactionDate === transactionDate && r.validationStatus === "valid"
  );
  if (alreadyImported) {
    return {
      status: "ok",
      message: `BoT reference import skipped: ${transactionDate} already imported.`,
      importedCount: 0,
      transactionDate,
      skippedReason: "Transaction date already imported",
    };
  }

  // 4. All expected MAJOR currencies must be present.
  const majorCodes = db.currencies.filter((c) => c.category === "major").map((c) => c.code);
  const parsedCodes = new Set(parsed.rows.map((r) => r.currencyCode));
  const missingMajors = majorCodes.filter((code) => !parsedCodes.has(code));
  if (missingMajors.length > 0) {
    return fail(
      `BoT reference import failed validation: missing major currencies (${missingMajors.join(", ")}). Existing L&S rates remain published.`
    );
  }

  // 5. Validate rows and store the audit trail.
  const knownCurrencyCodes = new Set(db.currencies.map((c) => c.code));
  const nowIso = new Date().toISOString();
  const entries: BotReferenceRate[] = parsed.rows.map((row) => {
    const errors = [...parsed.warnings, ...validateBotRow(row, knownCurrencyCodes)];
    return {
      id: `bot-${row.currencyCode}-${transactionDate}`,
      currencyCode: row.currencyCode,
      buyingRate: row.buyingRate,
      sellingRate: row.sellingRate,
      meanRate: row.meanRate,
      transactionDate,
      fetchedAt: nowIso,
      rawSource: BOT_URL,
      validationStatus: errors.length === 0 ? "valid" : "failed",
      ...(errors.length > 0 ? { validationErrors: errors } : {}),
    };
  });

  const validCount = entries.filter((e) => e.validationStatus === "valid").length;
  const message =
    validCount === entries.length
      ? `BoT reference import ok: ${entries.length} currencies imported for ${transactionDate}.`
      : `BoT reference import completed with warnings: ${validCount}/${entries.length} rows valid for ${transactionDate}. Existing L&S rates remain published.`;

  await updateDb((db) => {
    // Replace any existing (e.g. previously failed) rows for this date.
    db.botReferenceRates = db.botReferenceRates.filter(
      (r) => r.transactionDate !== transactionDate
    );
    db.botReferenceRates.push(...entries);
    db.meta.lastBotSyncAt = nowIso;
    db.meta.lastBotSyncStatus = "ok";
    db.meta.lastBotSyncMessage = message;
  });

  return { status: "ok", message, importedCount: entries.length, transactionDate };
}

/**
 * Frankfurter fallback — reference/comparison only. Returns TZS-per-currency
 * implied rates keyed by currency code, or null on failure. NOT wired into
 * publishing; exported as a standalone utility.
 */
export async function fetchFrankfurterReference(): Promise<Record<string, number> | null> {
  const endpoints = [
    {
      url: "https://api.frankfurter.dev/v1/latest?base=TZS",
      extract: (data: unknown) => (data as { rates?: Record<string, number> }).rates ?? null,
    },
    {
      url: "https://api.frankfurter.app/latest?from=TZS",
      extract: (data: unknown) => (data as { rates?: Record<string, number> }).rates ?? null,
    },
  ];

  for (const { url, extract } of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": FETCH_HEADERS["User-Agent"], Accept: "application/json" },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        cache: "no-store",
      });
      if (!res.ok) continue;
      const rates = extract(await res.json());
      if (!rates) continue;
      // Frankfurter gives "units of foreign currency per 1 TZS"; invert to
      // get TZS per 1 unit of foreign currency.
      const implied: Record<string, number> = {};
      for (const [code, value] of Object.entries(rates)) {
        if (typeof value === "number" && value > 0) {
          implied[code] = 1 / value;
        }
      }
      return Object.keys(implied).length > 0 ? implied : null;
    } catch {
      // Try the fallback host.
    }
  }
  return null;
}
