# Rates data flow & BoT reference importer

## Data flow

External source → server → database → website. The browser **never** calls
external rate providers directly. All fetching happens in server-only modules
(`import "server-only"`), results are stored in `data/db.json` via
`src/lib/store.ts`, and pages/API routes read from the store.

- `db.rates` — L&S customer-facing buying/selling rates (published by admin).
- `db.botReferenceRates` — Bank of Tanzania reference rates (audit trail only).
- `db.meta` — sync/publish timestamps and last BoT import status.

## BoT reference importer (`src/lib/bot.ts`)

`runBotImport()` fetches `https://www.bot.go.tz/Publications/ExchangeRates`
server-side, parses the HTML table with a defensive regex parser
(`parseBotHtml`, exported/pure for tests), validates each row, and stores
results in `db.botReferenceRates`. It **never** writes to `db.rates` —
BoT data is reference-only; suggestions and publishing live elsewhere.

Key behaviours:

- Once per business day: if a valid row for the parsed transaction date
  already exists, the run is skipped (`skippedReason` set).
- All "major" currencies from `db.currencies` must be present, and at least
  5 rows must parse — otherwise the whole import fails.
- Safety rule: **failed validation keeps existing published rates.** Failures
  only update `db.meta.lastBotSync*`; nothing customer-facing changes.
- `fetchFrankfurterReference()` is an exported reference-only fallback
  (Frankfurter API, TZS-per-currency). Not wired into publishing.

## Cron (`src/app/api/cron/bot-import/route.ts`)

Vercel cron calls `GET /api/cron/bot-import` at 08:00, 10:00, 12:00 EAT
(`0 5/7/9 * * *` UTC in `vercel.json`). Repeats are cheap no-ops thanks to
the once-per-day skip. If `CRON_SECRET` is set, the route requires
`Authorization: Bearer <CRON_SECRET>`; unset (local dev) allows all.

## Supabase migration path

When moving off the JSON file: replace the internals of `src/lib/store.ts`
(read/write/update) and `src/lib/auth.ts` with Supabase clients. Importer,
routes, and pages keep working unchanged since they only depend on those
modules' interfaces.
