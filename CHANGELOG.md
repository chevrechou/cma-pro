# Changelog

All notable changes to CMA Pro are documented here.

Format: [Semantic Versioning](https://semver.org) — `MAJOR.MINOR.PATCH`

---

## [1.0.0] — 2026-05-24

Initial release.

### Added

**Authentication**
- Email/password sign-up and sign-in via Supabase Auth
- Session persistence across app restarts using AsyncStorage
- Email format validation and 8-character minimum password on registration
- Password confirmation field on registration

**4-Step CMA Creation Flow**
- Step 1 — Subject property form: address, city, state, ZIP, beds, baths, sqft, lot sqft, year built, condition (Excellent/Good/Average/Fair/Poor), property type, garage spaces
- Step 2 — Comparable search: live Zillow data via RapidAPI, filtered by ZIP/bed/bath/sqft range; one-tap include/exclude per comp
- Step 3 — Adjustments: dollar adjustments per comparable with +/− stepper and notes field
- Step 4 — Report: suggested price, low/high range, market statistics, comp list; save to account

**CMA Calculations**
- Avg and median adjusted sale price
- Avg price per sqft, avg days on market, avg list-to-sale ratio
- Suggested price: `avg_price_per_sqft × subject_sqft × condition_multiplier`
- Price range: ±3% around suggested, rounded to nearest $1,000
- Condition multipliers: Excellent 1.05, Good 1.02, Average 1.00, Fair 0.96, Poor 0.90

**Dashboard**
- List of all saved CMA reports with suggested price, address, beds/baths/sqft, comp count, date, and client name
- Pull-to-refresh
- Inline error display on fetch failure

**Report Detail View**
- Full saved report: suggested price card, subject property, market statistics, comp list with adjustments
- Delete report with confirmation dialog and error handling

**Settings**
- Agent profile: full name, brokerage, license number, phone
- RapidAPI key field with show/hide toggle
- Sign out

**Infrastructure**
- Supabase Postgres schema with Row Level Security (agents see only their own reports)
- Indexes on `agent_id` and `created_at`
- `updated_at` auto-trigger
- Zustand store for multi-step CMA flow state
- Stable comp IDs (address-based fallback, no Math.random())
- Cached `Intl.NumberFormat` for currency formatting

**App Store Readiness**
- Bundle ID `com.chevrechou.cmapro`, iOS 16.0 deployment target
- Privacy manifest declaring UserDefaults, FileTimestamp, SystemBootTime, DiskSpace APIs
- `ITSAppUsesNonExemptEncryption: false`
- Safe area insets on all custom headers and fixed bottom bars (Dynamic Island / home indicator safe)
- Splash screen converted to 32-bit RGBA
- EAS build profiles: development, preview, production
