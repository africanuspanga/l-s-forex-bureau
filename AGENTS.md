<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# L&S Forex Bureau — Website

Premium marketing + rates website for **L&S Forex Bureau**, a physical foreign exchange
bureau in Dar es Salaam (branches: Tegeta, Mbezi Beach, Mikocheni, Masaki).

**This is NOT an online forex shop.** No checkout, cart, online payment, delivery, or
currency reservation — the site shows indicative rates, a calculator, branch info, and
drives customers to call or visit a branch. Do not add transactional features unless
L&S management explicitly requests them.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript (strict) + Tailwind CSS v4
- Local JSON data store (`data/db.json`) — Supabase Postgres/Auth swap planned later
- No other runtime dependencies (`server-only` is the only added package)

## Commands

```bash
npm run dev     # dev server
npm run build   # production build (must stay green)
npm run start   # serve production build
```

## Project layout

```
data/db.json                 # the database (currencies, rates, history, BoT refs, margins, branches, meta)
data/contact-messages.json   # runtime-only contact form submissions (gitignored)
public/logo.png              # L&S logo — white/cyan on transparent: dark backgrounds ONLY
src/lib/types.ts             # all shared types (DatabaseShape, Rate, Currency, Branch, ...)
src/lib/store.ts             # JSON file store: readDb / writeDb / updateDb + seed history synthesis
src/lib/format.ts            # CLIENT-SAFE helpers: formatTzs, formatRateNumber, formatDateTime, timeAgo, PHONE_*
src/lib/rates.ts             # server-only domain logic: published rates, drafts, publish, bulk parse,
                             # margin suggestions, trends, admin overview
src/lib/bot.ts               # Bank of Tanzania reference importer (never writes db.rates!)
src/lib/auth.ts              # admin password gate (HMAC cookie) — swap this file for Supabase Auth later
src/lib/messages.ts          # contact-message persistence
src/app/                     # public pages: / rates about services branches/[slug] contact privacy
src/app/admin/               # dashboard, rates, bulk, suggestions, history, margins, login, actions.ts
src/app/api/contact/         # contact form endpoint
src/app/api/cron/bot-import/ # cron endpoint for the BoT importer
src/components/              # Navbar, Footer, ExchangeCalculator, home/, rates/, branches/, admin/, contact/
vercel.json                  # Vercel cron: 08:00 / 10:00 / 12:00 EAT (05/07/09 UTC)
```

## Architecture rules (important)

1. **Rate data flow:** external source → server → `data/db.json` → website. The browser
   NEVER calls BoT/Frankfurter directly. Public pages read ONLY published rates.
2. **BoT data is reference-only.** `bot.go.tz` imports land in `botReferenceRates` and
   become L&S rates only after an admin approves suggestions and publishes. On any
   import/validation failure the previously published L&S rates stay online
   ("Existing L&S rates remain published").
3. **History is append-only.** Publishing archives the old published row and appends a
   `rateHistory` entry (prev/new buy/sell, user, source, timestamp). Never overwrite.
4. **`src/lib/rates.ts`, `store.ts`, `bot.ts`, `auth.ts` are server-only.** Client
   components import helpers from `src/lib/format.ts` instead (importing server-only
   modules into a client bundle breaks the build).
5. **Wording:** rates are "indicative" / "Today's Rates" / "Latest L&S Rates" — never
   "LIVE", "real-time", or "guaranteed". Converter output is an "Estimated conversion".
6. **No invented facts:** no founding year, customer counts, awards, or extra financial
   services. Branch addresses/hours are `[CLIENT TO CONFIRM …]` placeholders in
   `data/db.json` — do not fill them in with guesses.

## Brand

- Primary `#013ae1` (nav, primary buttons), accent `#09c3fe`, white, dark navy text
  `#0a1440` (`primary-deep`), light surfaces `#f2f6ff`. Tailwind tokens in
  `src/app/globals.css` (`primary`, `accent`, `primary-deep`, `surface`, `muted`, …) plus
  custom classes `bg-hero-mesh`, `bg-brand-gradient`, `text-gradient`, `card-shadow`,
  `card-shadow-lg`, `tabular`, `animate-fade-up`.
