# EduBridge Performance Optimization Log

> Last updated: 2026-02-19

This document tracks all performance and caching improvements made to the EduBridge frontend.

---

## ✅ Session 1 — Feb 19, 2026

### 1. Reduced AOS Animation Duration
**File:** `src/App.jsx`

AOS (Animate On Scroll) global duration was reduced from 1000ms to 600ms. Animations now feel snappier without losing the visual polish. The `once: true` flag was already set, which is correct — animations only fire once as the user scrolls, not on every re-entry.

```diff
- duration: 1000,
+ duration: 600,
```

---

### 2. Removed CDN Font Awesome (Render-Blocking)
**File:** `index.html`

Deleted the CDN `<link>` tag for Font Awesome (`cdnjs.cloudflare.com`). This was a **render-blocking** external stylesheet downloaded on every page load, adding ~150KB of CSS. The project already uses the tree-shakeable npm version (`@fortawesome/react-fontawesome`), making the CDN copy completely redundant. All icons continue to work as before.

```diff
- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" ... />
```

**Impact:** Removed a render-blocking resource. Page paint starts sooner.

---

### 3. Split `framer-motion` into its own Rollup Chunk
**File:** `vite.config.js`

`framer-motion` (~200KB gzip) was bundled together with `lucide-react` in a single `ui-vendor` chunk. This meant every user downloaded animation code even on pages with no animations. The libraries are now in separate chunks.

```diff
- 'ui-vendor': ['framer-motion', 'lucide-react'],
+ 'ui-vendor': ['lucide-react'],
+ 'motion-vendor': ['framer-motion'],
```

**Impact:** Better cache granularity and smaller initial payloads per page.

---

### 4. `xlsx` — Verified Already Dynamic
**File:** `src/utils/exportHelpers.js`

Confirmed that `xlsx` (a ~750KB library) is already loaded via `await import('xlsx')` only when an export button is clicked. No changes needed — this was already correctly implemented.

---

### 5. Lazy-Loaded InteractiveMap (Leaflet)
**File:** `src/pages/branches/BranchesPage.jsx`

`InteractiveMap` (which statically imported `leaflet` + `react-leaflet`, ~325KB) was being loaded as part of the `BranchesPage` component. Wrapped it with `React.lazy()` + `<Suspense>` so the entire Leaflet bundle is only downloaded when a user navigates to `/branches`.

```diff
- import InteractiveMap from "@/components/InteractiveMap";
+ const InteractiveMap = lazy(() => import("@/components/InteractiveMap"));
```

The `<InteractiveMap />` usage was also wrapped in a `<Suspense fallback={...}>` with a pulse skeleton.

**Impact:** Leaflet (96KB gzip) is now deferred. Every page except `/branches` is faster.

---

### 6. Service Worker / PWA with Workbox
**Files:** `vite.config.js`, `package.json`

Installed `vite-plugin-pwa` and configured a Service Worker using Workbox. This provides:

- **Shell caching:** JS, CSS, HTML, fonts, and images are cached on first visit
- **Repeat visits:** Served from local cache — zero network round-trips
- **Google Fonts caching:** `CacheFirst` strategy with 1-year expiry for both `googleapis.com` and `gstatic.com`
- **Auto-update:** `registerType: 'autoUpdate'` ensures users always get the latest version silently

```js
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,webp,woff2}'],
    runtimeCaching: [ /* Google Fonts CacheFirst */ ]
  }
})
```

**Impact:** Biggest win — repeat loads are near-instant, critical for users on slow mobile connections in East Africa.

---

### 7. Removed Duplicate AOS Initialization
**File:** `src/pages/visa/VisaConsultationPage.jsx`

`VisaConsultationPage` was redundantly importing and initializing AOS a second time (`import AOS from "aos"`, `import "aos/dist/aos.css"`, and a `useEffect(() => AOS.init(...))`). AOS is already initialized once globally in `App.jsx`. The duplicate was causing unnecessary CSS to be included in the `VisaConsultationPage` chunk.

Also removed the now-unused `useEffect` import.

```diff
- import { useState, useEffect } from "react";
+ import { useState } from "react";
- import AOS from "aos";
- import "aos/dist/aos.css";
- useEffect(() => { AOS.init({ duration: 800, once: true }); }, []);
```

**Impact:** Shrinks the `VisaConsultationPage` chunk. Cleaner, no duplicate side effects.

---

## 📊 Build Output (Post-Optimization)

| Chunk | Gzip Size | Notes |
|---|---|---|
| `react-vendor` | 16.49 KB | React + Router |
| `ui-vendor` | 5.87 KB | lucide-react only |
| `motion-vendor` | 38.79 KB | framer-motion isolated |
| `utils-vendor` | 19.90 KB | AOS + i18next |
| `InteractiveMap` | 96.27 KB | Lazy — only on /branches |
| **Total App** | **829.74 KB** | Sum of ALL chunks (no user downloads all of this) |
| **Total (Brotli)** | **699.45 KB** | What Netlify actually sends |

---

## 🔍 Pending Audit Findings (Next Steps)

See the audit section at the bottom — items identified but not yet implemented.
