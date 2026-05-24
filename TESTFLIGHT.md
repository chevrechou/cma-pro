# TestFlight Distribution Guide

This is how to get CMA Pro on iPhones without going through the App Store review process. TestFlight supports up to 10,000 external testers via a public link.

---

## Prerequisites (complete once)

1. Apple Developer account active ($99/yr)
2. `eas.json` filled in — `ascAppId` and `appleTeamId` must not be empty
3. `eas login` run in the terminal

---

## Step 1: Build for TestFlight

```bash
cd ~/cma-pro
eas build --platform ios --profile testflight
```

This uploads the build to Expo's cloud servers (~10–15 min). You'll get a build URL when done.

---

## Step 2: Submit to App Store Connect (TestFlight)

```bash
eas submit --platform ios --profile testflight --latest
```

This uploads the `.ipa` to App Store Connect's TestFlight section. The build will show as **Processing** for ~20–30 minutes while Apple processes it.

---

## Step 3: Get the Public TestFlight Link

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Select your app → **TestFlight** tab
3. Under **External Testing**, click **+** to create a new group (e.g. "Public Beta")
4. Enable **Public Link**
5. Copy the link — it looks like `https://testflight.apple.com/join/xxxxxxxx`

> Note: Apple does a brief review of the build before you can invite external testers (usually same-day, not the full App Store review).

---

## Step 4: Activate the Website Download Button

Replace the two placeholder links in `docs/index.html`:

```bash
# Find and replace PLACEHOLDER with your real TestFlight join code
sed -i '' 's|testflight.apple.com/join/PLACEHOLDER|testflight.apple.com/join/YOUR_CODE|g' docs/index.html
```

Then commit and push:

```bash
git add docs/index.html
git commit -m "feat: add TestFlight public link"
git push
```

GitHub Pages will deploy within a minute. Your landing page will be live at:
`https://chevrechou.github.io/cma-pro/`

---

## Step 5: Enable GitHub Pages

1. Go to `github.com/chevrechou/cma-pro` → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: `main` · Folder: `/docs`
4. Click **Save**

Pages goes live within 1–2 minutes. The URL is:
`https://chevrechou.github.io/cma-pro/`

Use this same URL as your privacy policy URL in App Store Connect:
`https://chevrechou.github.io/cma-pro/privacy-policy.html`

---

## How Users Install via TestFlight

1. User opens the TestFlight link on their iPhone
2. iPhone prompts them to install the **TestFlight** app (free on App Store) if not already installed
3. TestFlight opens and shows CMA Pro — tap **Install**
4. App installs like any other app

TestFlight builds expire after **90 days**. Re-run steps 1–2 before expiry to push a fresh build. Testers are notified automatically.

---

## Pushing Updates

```bash
# Make your code changes, then:
eas build --platform ios --profile testflight
eas submit --platform ios --profile testflight --latest
```

TestFlight notifies all existing testers of the update automatically. No new link needed.

---

## When to Switch to App Store

Once you're happy with the build and have collected enough beta feedback, submit the same build (or a new production build) for App Store review:

```bash
eas build --platform ios --profile production
eas submit --platform ios --profile production --latest
```

Then update `docs/index.html` to replace the TestFlight badge with an App Store badge:

```html
<a href="https://apps.apple.com/app/idXXXXXXXXXX" class="store-badge">
  <div class="store-badge-icon"></div>
  <div class="store-badge-text">
    <span class="store-badge-sub">DOWNLOAD ON THE</span>
    <span class="store-badge-main">App Store</span>
  </div>
</a>
```