- Fonts: Sora (`font-display`, headings) + Inter (`font-sans`, body) via next/font.
- Phone everywhere: `0743 881 309` / `tel:+255743881309`.

## Admin

- URL `/admin/login`. Password = env `ADMIN_PASSWORD` (dev fallback `ls-admin-dev`);
  session secret env `ADMIN_SESSION_SECRET` (fallback `dev-secret`). **Set both in
  production.** Cookie `ls_admin`, HMAC-signed, httpOnly, 8 h.
- Pages: Dashboard (stats, BoT health, recent changes, manual import button),
  Manage Rates (draft → publish), Bulk Update (paste `USD | 2600 | 2660` lines, preview,
  publish valid rows only), Suggestions (BoT mean → margin-rule suggestions with
  validation checklist, accept-as-draft), History, Margin Rules.
- Margin rules (`rate_margin_rules`) are configurable per currency
  (`buyMarginPercent`, `sellMarginPercent`, fixed adjustments, `roundingIncrement`).
  `autoPublishEnabled` is stored but intentionally NOT acted on — publishing is always
  manual in this phase. Current percentages are EXAMPLES from the brief; L&S management
  must set the real commercial rules.

## BoT importer & cron

- Source: `https://www.bot.go.tz/ExchangeRate/excRates` (server-rendered table:
  Currency | Buying | Selling | Mean | Transaction Date `21-Aug-26`).
  The older `/Publications/ExchangeRates` URL 404s — do not "fix" it back.
- `runBotImport()` fetches, parses (defensive regex parser, `parseBotHtml` is pure),
  validates per row, requires all major currencies present, imports once per
  transaction date, stores an audit trail, never touches `db.rates`.
- `fetchFrankfurterReference()` is an exported but unwired comparison fallback.
- Cron: `vercel.json` hits `/api/cron/bot-import` at 05:00/07:00/09:00 UTC
  (08:00/10:00/12:00 Africa/Dar_es_Salaam); the importer skips once the day's
  transaction date is imported. Protect with env `CRON_SECRET` in production
  (unset = open, for local dev).

## Environment variables

| Variable | Purpose | Fallback (dev only) |
| --- | --- | --- |
| `ADMIN_PASSWORD` | admin login | `ls-admin-dev` |
| `ADMIN_SESSION_SECRET` | session HMAC secret | `dev-secret` |
| `CRON_SECRET` | Bearer token for cron endpoint | unset = open |

## Known limitations / next steps

- Public Navbar/Footer render around `/admin` too (single root layout) — cosmetic;
  fix with a route group if desired.
- `data/db.json` file store is single-instance only; for Vercel/multi-instance deploys
  migrate to Supabase (swap `store.ts` + `auth.ts`; see `src/lib/README-rates.md`).
- Seed rates in `data/db.json` are illustrative — replace via admin or BoT suggestions.
- Seed `rateHistory` is auto-synthesized (30 days) on first run so trend charts render;
  real history accumulates from then on.
- Contact messages are stored in `data/contact-messages.json` (no email hookup yet).

## Session handover — 2026-08-26

This is one of three sibling sites for the same agency (all reviewed together):
- Papa Faru: https://github.com/africanuspanga/papa-faru (local: `~/Papa Faru Forex`, port 3001)
- Desderia: https://github.com/africanuspanga/desderia-forex (local: `~/Desderia Forex `, port 3002)

Full redesign pass to fix agency feedback ("cards look AI-generated"). Design system,
rationale, and what to watch for next time this feedback recurs is written up in full
in the Claude memory system under `feedback-ai-slop-design-system` (not in this repo) —
worth reading before making further visual changes here.

