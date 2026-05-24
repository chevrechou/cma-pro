# Privacy Policy — CMA Pro

**Last updated: May 24, 2026**

This privacy policy describes how CMA Pro ("the app", "we") handles information when you use the iOS and Android application.

---

## What We Collect

### Account Information
When you create an account, we collect:
- **Email address** — used to identify your account and send a confirmation email
- **Password** — stored as a secure hash; we never store or transmit your plaintext password

### Agent Profile (Optional)
You may optionally enter:
- Full name
- Brokerage name
- License number
- Phone number
- RapidAPI key (stored in your account, used only to make API calls on your behalf)

### CMA Reports
Reports you create — including subject property details, comparable sales data, market statistics, and client name/email — are stored in your account. This data is only accessible by you.

### Client Information (Optional)
If you attach a client name or email to a CMA report, that information is stored only within that report record and is not used for any other purpose.

---

## What We Do Not Collect

- We do not collect device identifiers, advertising IDs, or location data.
- We do not track your behavior across other apps or websites.
- We do not use analytics services or crash reporting tools beyond what Expo and React Native include by default.
- We do not sell any data to third parties.

---

## How Your Data Is Used

| Data | Purpose |
|---|---|
| Email + password | Authentication only |
| Agent profile | Displayed within the app; not shared |
| RapidAPI key | Sent to RapidAPI on your behalf to fetch comparable sales |
| CMA reports | Stored in your account; accessible only by you |

---

## Third-Party Services

The app uses the following third-party services:

**Supabase** ([supabase.com/privacy](https://supabase.com/privacy))
Your account data and CMA reports are stored in Supabase's hosted PostgreSQL database. Data is encrypted at rest and in transit.

**RapidAPI / Zillow Com1** ([rapidapi.com/privacy](https://rapidapi.com/privacy))
When you search for comparable sales, your RapidAPI key and the search parameters (ZIP code, bedrooms, bathrooms, square footage) are sent to RapidAPI's servers. No personally identifiable information is included in these requests.

---

## Data Retention

Your data is retained as long as your account exists. You can delete your account and all associated reports by contacting us at the email below. We will process deletion requests within 30 days.

---

## Security

All data is transmitted over HTTPS. Passwords are hashed using bcrypt via Supabase Auth. Your RapidAPI key is stored in your Supabase user profile and is only ever transmitted over HTTPS to RapidAPI.

---

## Children

CMA Pro is intended for use by real estate professionals. We do not knowingly collect information from anyone under 18 years of age.

---

## Changes to This Policy

If we make material changes to this policy, we will update the "Last updated" date at the top of this page. Continued use of the app after changes take effect constitutes acceptance of the updated policy.

---

## Contact

Questions or deletion requests:

**Email:** michaelchang@alumni.usc.edu
**GitHub:** [github.com/chevrechou/cma-pro](https://github.com/chevrechou/cma-pro)
