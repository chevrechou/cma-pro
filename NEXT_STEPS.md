# CMA Pro — Next Steps

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New Project**.
3. Choose an organization, give the project a name (e.g. `cma-pro`), set a database password, and select a region close to you.
4. Wait ~2 minutes for the project to provision.

---

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings → API**.
2. Copy the **Project URL** (looks like `https://xxxx.supabase.co`).
3. Copy the **anon public** key under **Project API keys**.

---

## 3. Create Your `.env.local` File

In the `cma-pro/` project root, create a file named `.env.local`:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with what you copied in Step 2.

---

## 4. Run the Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open `cma-pro/supabase/schema.sql` in a text editor, copy the entire contents, and paste it into the SQL editor.
4. Click **Run**.
5. Confirm you see `cma_reports` in **Table Editor** (left sidebar → Database → Tables).

---

## 5. Get a RapidAPI Key for Zillow

1. Go to [rapidapi.com](https://rapidapi.com) and create a free account.
2. Search for **"Zillow Com1"** in the marketplace.
3. Subscribe to the **Basic (free)** plan — it gives ~50 requests/month to start.
4. Go to the API's **Endpoints** tab and copy your `x-rapidapi-key` from the request headers panel on the right.

> You do **not** need this to run the app — you can enter it later in the app's Settings screen. Without it, comp search will show a warning and no results.

---

## 6. Install Dependencies

Open a terminal, navigate to the project, and run:

```bash
cd ~/cma-pro
npm install
```

---

## 7. Start the App

```bash
npx expo start
```

This opens the Expo dev menu. From here:

- Press `i` to open in **iOS Simulator** (requires Xcode on Mac)
- Press `a` to open in **Android Emulator** (requires Android Studio)
- Scan the QR code with the **Expo Go** app on your physical device (iPhone or Android)

---

## 8. First Run Walkthrough

1. **Register** an account with your email and password.
2. Go to **Settings** (tab bar, bottom right).
3. Fill in your agent name, brokerage, and paste your **RapidAPI key** into the API Keys field. Tap **Save Changes**.
4. Go to **Reports** (tab bar, bottom left) and tap **+ New CMA**.
5. Fill in a subject property address — use a real address in a populated zip code for best comp results.
6. Tap **Find Comparables** — the app will pull recent sold properties from Zillow.
7. Tap comps to include/exclude them, then tap **Review**.
8. On the Adjust screen, tap the edit icon on any comp to add a dollar adjustment.
9. Tap **Generate Report** to see your full CMA with suggested price range.
10. Tap **Save Report** — it will appear on the Dashboard.

---

## 9. Build for Device (Optional)

To install the app as a standalone build on your phone (instead of using Expo Go):

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account (create one at expo.dev if needed)
eas login

# Initialize EAS for this project
eas build:configure

# Build for iOS (requires Apple Developer account, $99/yr)
eas build --platform ios --profile development

# Build for Android (no account needed for testing)
eas build --platform android --profile development
```

---

## 10. Submit to App Stores (When Ready)

```bash
# iOS — requires Apple Developer account
eas submit --platform ios

# Android — requires Google Play Console account
eas submit --platform android
```

---

## Known Limitations to Address Before Launch

- **Comp search radius** is fixed to the ZIP code. Add a radius slider in `lib/zillow.ts` → `searchComparables()` for more control.
- **Manual comp entry** is not yet built — useful when the API has no results.
- **PDF export** is not yet built — agents typically want to email the report to clients. Add `expo-print` + `expo-sharing` for this.
- **No offline support** — all data requires a network connection.
- **RapidAPI free tier** is 50 requests/month. Agents doing heavy volume will need the paid plan (~$30–$100/mo).