Short version of what changed (public marketing pages only — `/admin/*` was left as-is,
out of scope since it's an internal tool, not what the agency reviews):
- Reusable component classes added to `globals.css`: `.btn` / `.btn-primary` /
  `.btn-accent` / `.btn-outline` / `.btn-dark` / `.btn-white` / `.btn-ghost-light` (12px
  radius, never pill), `.card` (whisper shadow, no colored glow), `.eyebrow` (quiet
  kicker label, replaces pill badges), `.badge` (small rect status badges). Reuse these
  instead of inlining new pill/glow Tailwind classes.
- Hero background is a real photo (`public/photos/hero-bridge.jpg`, Kigamboni Bridge) +
  `.hero-scrim` gradient. Inner-page hero bands (About/Services/Branches/Contact/Rates/
  Privacy) kept `.bg-hero-mesh` but it's now a flat brand-color gradient, not the old
  radial-glow "mesh" — didn't wire photos into every subpage, only the homepage hero and
  the WhyChoose panel (`public/photos/harbor-dusk.jpg`, low-opacity overlay).
- `WhyChoose`, the About-page "Our Approach" grid, and the Services page were rewritten:
  round 1 dropped icon-box cards for `border-l-2` accent lists / plain `.card p-8`
  grids, but that *still* read as "AI card grid" in agency review. Round 2 fix:
  WhyChoose and the About values grid now use one flowing editorial paragraph + a
  single-row fact strip with hairline (`h-4 w-px` / `border-white/20`) dividers between
  short phrases, no boxes. Services page became a divided list (title/description
  columns separated by `divide-y`) instead of a 2×2 card grid. `TrustStrip` and
  `HowItWorks` were left as border-accent lists / numbered steps — HowItWorks'
  numbering is legitimate (it's a real 4-step sequence), so that one wasn't touched.
  If "still looks AI" feedback recurs, suspect the shape (N visually equal blocks)
  before suspecting styling.
- Added `src/components/RatesTicker.tsx`: a fixed, auto-scrolling rates strip under the
  navbar (`.ticker-*` classes in `globals.css`), wired by making `layout.tsx` an async
  Server Component that calls `getFeaturedRates()`. Its divided-strip look deliberately
  echoes the WhyChoose fact strip. Note this also runs on `/admin/*` pages since there's
  a single root layout (same pre-existing limitation as Navbar/Footer above).
- Navbar kept its solid blue background (unlike Papa Faru/Desderia, which had to switch
  to white for their real logos) — just fixed pill nav-links/buttons to 12px radius.
- Adding the ticker pushed every page's top padding down by 40px — Hero uses `pt-34`,
  and every subpage sharing the `bg-hero-mesh pt-24` pattern now uses `bg-hero-mesh
  pt-34`. If you touch header height (navbar or ticker), these need to move together;
  Tailwind v4's spacing scale accepts any integer step so arbitrary numbers like `pt-34`
  are valid, not typos.
- Real logo/favicon were already correctly wired before this session (`public/logo.png`,
  white/cyan on transparent, dark backgrounds only — don't put it on a light surface).
- Repo already existed with 2 prior commits; pushed 2 more this session (design system +
  ticker/WhyChoose rounds) to https://github.com/africanuspanga/l-s-forex-bureau. Some
  unrelated pre-existing working-tree changes (em dash → hyphen swaps in admin pages,
  a couple binary asset updates) were bundled into the first of those two commits since
  they were already sitting uncommitted — not something this session introduced.
- Dar es Salaam stock photography for hero/section imagery lives in
  `/Users/admin/Downloads/Dar-City-Images` — several unused images remain there for
  future sections (branch pages, etc.) — check before asking the user for new photos.

**Not done / possible next steps:** RateCard, ExchangeCalculator, BranchesExplorer,
ContactForm, RatesExplorer got button/shadow/radius fixes only, not a full editorial
redesign. `/admin/*` UI wasn't touched at all. No automated tests exist. Verified via
`curl` + dev-server logs only this session — no browser screenshot verification was done
(Chrome extension wasn't connected); worth an actual visual pass next session.
