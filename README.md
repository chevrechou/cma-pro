# CMA Pro

A mobile app for real estate agents to generate Comparative Market Analysis reports. Search live comparable sales, apply adjustments, and produce a suggested list price — all from a phone.

Built with Expo + React Native. Runs on iOS and Android.

---

## Features

- **Live comp search** — pulls recently sold properties from Zillow by ZIP code, bed/bath/sqft range
- **One-tap include/exclude** — toggle comps in and out of the analysis
- **Dollar adjustments** — add per-comp adjustments for condition, lot size, upgrades, pool, etc.
- **Market statistics** — avg sale price, median, $/sqft, days on market, list-to-sale ratio
- **Suggested price range** — condition-weighted low/high/suggested based on included comps
- **Saved reports** — all CMAs stored to your account, accessible from the dashboard
- **Client info** — attach a client name and email to each report

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Expo](https://expo.dev) 56 / React Native 0.85 |
| Navigation | [Expo Router](https://expo.github.io/router) (file-based) |
| UI | [Tamagui](https://tamagui.dev) v2 |
| State | [Zustand](https://github.com/pmndrs/zustand) |
| Auth + DB | [Supabase](https://supabase.com) (Postgres + RLS) |
| Comp data | [Zillow Com1 via RapidAPI](https://rapidapi.com/apimaker/api/zillow-com1) |
| Build/deploy | [EAS Build](https://docs.expo.dev/build/introduction/) |

---

## Quick Start

See **[NEXT_STEPS.md](./NEXT_STEPS.md)** for the full setup walkthrough, including:

1. Creating a Supabase project and running the schema
2. Getting a RapidAPI key for Zillow
3. Creating `.env.local` with your credentials
4. Running the app with `npx expo start`

---

## Project Structure

```
cma-pro/
├── app/
│   ├── (auth)/          # Login and register screens
│   ├── (tabs)/          # Dashboard and Settings (tab bar)
│   ├── new-cma/         # 4-step CMA creation flow
│   │   ├── index.tsx    # Step 1: Subject property form
│   │   ├── comps.tsx    # Step 2: Comparable search & selection
│   │   ├── adjust.tsx   # Step 3: Per-comp adjustments
│   │   └── report.tsx   # Step 4: Final report + save
│   └── cma/[id].tsx     # Saved report detail view
├── lib/
│   ├── cma.ts           # CMA calculations and formatters
│   ├── store.ts         # Zustand state for new CMA flow
│   ├── supabase.ts      # Supabase client
│   └── zillow.ts        # RapidAPI/Zillow integration
├── types/
│   └── index.ts         # TypeScript types (SubjectProperty, Comparable, etc.)
├── supabase/
│   └── schema.sql       # Database schema and RLS policies
└── assets/              # Icons and splash screen
```

---

## Environment Variables

Create a `.env.local` in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The RapidAPI key for Zillow is entered in-app under **Settings → API Keys** and stored in your Supabase user profile — it is never hardcoded.

---

## Database

The Supabase schema lives in `supabase/schema.sql`. It creates:

- `cma_reports` table — stores subject property, comps, market stats, and suggested prices as JSONB
- Row Level Security policy — agents can only read and write their own reports
- `updated_at` trigger — auto-maintained timestamp
- Indexes on `agent_id` and `created_at` for query performance

Run the SQL file once in your Supabase SQL editor before first use.

---

## CMA Calculation Logic

All pricing math is in `lib/cma.ts`:

- **Average adjusted price** — mean of `sale_price + adjustment` across included comps
- **Suggested price** — `avg_price_per_sqft × subject_sqft × condition_multiplier`, rounded to nearest $1,000
- **Price range** — ±3% around the suggested price
- **Condition multipliers:** Excellent 1.05 · Good 1.02 · Average 1.00 · Fair 0.96 · Poor 0.90

---

## App Store

See **[APP_STORE_SUBMISSION.md](./APP_STORE_SUBMISSION.md)** for the full submission checklist, including EAS build commands, App Store Connect setup, required screenshots, and the privacy policy.

---

## License

MIT
