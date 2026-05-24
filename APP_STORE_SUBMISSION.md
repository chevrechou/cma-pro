# CMA Pro — App Store Submission Guide

## Prerequisites

- Mac running macOS 13+
- Xcode 15+ installed (free from Mac App Store)
- Apple Developer account ($99/yr — [developer.apple.com](https://developer.apple.com))
- Expo account (free — [expo.dev](https://expo.dev))

---

## Step 1: Create an Expo Account and Link the Project

```bash
# Install EAS CLI globally if not already installed
npm install -g eas-cli

# Log in to Expo
eas login

# From the project root, initialize EAS and get a project ID
cd ~/cma-pro
eas init
```

This writes your `projectId` into `app.json` under `extra.eas.projectId`. Commit that change:

```bash
git add app.json
git commit -m "chore: add EAS project ID"
git push
```

---

## Step 2: Create the App in App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) and sign in.
2. Click **+** → **New App**.
3. Fill in:
   - **Platform:** iOS
   - **Name:** CMA Pro
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** `com.chevrechou.cmapro` (must match `app.json`)
   - **SKU:** `cmapro-ios-1` (any unique string)
4. Click **Create**.
5. From the App Information page, copy:
   - **Apple ID** (10-digit number in the URL) → `ascAppId` in `eas.json`
   - **Team ID** (from [developer.apple.com/account](https://developer.apple.com/account) → Membership) → `appleTeamId` in `eas.json`

Update `eas.json`:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "michaelchang@alumni.usc.edu",
      "ascAppId": "XXXXXXXXXX",
      "appleTeamId": "XXXXXXXXXX"
    }
  }
}
```

---

## Step 3: Build the Production App

```bash
eas build --platform ios --profile production
```

- EAS will prompt you to create or use an existing provisioning profile and distribution certificate — choose **automatically managed** when asked.
- The build runs on Expo's cloud servers (no local Xcode required).
- Build takes ~10–15 minutes. You'll get a link to download the `.ipa` when done.

---

## Step 4: Submit to App Store

```bash
eas submit --platform ios --latest
```

`--latest` automatically uses the most recent successful production build. EAS will upload the `.ipa` to App Store Connect via the Transporter API.

---

## Step 5: Complete the App Store Listing

In App Store Connect, fill in all required fields before submitting for review:

### App Information
- **Category:** Finance (primary), Business (secondary)
- **Content Rights:** No third-party content
- **Age Rating:** 4+ (run the questionnaire — all answers are "No")

### Pricing and Availability
- Set price (Free recommended to start)
- Select all available territories

### App Privacy
- In the **App Privacy** section, declare:
  - **Data Not Collected** — CMA Pro does not collect data linked to the user's identity for advertising
  - **Authentication Data** (email/password) — collected, linked to identity, used for app functionality only
- Submit your privacy policy URL (see Step 6)

### App Description (copy/paste ready)

**Name:** CMA Pro — Market Analysis

**Subtitle:** Comparable Sales for Agents

**Description:**
```
CMA Pro is a professional Comparative Market Analysis tool built for real estate agents.

Quickly generate accurate pricing reports by pulling live comparable sales data, adjusting for property differences, and presenting a suggested list price range backed by real data.

FEATURES
• Search recent sold comparables via ZIP code
• Toggle and include/exclude comps with one tap
• Add dollar adjustments per comparable for condition, upgrades, or lot size
• Automatic market statistics: avg price, median, $/sqft, days on market, list/sale ratio
• Condition-based pricing multipliers (Excellent → Poor)
• Save and manage all your CMA reports
• Client name and email on every report

WHO IT'S FOR
Residential real estate agents who need fast, defensible pricing for listing appointments and buyer consultations.
```

**Keywords:** real estate, CMA, comparative market analysis, listing price, comps, agent, realtor, home value, property analysis, market report

**Support URL:** https://github.com/chevrechou/cma-pro/issues

**Marketing URL:** (optional)

### Screenshots (required)

You need screenshots for **6.7-inch iPhone** (required) and optionally 5.5-inch. The fastest way:

```bash
# Open in iOS Simulator (requires Xcode)
eas build --platform ios --profile development --local
# Then run on a 6.7" simulator (iPhone 16 Pro Max) and take screenshots from:
# Xcode menu → Simulator → File → Take Screenshot
```

Required screens to capture (5–10 screenshots):
1. Dashboard with a saved CMA report
2. Subject property entry form
3. Comparables selection screen
4. Adjust screen with an adjustment applied
5. Report screen showing the suggested price

---

## Step 6: Add a Privacy Policy

Apple requires a privacy policy URL. The simplest approach:

1. Create a `privacy-policy.md` in the repo (or a GitHub Gist).
2. Go to `github.com/chevrechou/cma-pro` → Settings → Pages → enable GitHub Pages from `main`.
3. Your privacy policy URL will be `https://chevrechou.github.io/cma-pro/privacy-policy`.

Minimum required content for a "data not sold, email used only for auth" app:

```markdown
# Privacy Policy — CMA Pro

Last updated: 2026-05-24

CMA Pro collects your email address and password solely to authenticate you
within the app. This data is stored securely via Supabase and is never sold,
shared with third parties, or used for advertising.

CMA reports you create are stored in your account and are only accessible by you.

Contact: michaelchang@alumni.usc.edu
```

---

## Step 7: Submit for Review

1. In App Store Connect, go to your app → **+ Version** → enter `1.0`.
2. Fill in "What's New" (e.g. "Initial release").
3. Attach the build uploaded in Step 4 (it appears under **Build** after processing, ~30 min).
4. Complete all required fields (screenshots, description, privacy policy URL).
5. Click **Add for Review** → **Submit to App Review**.

Apple review typically takes **1–3 business days** for a new app.

---

## Common Rejection Reasons and Fixes

| Rejection | Fix |
|---|---|
| Missing privacy policy URL | Add GitHub Pages URL (Step 6) |
| Crash on launch | Test on a real device before submitting |
| Login required with no demo account | Add a note in the review notes: "Requires sign-up — use test@example.com / TestPass123" and create that account |
| Screenshot size wrong | Must be exactly 1290×2796px (6.7") or 1242×2208px (5.5") |
| `ITSAppUsesNonExemptEncryption` missing | Already set to `false` in `app.json` — no action needed |

---

## Ongoing: Releasing Updates

```bash
# Bump version in app.json ("version": "1.0.1")
# EAS auto-increments buildNumber — no manual change needed

eas build --platform ios --profile production
eas submit --platform ios --latest
```

In App Store Connect, create a new version, attach the new build, and submit.
