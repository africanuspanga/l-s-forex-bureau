import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { DatabaseShape, RateHistoryEntry } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

let writeQueue: Promise<void> = Promise.resolve();

async function readRaw(): Promise<string> {
  return fs.readFile(DB_PATH, "utf-8");
}

export async function readDb(): Promise<DatabaseShape> {
  const db = JSON.parse(await readRaw()) as DatabaseShape;
  if (db.rateHistory.length === 0) {
    db.rateHistory = synthesizeSeedHistory(db);
    await writeDb(db);
  }
  return db;
}

export function writeDb(db: DatabaseShape): Promise<void> {
  const payload = JSON.stringify(db, null, 2);
  writeQueue = writeQueue.then(() => fs.writeFile(DB_PATH, payload, "utf-8"));
  return writeQueue;
}

export async function updateDb(
  mutator: (db: DatabaseShape) => void | Promise<void>
): Promise<DatabaseShape> {
  const db = await readDb();
  await mutator(db);
  await writeDb(db);
  return db;
}

/**
 * Seeds 30 days of deterministic daily history ending at the current
 * published rates, so trend charts have data before real publications
 * accumulate. Uses a simple seeded pseudo-random walk per currency.
 */
function synthesizeSeedHistory(db: DatabaseShape): RateHistoryEntry[] {
  const entries: RateHistoryEntry[] = [];
  const published = db.rates.filter((r) => r.status === "published");
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (const rate of published) {
    let seedNum = 0;
    for (const ch of rate.currencyCode) seedNum = seedNum * 31 + ch.charCodeAt(0);

    let prevBuy: number | null = null;
    let prevSell: number | null = null;
    // Walk backwards from today's rate
    const buySeries: number[] = [rate.buyingRate];
    const sellSeries: number[] = [rate.sellingRate];
    for (let d = 1; d <= 30; d++) {
      seedNum = (seedNum * 1103515245 + 12345) % 2147483648;
      const drift = ((seedNum % 1000) / 1000 - 0.5) * 0.012; // ±0.6% daily
      buySeries.unshift(buySeries[0] / (1 + drift));
      sellSeries.unshift(sellSeries[0] / (1 + drift));
    }
    for (let d = 0; d <= 30; d++) {
      const ts = new Date(now - (30 - d) * dayMs);
      ts.setUTCHours(7, 45, 0, 0);
      const buy = round2(buySeries[d]);
      const sell = round2(sellSeries[d]);
      entries.push({
        id: `seed-${rate.currencyCode}-${d}`,
        currencyCode: rate.currencyCode,
        previousBuyingRate: prevBuy,
        newBuyingRate: buy,
        previousSellingRate: prevSell,
        newSellingRate: sell,
        user: "system",
        source: "seed",
        timestamp: ts.toISOString(),
      });
      prevBuy = buy;
      prevSell = sell;
    }
  }
  return entries;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
