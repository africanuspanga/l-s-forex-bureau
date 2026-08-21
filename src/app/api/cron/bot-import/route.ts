import { NextResponse } from "next/server";
import { runBotImport } from "@/lib/bot";

export const runtime = "nodejs";

/**
 * Vercel cron entry point for the Bank of Tanzania reference-rate import.
 * Scheduled 3×/day (see vercel.json); the importer's once-per-business-day
 * skip logic makes the repeated runs cheap no-ops.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authorization = request.headers.get("authorization");
    if (authorization !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  // CRON_SECRET unset (local dev): allow the request through.

  try {
    const result = await runBotImport();
    return NextResponse.json(result, { status: result.status === "ok" ? 200 : 502 });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        status: "failed",
        message: `BoT reference import crashed: ${detail}. Existing L&S rates remain published.`,
        importedCount: 0,
        transactionDate: null,
      },
      { status: 502 }
    );
  }
}
