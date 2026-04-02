# EduBridge — Developer Log



## April 2, 2026 - Document Preview & Blog Migration
**Branch:** `frontendPhaseI`

Today’s session focused on resolving complex file preview behaviors and replacing the last remaining mock data flows for the public-facing content with live Firestore functionality.

### 1. Avatar Image Uploads (Profile Settings)
* Added a custom Firebase Storage upload function in `userService.js` (`uploadUserAvatar`).
* Adjusted user interface in the Profile Settings module (`StudentSettings.jsx` and `AdminSettings.jsx`) to allow image uploads up to 10MB instead of 2MB per user request.
* Re-syncs profile data upon uploading so that the Header reflects avatar changes in real-time.

### 2. Universal Document Previewer
* The system originally relied on inline `<iframe>` elements to bypass downloading PDFs and images inside `AdminApplicationReview` and `VisaCaseDetails`.
* This was fundamentally flawed and led to unmaintainable logic scattered throughout.
* **Solution**: Developed a universal, robust modal component `<DocumentPreviewModal />`.
* **Stack**: `react-pdf` for threading PDFs natively, standard `<img>` handling for static image rendering, and `mammoth.js` stringification for `.docx` translation.
* Wired up Firebase's storage URLs using a proxy wrapping utility (`toProxyUrl`) to safely pass CORS restrictions naturally without relying heavily on bucket infrastructure permission limits.
* Deployed this universally to replace the inline previewing methods across Visa and Application documents simultaneously.

### 3. CMS Blog Frontend Migration
* Created a lightweight `useBlogs.js` hook utilizing TanStack React Query to fetch public blogs with a global `5-minute` staleTime to aggressively limit database calls for front-end users.
* Cleaned out `BlogPage.jsx` logic to replace flat `MOCK_BLOGS` JSON rendering with dynamic slicing of the fetched query.
* Transitioned `BlogDetailsPage.jsx` completely to consume the global fetch query by ID matching strings to map correctly to document identifiers inside the Firestore.
* Dropped all remaining `.json`/mock imports, pushing the project past the 90% Firebase threshold mark.


**Last updated:** April 1, 2026
**Sessions:** March 16 (audit + MVC refactor) · March 17 session 2 (visa flow, document upload/preview/delete, bug fixes) · March 17 session 3 (admin visa detail page, UI polish, storage fix) · March 17 session 4 (full MVC for CMS content types, UI/UX landing page overhaul, FAQ MVC connection) · March 18 session 5 (DB alignment audit, CMS content architecture decision, hook/page cleanup, bug fixes) · March 18–19 sessions 6–8 (full DB alignment sprint, DashboardLayout consolidation, Institution DTO mapper) · March 26 session 9 (Firebase auth bug fix — UUID mismatch breaking sign-in) · March 27 session 10 (deployed domain auth fix, usernames collection refactor decision) · March 27 session 11 (applicationService Firestore migration, useApplications React Query rewrite, admin createUser secondary app fix, inactive user enforcement) · March 27 session 12 (password change, AdminApplicationReview UI polish, application edit lock, tracker enrolled lock, terminal status lock) · March 30 session 13 (branches CRUD completed on Firestore, stats card bugs fixed, progress.md report created) · March 30–31 session 16 (Firebase Storage wired up, application file uploads migrated, document preview/download overhaul, mammoth.js .docx preview, CORS solved via Vite+Netlify reverse-proxy, unified in-app file preview modal for PDF/image/docx) · March 31 session 17 (visaService full Firestore + Storage migration, React Query hooks for student/admin, fee management UI, storage proxy extended to visa docs) · April 1 session 18 (CMS Firestore migration — generic cmsService factory, useCMSManager rewrite with TanStack Query, public pages connected: scholarships pagination + gallery/teaser live data)

---

## Session 18 — April 1, 2026

### 1. `cmsService.js` — Generic Firestore CRUD Factory (NEW FILE)

Created `src/services/cmsService.js` — a single factory function `createCmsService(collectionName)` that returns typed Firestore CRUD operations for any collection. Eliminates the need for per-collection service files.

```js
export const createCmsService = (collectionName) => ({
  getAll:  async () => { /* getDocs → { id, ...data }[] */ },
  create:  async (data) => { /* addDoc + serverTimestamp */ },
  update:  async (id, data) => { /* updateDoc + serverTimestamp */ },
  delete:  async (id) => { /* deleteDoc */ },
});
```

**Debug logging:** every write prints `[cmsService] CREATE/UPDATE/DELETE → collectionName(/id)` with the full payload to the browser console before hitting Firestore. `serverTimestamp()` appears as `___PRIVATE_ServerTimestampFieldValueImpl` in the console log — this is normal. Firestore replaces the sentinel with the real server timestamp on write; on subsequent reads it comes back as a proper `Timestamp` object.

**Named instances exported:**

| Export | Firestore Collection |
|---|---|
| `scholarshipService` | `scholarships` |
| `blogService` | `blogs` |
| `mediaService` | `media` |

---

### 2. `useCMSManager.js` — Rewritten with TanStack Query

Hook signature changed:

```diff
- useCMSManager(initialData, defaultFormData, searchKeys)
+ useCMSManager(service, collectionKey, defaultFormData, searchKeys)
```

| Concern | Before | After |
|---|---|---|
| Data source | `useState(initialData)` — in-memory, resets on refresh | `useQuery` → live Firestore via service |
| Writes | Mutated local state array directly | `useMutation` × 3 (create / update / delete) |
| Cache sync | Manual `setItems(...)` | `queryClient.invalidateQueries([collectionKey])` |
| Loading | Hardcoded `false` | `isLoading` from `useQuery` |
| Save state | None | `isPending` — true while any mutation is in flight |

New return values: `isLoading`, `isPending`. All existing return values (`items`, `searchQuery`, `setSearchQuery`, `isModalOpen`, `setIsModalOpen`, `formData`, `setFormData`, `editingItem`, `handleAdd`, `handleEdit`, `handleDelete`, `handleSubmit`) are preserved — pages required no JSX changes.

`handleDelete` UX unchanged: sonner toast with an action button — delete only fires if the admin clicks Confirm.

---

### 3. CMS Admin Pages — Wired to Firestore (3 files, 2-line change each)

| File | Old data source | New data source |
|---|---|---|
| `CMSScholarships.jsx` | `useCMSManager(MOCK_SCHOLARSHIPS, ...)` | `useCMSManager(scholarshipService, 'scholarships', ...)` |
| `CMSPosts.jsx` | `useCMSManager(MOCK_BLOGS, ...)` | `useCMSManager(blogService, 'blogs', ...)` |
| `CMSMedia.jsx` | `useCMSManager(MOCK_MEDIA, ...)` | `useCMSManager(mediaService, 'media', ...)` |

All three pages also received:
- `isLoading` → passed to `AdminTable` (skeleton rows while Firestore loads) — or a `Loader2` spinner for CMSMedia's card grid
- `isPending` → submit button shows **"Saving…"** and is `disabled` during in-flight writes, preventing double-submits

All JSX (columns, modals, forms) is untouched.

---

### 4. `ScholarshipsPage.jsx` — Public Page Connected to Firestore

The public `/scholarships` page previously read from `MOCK_SCHOLARSHIPS`. Now reads from the same `scholarships` Firestore collection as the admin CMS.

**Cache strategy:** `staleTime: 0` set intentionally only on this page. The global `staleTime: 5 * 60 * 1000` (5 min) applies to the admin view to avoid unnecessary reads. When the admin mutates, `invalidateQueries(['scholarships'])` marks the cache stale — the public page refetches on next visit.

**Pagination added:** client-side, 6 items per page (`ITEMS_PER_PAGE = 6`). Numbered page buttons + prev/next arrows rendered via `Array.from({ length: totalPages })`. `goToPage()` scrolls to top on navigation. Pagination only renders when `totalPages > 1`.

**Tags safety:** `scholarship.tags.map(...)` → `(scholarship.tags || []).map(...)` — prevents crash on documents that have no `tags` field (e.g. early entries added before the field was standardised).

---

### 5. `GalleryPage.jsx` + `GalleryTeaser.jsx` — Media Connected to Firestore

Both the full Gallery page (`/gallery`) and the home-page teaser section now read from the `media` Firestore collection managed at `/admin/cms/media`.

| File | Items shown | Loading state |
|---|---|---|
| `GalleryPage.jsx` | All documents — masonry grid + lightbox | Animated pulse skeleton (6 alternating-height blocks matching the masonry layout) |
| `GalleryTeaser.jsx` | `allMedia.slice(0, 6)` — first 6 only | Animated pulse skeleton (6 blocks) |

Both use `queryKey: ['media']` and `staleTime: 0`. The fetch is **deduplicated** by React Query — if the home page loads first and the user navigates to `/gallery`, the data is served from cache and no second network request is made. Same applies in the reverse order.

`GalleryPage.jsx` includes an **empty state** (graduation cap icon + hint to use the admin CMS) rendered when the collection has zero documents.

**Field mapping from Firestore → display:**

| Field | Where used |
|---|---|
| `image` | Card photo, lightbox photo |
| `studentName` | Hover overlay title, lightbox heading |
| `country` | Location chip on hover + lightbox |
| `university` | Lightbox subheading |
| `program` | Hover overlay + lightbox badge |
| `testimony` | Lightbox quote block |

---

## Session 17 — March 31, 2026

### 1. `visaService.js` — Full Firestore + Firebase Storage Migration

**Before:** All visa data was read/written from `localStorage` using `readAll()` / `writeAll()` helpers and seeded with `MOCK_VISA_REQUESTS`. Data was lost on every new session, incognito window, or different device.

**After:** Every operation goes through Firestore (`visaCases` collection) and Firebase Storage. Persistent across all sessions and devices.

| Function                          | Before                              | After                                                           |
| --------------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| `getVisaRequests()`               | `readAll()` from localStorage       | `getDocs(collection(db, "visaCases"))`                          |
| `getVisaRequestsByUserId()`       | `.filter()` on localStorage array   | Firestore `query(..., where("userId", "==", userId))`           |
| `getVisaRequestById()`            | `.find()` on localStorage array     | `getDoc(doc(db, "visaCases", id))`                              |
| `createVisaRequest()`             | push to localStorage, `uuidv4()` ID | `setDoc(newRef, newCase)` — auto-generated Firestore doc ID     |
| `updateVisaRequest()`             | splice + save to localStorage       | `updateDoc(ref, safeData)` — admin fields stripped              |
| `updateVisaStatus()`              | mutate localStorage item            | `updateDoc(ref, { status })`                                    |
| `updateVisaFee()`                 | mutate localStorage item            | `updateDoc(ref, { consultationFee, feeStatus })`                |
| `updateVisaSchedule()`            | mutate localStorage item            | `updateDoc(ref, schedule)`                                      |
| `uploadVisaDocument()`            | N/A — no file persistence           | `uploadBytes()` → `visaCases/{userId}/{timestamp}_{filename}`   |
| `addDocumentsToVisaRequest()`     | N/A                                 | `arrayUnion(...newDocs)` on Firestore `documents` array         |
| `deleteDocumentFromVisaRequest()` | N/A                                 | `arrayRemove` on `documents` array + re-fetch                   |
| `deleteVisaRequest()`             | `.filter()` + save                  | `deleteDoc(doc(db, "visaCases", id))`                           |

**Removed:** `STORAGE_KEY`, `readAll()`, `writeAll()`, `MOCK_VISA_REQUESTS` import, `uuidv4` — completely gone.

**Added:** `snapToData()` helper — `(snap) => ({ id: snap.id, ...snap.data() })`. Same pattern as `applicationService.js`.

**Security preserved:** `updateVisaRequest()` destructures only safe student-editable fields. Admin-only fields (`consultationFee`, `feeStatus`, `meetingDate`, `meetingTime`, `meetingType`, `meetingLink`, `adminNotes`) are stripped before any `updateDoc` call.

---

### 2. `useVisaConsultations.js` — React Query Rewrite (Student)

Replaced `useState/useEffect` with `useQuery` + `useMutation`.

- **Query key:** `["visaCases", "user", userId]` — scoped to the logged-in user
- **`enabled: !!userId`** — query does not fire until auth resolves
- **Mutations:** `submitRequest`, `editRequest`, `cancelRequest`
- All mutations invalidate `["visaCases"]` so admin list stays in sync automatically

---

### 3. `useAdminVisaCases.js` — React Query Rewrite (Admin)

Admin-only hook. Exposes operations the student hook intentionally hides.

- **Query key:** `["visaCases"]` — all cases, no user filter
- **Mutations:** `addCase`, `setStatus`, `setFee`, `setSchedule`, `removeCase`
- Each mutation calls a **targeted update** (only the relevant fields changed per call)

---

### 4. `VisaCases.jsx` — Consultation Fee Management UI

New fee section added to the admin case details modal:

- **Amount** — free text input (e.g. `$150`)
- **Payment Status** — Paid / Unpaid toggle (emerald / amber)
- **Save Fee** button — isolated from schedule and status saves, calls `setFee()` from the hook

---

### 5. `UploadCaseDocuments.jsx` — Firebase Storage Upload

Student document upload form now uploads each file to `visaCases/{userId}/{timestamp}_{filename}` via `uploadVisaDocument()`, then appends metadata to the Firestore case via `addDocumentsToVisaRequest()`. Documents survive page refreshes and are device-agnostic.

---

### 6. `VisaCaseDetails.jsx` — Student Visa Case Detail Page

Full detail view for a student's individual visa case. Built to consume the new Firestore-backed service.

**Sections:**
- **4 summary cards** — Destination (with flag emoji), Visa Type, Status badge, empty slot reserved for admin response
- **Appointment card** — shows booking date/time, meeting type, and a **Join Meeting** button that only renders when `meetingLink` is set. Link is sanitised on render (adds `https://` if no protocol present)
- **Documents section** — grid of all uploaded documents with status badges (Verified / Received / Pending), Preview (eye) and Download icons, and a per-document **Delete** action with toast confirmation before calling `deleteDocumentFromVisaRequest()`
- **Pagination** — 6 documents per page, previous/next + numbered buttons
- **Upload Documents** button — navigates to `UploadCaseDocuments` route

**Data flow:** Fetches via `getVisaRequestById(id)` directly from Firestore. Preview and download route through `toProxyUrl()` — same CORS pattern as application documents.

---

### 7. `AdminVisaCaseDetails.jsx` — Admin Read-Only Visa Detail Page

Standalone full-page view for admins to inspect a visa case. Separate from the inline edit modal in `VisaCases.jsx`.

**Sections:**
- **Student info card** — `InitialsAvatar` component (generates coloured initials from name, supports `sm`/`md`/`lg` sizes), full name, email, phone, country flag, submission date
- **4 summary cards** — Destination, Visa Type, Status badge, Consultation Fee with Paid/Unpaid badge
- **Appointment section** — date, time, meeting type, clickable meeting link if present
- **Student notes** — displayed if the student provided notes on submission
- **Documents section** — same grid layout as student view, Preview/Download only (no Delete), paginated at 6 per page

**Key decision:** This page is read-only. Edits go through the modal in `VisaCases.jsx`, keeping the two concerns separate.

---

### 8. `UploadCaseDocuments.jsx` — Firebase Storage Upload

Student document upload form now uploads each file to `visaCases/{userId}/{timestamp}_{filename}` via `uploadVisaDocument()`, then appends metadata to the Firestore case via `addDocumentsToVisaRequest()`. Documents survive page refreshes and are device-agnostic.

**Document object shape written to Firestore:**
```js
{
  id: `vdoc-${Date.now()}-${randomString}`,
  name: file.name,
  type: file.type,
  size: file.size,
  url: downloadUrl,       // Firebase Storage URL
  uploadedAt: new Date().toISOString(),
  status: "Received",
}
```

---

### 9. Storage Proxy — Visa Documents Covered Automatically

The `/storage-proxy/` rules in `vite.config.js` and `netlify.toml` (added in Session 16) already cover all Firebase Storage URLs — including visa documents. `toProxyUrl()` in `VisaCaseDetails.jsx` and `AdminVisaCaseDetails.jsx` routes preview and download requests through the same proxy. No new config required.

---

### 10. `Dashboard.jsx` — Student Dashboard Data Integration

The student landing page was wired up to real application data from Firestore via `useApplications()`.

**What changed:**
- **Stats cards** now compute live from real data using `useMemo` — Total Applications, Pending, Approved, and a "Study Abroad Ready" count (approved + active visa)
- **Recent Applications feed** — sorted by `submissionDate` descending, shows each application with university name, major, formatted date, and a `StatusBadge` component
- **Empty states** with CTA buttons ("Submit your first application") shown when no data exists
- Added `StatusBadge` and `formatDate` imports — consistent with the rest of the dashboard

---

## Session 16 — March 31, 2026

### 1. Firebase Storage — initialized and wired up

`firebase/storage` was not previously initialized. Added `getStorage(app)` to `config.js` and exported `storage`. The `storageBucket` env var was already present — the SDK just wasn't called.

### 2. `AdminProgramDetail.jsx` — `applicationFile` upload fixed

**Bug:** Saving a program with an uploaded application form file threw `FirebaseError: Unsupported field value: a custom File object`. Firestore cannot store binary File objects — only plain JSON values.

**Fix:** `handleSubmit` now checks `instanceof File` before calling Firestore. If a new file was picked, it is uploaded to Firebase Storage at `programs/application-forms/{timestamp}_{filename}` first, and the returned download URL string is stored in Firestore instead.

**Also fixed:** `addFeeGroup`, `removeFeeGroup`, `updateFeeGroup` were defined in `useProgramForm` but missing from its `return` object — so the "Add Fee Group" button was calling `undefined`. Added all three to the return.

### 3. `ApplicationSubmitForm.jsx` — document uploads migrated to Firebase Storage

**Bug:** Submitting an application with two Word documents (~800 KB combined) hit Firestore's 1 MB document limit because files were Base64-encoded and embedded directly in the document (Base64 adds ~33% overhead).

**Fix:** Replaced `fileToBase64` with `uploadFileToStorage` — each file is uploaded to `applications/{userId}/{timestamp}_{filename}` in Firebase Storage. Only the download URL is stored in Firestore, keeping the application document tiny regardless of file count/size.

**Also changed:**
- Removed `MAX_FILE_SIZE` (10 MB) limit — Firebase Storage free tier supports any file size within the 5 GB bucket cap
- Removed `ACCEPTED_TYPES` restriction — all file types now accepted
- UI hint updated to "Any file type accepted"

### 4. Submission date — locked to server time

`submissionDate` was a user-editable date picker — a student could backdate their application. Removed it from form state entirely. The date is now computed with `new Date().toISOString().split("T")[0]` inside `handleSubmit` at the exact moment of submission, injected into both create and update payloads. UI shows a read-only formatted display (`March 31, 2026` style) with `cursor-not-allowed`.

### 5. Application edit mode — university & department pre-fill fixed

**Bug:** Opening an application in edit mode always showed empty University and Department dropdowns.

**Root cause 1:** `createApplication` in `applicationService.js` built `newApp` with an explicit field list and never included `programId` — so it was silently dropped on creation and `app.programId` was always `undefined` on re-load.

**Root cause 2:** The edit-mode `setForm` was falling back through several stale field paths (`app.programDetails?.universityName`, `app.firstName`, etc.) from the old localStorage shape, none of which matched the Firestore document structure.

**Fix:**
- Added `programId: data.programId || ""` to `newApp` in `createApplication`
- Simplified the edit-mode field mapping to read directly from the Firestore shape: `app.programId`, `app.programDetails.majorName`, `app.applicant.*`

### 6. Department dropdown — fixed for Firestore programs

`ApplicationSubmitForm.jsx` was calling `getProgramMajors(selectedUniversityProgram.id)` — a mock join table that uses integer IDs. All programs now have UUID string IDs in Firestore, so the join table never matched and the dropdown was always empty.

**Fix:** Removed the `mockMajors` import entirely. `availableDepartments` now reads `selectedUniversityProgram?.departments ?? []` directly from the Firestore program object. Label render updated from `dept.name` → `dept.major` to match the Firestore department shape.

### 7. `ProgramDetail.jsx` — Q&A tab removed, logo fallback, download fix

- **Q&A tab removed** — tab bar and conditional stripped; details render directly in the card
- **Logo fallback** — added `logoError` state; if no logo URL or image fails to load, shows a rounded box with the first 2 letters of the university name
- **Download Form button** — was using `document.createElement("a")` + `click()` which navigates the current tab for cross-origin URLs (Firebase Storage). Changed to `window.open(url, "_blank")` — file opens in new tab, user stays on current page
- **Submit Documents button** — already wired to `navigate(/dashboard/applications/submit/${id})` via the `"submit"` case in `handleApply`; confirmed working

### 8. Document actions — eye + download on ApplicationPreview & AdminApplicationReview

Both the student view (`ApplicationPreview.jsx`) and admin view (`AdminApplicationReview.jsx`) previously used `<a href={doc.url} download={doc.name}>`. The `download` attribute is **ignored by browsers for cross-origin URLs** (Firebase Storage is hosted on `firebasestorage.googleapis.com`) — the browser navigated the current tab instead of downloading.

**New behaviour:**
- **Eye icon (green)** — opens file for preview. PDFs and images open directly in new tab. `.docx`/`.doc` files are fetched as `ArrayBuffer`, converted to HTML by `mammoth.js`, and rendered in an inline modal with a loading spinner. All other types trigger a download with an info toast.
- **Download icon (blue)** — `fetch(url)` → `blob()` → `URL.createObjectURL()` → `<a download>` forces a true local save. Falls back to `window.open` if fetch fails (CORS not yet configured).

**mammoth.js** installed (`npm install mammoth`) — converts `.docx` binary to HTML entirely client-side, no external server involved.

---

### 9. Firebase Storage CORS — solved via reverse-proxy (no bucket access required)

#### The problem

After wiring up file uploads and the download/preview buttons, every `fetch()` call to a Firebase Storage URL failed with:

```
Access to fetch at 'https://firebasestorage.googleapis.com/...' from origin
'http://localhost:5174' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

CORS is a browser security rule: any `fetch()` or `XMLHttpRequest` that crosses origins (different domain) is blocked unless the **server** responds with an `Access-Control-Allow-Origin` header. Firebase Storage does not add those headers by default — you have to configure it explicitly on the bucket with `gsutil cors set`.

#### Why the normal fix didn't work

The standard fix is a one-liner:

```bash
gsutil cors set cors.json gs://edubridge-5da54.firebasestorage.app
```

But this requires the `storage.buckets.update` IAM permission on the Firebase project (`edubridge-5da54`). The developer account only has access to a separate GCP project (`edubridge-486912`), not the Firebase project that owns the bucket:

```
AccessDeniedException: 403 [account]@gmail.com does not have
storage.buckets.update access to the Google Cloud Storage bucket.
```

The Google Cloud Shell + `gsutil` route hit the same wall. The Firebase Storage SDK (`getBlob()` / `getBytes()`) was also tried — it internally also makes XHR requests, which are equally subject to CORS, confirmed by the browser:

```
AdminApplicationReview.jsx:109  GET https://firebasestorage.googleapis.com/...
net::ERR_FAILED 200 (OK)
```

CORS cannot be bypassed with JavaScript. The server must send the header, or the request must appear same-origin to the browser.

#### The solution — reverse-proxy

The browser only enforces CORS for cross-origin requests. If the request goes to the **same domain** as the app, the browser allows it unconditionally. A proxy intercepts the request server-side and forwards it to Firebase Storage — the browser never talks to Firebase directly.

**Dev (Vite `server.proxy`):**

```js
// vite.config.js
server: {
  proxy: {
    '/storage-proxy': {
      target: 'https://firebasestorage.googleapis.com',
      changeOrigin: true,
      rewrite: (path) =>
        path.replace(/^\/storage-proxy/, '/v0/b/edubridge-5da54.firebasestorage.app/o'),
    },
  },
},
```

**Production (Netlify edge redirect — status 200 = transparent proxy):**

```toml
# netlify.toml — must be BEFORE the SPA catch-all /*
[[redirects]]
  from = "/storage-proxy/*"
  to   = "https://firebasestorage.googleapis.com/v0/b/edubridge-5da54.firebasestorage.app/o/:splat"
  status = 200
  force  = true
```

**In the React code — `toProxyUrl()` helper:**

```js
// Rewrites a Firebase Storage download URL to go through the local/Netlify proxy.
// Browser sees a same-origin request → no CORS check.
function toProxyUrl(downloadUrl) {
  try {
    const url   = new URL(downloadUrl);
    const match = url.pathname.match(/\/o\/(.+)$/);
    if (!match) return downloadUrl;
    return `/storage-proxy/${match[1]}${url.search}`;
  } catch {
    return downloadUrl;
  }
}

// Usage:
const res  = await fetch(toProxyUrl(doc.url)); // same-origin → no CORS error
const blob = await res.blob();
```

**Why this works:**
- `doc.url` is e.g. `https://firebasestorage.googleapis.com/v0/b/bucket/o/path?alt=media&token=...`
- `toProxyUrl()` extracts the encoded object path (`path?alt=media&token=...`) and returns `/storage-proxy/path?alt=media&token=...`
- The browser sends `GET /storage-proxy/...` to `localhost:5174` (same origin)
- Vite (dev) / Netlify (prod) receives it and proxies it to Firebase Storage
- Firebase returns the file with a `200 OK` — no CORS headers needed because the browser never saw the Firebase URL

**Files changed:** `vite.config.js`, `netlify.toml`, `ApplicationPreview.jsx`, `AdminApplicationReview.jsx`.

---

### 10. Document preview — unified in-app modal for all file types

**Before:** The Eye icon opened files in a new tab for PDFs and images (`window.open(doc.url, "_blank")`). Only `.docx` files rendered inside the app.

**After:** All previewable files render inside the same in-app modal:

| File type | How it renders in the modal |
|-----------|-----------------------------|
| `.pdf` | `<iframe src={toProxyUrl(doc.url)}>` — Chrome/Firefox built-in PDF viewer, full-height, via proxy |
| Images (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`) | `<img src={doc.url}>` — images do not trigger CORS on `<img>` tags, no proxy needed |
| `.docx` / `.doc` | Fetched as `ArrayBuffer` via proxy → converted to HTML by `mammoth.js` → rendered as styled HTML |
| Everything else | `toast.info` + downloads the file |

**State shape:** `docxPreview` replaced with a unified `filePreview`:

```js
// type: "pdf" | "image" | "docx" | null
const CLOSE_PREVIEW = { open: false, type: null, url: "", html: "", name: "", loading: false };
const [filePreview, setFilePreview] = useState(CLOSE_PREVIEW);
```

**Why `<img>` doesn't need the proxy:** The `<img src>` attribute is a passive load — the browser does not apply CORS to it unless the image is consumed by a `canvas` or `fetch`. Direct display via `<img>` always works regardless of CORS headers.

**Why `<iframe>` needs the proxy for PDFs:** Cross-origin `<iframe>` PDFs can be blocked or render blank in some browser/security configurations. Routing through the proxy makes the URL same-origin, ensuring Chrome's built-in PDF viewer renders it reliably in every environment.

**Applied to both:** `ApplicationPreview.jsx` (student view) and `AdminApplicationReview.jsx` (admin review view).

---

## Session 10 — March 27, 2026

### 1. Deployed Domain Fix (Google Auth)

Google sign-in worked locally but failed on deployed versions (Netlify + Firebase Hosting). Root cause: Firebase requires deployed domains to be explicitly whitelisted under **Authentication → Settings → Authorized domains** in the Firebase Console. `localhost` is added by default but deployed domains are not. Fix: manually add the Netlify subdomain and any Firebase Hosting domains in the Console — no code changes needed.

---

### 2. Code Refactor Pending Decision — `usernames` Collection

#### What happened

During the Firebase migration, a separate Firestore collection `usernames/{username}` was created alongside the main `users/{uid}` collection. This was intentional — Firestore has no `UNIQUE` constraint on fields, so the standard workaround is to use the username as a document ID inside a transaction. If the document already exists, the transaction fails atomically, preventing duplicate usernames.

It stores only one field per document: `{ uid }`.

#### The problem

This adds a second collection purely for uniqueness enforcement, which feels like unnecessary database bloat for the current scale of the app.

#### Options

| Option                                                  | Uniqueness guarantee    | Collections           | Risk                                                                           |
| ------------------------------------------------------- | ----------------------- | --------------------- | ------------------------------------------------------------------------------ |
| **Keep current** (`usernames` collection + transaction) | Atomic, guaranteed      | `users` + `usernames` | Extra table                                                                    |
| **Query-based check** (remove `usernames`)              | Best-effort, not atomic | `users` only          | Race condition (two users registering same username at exact same millisecond) |
| **Drop username uniqueness entirely**                   | None                    | `users` only          | Duplicate usernames possible                                                   |

#### Suggested approach

Remove the `usernames` collection and replace the transaction with a `where("username", "==", x)` query check before writing. The race condition risk is real in theory but negligible in practice for a low-traffic app like EduBridge. Code changes would be limited to `registerUser` and `createUser` in `userService.js`, plus removing the `runTransaction` import.

**Effect on existing users:** zero — existing `users` documents are untouched. The orphaned `usernames` collection can be deleted from Firebase Console at any time.

**Status: not yet implemented — decision pending.**

---

## Session 11 — March 27, 2026

### 1. Phase 2 — applicationService.js migrated to Firestore

Replaced the entire localStorage-based `applicationService.js` with Firestore equivalents. All exported function signatures kept identical so `useApplications.js`, `useDashboard.js`, and all call sites required zero changes.

**What changed:**

- `getApplications()` → `getDocs(collection(db, "applications"))`
- `getApplicationsByUserId(id)` → `query(..., where("userId", "==", id))`
- `getApplicationById(id)` → `getDoc(doc(db, "applications", id))`
- `createApplication(data)` → `setDoc(doc(db, "applications", trackerId), newApp)`
- `updateApplication`, `updateApplicationStatus`, `updateTrackerStages` → `updateDoc(...)`
- `deleteApplication` → `deleteDoc(...)`
- `getApplicationByIdSync` removed — sync reads cannot exist against a server database
- All `localStorage` reads/writes, mock data seeding, `_getApps`/`_saveApps` helpers, and `delay()` removed

**userId fix:** `createApplication` now sources `userId` directly from `auth.currentUser.uid` instead of trusting the caller to pass it. Same principle that fixed the user UUID bug — never generate or accept a substitute for the Firebase Auth UID.

**One-time consequence:** Existing localStorage mock data is no longer visible. Firestore starts with an empty `applications` collection. A real test submission is needed to verify the flow end-to-end.

---

### 2. useApplications.js — rewritten with React Query

Replaced `useState` + `useCallback` + `useEffect` with React Query (`useQuery` + `useMutation` + `useQueryClient`). Same pattern as the reference `useBranches.js`.

**3 query modes driven by params:**

- `["applications"]` — all applications, enabled when no params (admin list/dashboard)
- `["applications", "user", userId]` — student's own applications, enabled when `userId` is set
- `["applications", trackerId]` — single application detail, enabled when `trackerId` is set

**Mutations:** `createApplication`, `updateApplication`, `updateStatus`, `updateTrackerStages`, `deleteApplication` — each calls `invalidate()` on success, which busts all relevant cache keys automatically.

**Public API preserved:** `applications`, `singleApplication`, `loading`, `error`, `fetchApplications` — all call sites unchanged.

**Benefit:** React Query handles caching, deduplication, and background revalidation. Navigating back to a previously viewed application returns instantly from cache.

---

### 3. ApplicationPreview.jsx — sync call removed

`getApplicationByIdSync` was the last synchronous localStorage read in a component. Replaced with `useApplications({ trackerId: id })` hook — gets `singleApplication` and `loading` directly. Added a loading skeleton matching the card layout for the brief Firestore fetch delay.

---

### 4. The UUID Bug — documented and fully resolved

**The pattern (what went wrong):**
Any time a fake ID (`uuidv4()` or `Math.random()`) was generated on the frontend and stored as a user or document identifier, it created a mismatch with the real UID that Firebase Auth assigns. The document would exist in Firestore under the fake ID, but every subsequent Auth-based lookup used the real UID — so the document was effectively invisible.

This manifested as:

- Sign-in succeeding but user profile not loading (session broken)
- `getApplicationsByUserId` returning empty results for real users
- Admin-created users unable to log in at all

**The rule established:** Any document that belongs to a user must store the Firebase Auth UID (`auth.currentUser.uid` or `userCredential.user.uid`) — never a generated substitute. The UID is always sourced from Firebase Auth, never invented.

**Remaining instance flagged:** `createUser` (admin function) still used `uuidv4()` — resolved in item 5 below.

---

### 5. Admin createUser — secondary Firebase app

**Problem:** `createUser` in `userService.js` generated a `uuidv4()` as the user UID. Admin-created users could never log in because their Firestore document ID didn't match their Firebase Auth UID. Calling `createUserWithEmailAndPassword` directly on the main auth instance would also sign out the currently logged-in admin.

**Solution — secondary Firebase app instance:**

```js
const secondaryApp = initializeApp(firebaseConfig, "adminCreateUser");
const secondaryAuth = getAuth(secondaryApp);

const credential = await createUserWithEmailAndPassword(
  secondaryAuth,
  email,
  password,
);
const uid = credential.user.uid; // real Firebase Auth UID

await secondaryAuth.signOut();
await deleteApp(secondaryApp); // always cleaned up in finally block
```

The secondary app is completely isolated — it has its own auth state, signs in the new user there, extracts the real UID, then signs out and is deleted. The admin's session on the primary app is never touched.

**Admin flow:** Admin fills the form with the user's details + sets an initial password. The user receives their credentials via the admin (out of band), logs in, and can change their password later.

**firebaseConfig** was also exported from `firebase/config.js` to enable this pattern.

---

### 6. Inactive user enforcement

**Problem:** `status: "Inactive"` was stored in Firestore but Firebase Auth had no knowledge of it. An inactive user could still authenticate successfully because Auth only validates credentials, not application-level status.

**Fix — two layers:**

**Layer 1: At login (`userService.js`)** — after Firebase Auth succeeds and the Firestore profile is fetched, status is checked before returning. If `"Inactive"`, the Auth session is immediately signed out and an error is thrown. Applied to both `loginUser` (email/password) and `loginWithGoogle`.

**Layer 2: At session restore (`AuthContext.jsx`)** — `onAuthStateChanged` fires on every page load for already-logged-in users. Status is now checked here too. If the profile is `"Inactive"` (e.g. admin deactivated the account after the user logged in), Firebase signs out the session automatically on next load.

**Effect:** An inactive user cannot log in via any method. A user who is deactivated while already logged in is signed out on their next page load or refresh. No Firebase Admin SDK required — purely frontend enforced via Firestore status field.

**Pending:** Password change via Firebase Auth `updatePassword()` — flagged for next session.

---

## Session 12 — March 27, 2026

### 1. Password Change — implemented

Replaced the `updatePassword` placeholder (which threw a "not yet implemented" error) with a real Firebase Auth implementation.

**How it works:**

1. Re-authenticates the user with their current password using `reauthenticateWithCredential` + `EmailAuthProvider.credential` — Firebase requires this before any sensitive operation
2. Calls `firebaseUpdatePassword(currentUser, newPassword)` to update in Firebase Auth
3. The `id` param is preserved for signature compatibility but `auth.currentUser` is used directly — consistent with the UID sourcing rule established in session 11

**Note for future:** This only works for email/password users. Google-authenticated users have no password managed by the app — their password is controlled through Google's account settings. A guard should be added to detect `auth.currentUser.providerData` and show an appropriate message to Google users. Flagged as a future task.

---

### 2. AdminApplicationReview UI — restyled to match ApplicationPreview

`AdminApplicationReview.jsx` was using `AdminCard` (rounded-[2rem], p-10, font-serif) which did not match the clean card style used in the student-facing `ApplicationPreview.jsx`. The two pages now share the same visual language:

- `AdminCard` removed and replaced with `bg-white rounded-xl border border-slate-200 shadow-sm p-5`
- Section headers: `text-xs font-semibold text-slate-500 uppercase tracking-wider`
- Back button: text + arrow instead of icon-only
- Header card: tracker ID + title + status badge layout
- Applicant info rows: inline icon + text (`flex items-center gap-2.5 text-sm text-slate-600`)
- Document items: color-coded file type backgrounds matching ApplicationPreview's `getFileIcon` pattern

---

### 3. Application edit lock (student dashboard)

In `MyApplications.jsx`, the Edit button now checks the application's tracker stage progression before allowing navigation to the edit form.

**Condition:** `stages.some((s, i) => i >= 1 && s.completed)` — any stage after "Submitted" is done (i.e. the application has moved to "Under Review" or beyond).

**Behaviour when locked:**

- Button is visually grayed out (`text-slate-200 cursor-not-allowed`)
- Clicking shows a `toast.info`: _"Your application is currently under review. No changes can be made at this stage."_
- Navigation to the edit form is blocked entirely

---

### 4. Tracker enrolled lock (AppTracker modal)

Three layers of protection added to the `AppTracker.jsx` update modal:

**Stage toggle guard:** A stage cannot be unchecked if any later stage is already completed. Prevents going backwards through the progression (e.g. cannot uncheck "Under Review" if "Decision" is already done).

**Fully enrolled detection:** `editingApp.trackerStages.every(s => s.completed)` — once all stages including "Enrolled" are saved and complete, the modal enters a locked state.

**Locked modal state:**

- Green banner: _"This application has been fully enrolled. No further changes can be made."_
- All stage toggles: `cursor-not-allowed opacity-70`, click is no-op
- Status dropdown: `disabled`
- Save button: `disabled cursor-not-allowed`
- Help text changes from "Click a stage to toggle" → "This application has reached its final stage."

---

### 5. Terminal status lock (AdminApplicationReview)

Once an application is set to "Approved" or "Rejected", no further status changes are allowed.

**Guard in `handleStatusChange`:** If `app.status` is a terminal status, fires `toast.warning` — _"This application has already been finalised and cannot be changed."_ — with a description directing to a system administrator. Returns before any Firestore write.

**Visual lock in Status Management panel:**

- Coloured banner shown: green for Approved, red for Rejected
- All non-active status buttons: `text-slate-300 border-slate-100 cursor-not-allowed`
- Active status button (current terminal state): still shows bold/dark so the decision is clearly visible

---

## Session 13 — March 30, 2026

### 1. Branches CRUD — completed on Firestore

`useBranches.js` previously only had `fetchBranches` (read) and `createBranchMutation`. The Edit and Delete buttons in `BranchManagement.jsx` were calling `updateBranch` and `deleteBranch` which were never exported from the hook — both were silently broken.

**What was added to `useBranches.js`:**

- `updateBranchMutation` → `updateDoc(doc(db, "branches", id), data)` + cache invalidation
- `deleteBranchMutation` → `deleteDoc(doc(db, "branches", id))` + cache invalidation
- `submitting` flag exported (combines `createBranchMutation.isPending || updateBranchMutation.isPending`)
- Removed unused `MOCK_BRANCHES` import — branches are now always read from Firestore

**`BranchManagement.jsx` updated:**

- Destructures `updateBranch`, `deleteBranch`, `submitting` from the hook — Edit and Delete now work
- Removed unused `useEffect` import

**Note on architecture:** Branches intentionally skip a separate `branchService.js` — all Firestore logic lives directly in the hook. This is a conscious exception; all other data domains use a service layer. Not worth adding a service file for what is currently three simple one-liner Firestore calls.

---

### 2. Stats card bugs fixed — `BranchManagement.jsx`

Two silent bugs in the stats cards:

| Card           | Bug                                                                                        | Fix                                             |
| -------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Active Centers | `b.status == true` — comparing string `"Active"` against boolean `true`, always returned 0 | `b.status === "Active"`                         |
| Total Staff    | `b.staffCount` — field doesn't exist, the data model uses `b.staff`                        | `b.staff \|\| 0` (with fallback to prevent NaN) |

The card display also updated to pluralise "Staff Member/s" correctly using a conditional (`branch.staff === 1 ? "" : "s"`).

---

### 3. `docs/progress.md` created

A new progress report document was created at `docs/progress.md`. It contains:

- Deep-dive of Friday's commit (`f9fdbb7`) changes
- Firebase connection overview with per-domain breakdown (~40% overall)
- Prioritised list of what to migrate next
- 18 edge cases to test across auth, applications, React Query cache, and user management

---

## Pending / Future Tasks

| Priority | Task                                                   | Notes                                                                                                                                                                 |
| -------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | Firebase Security Rules — custom claims for admin role | `request.auth.token.role == 'admin'` requires Admin SDK to set custom claims on auth tokens. Without this, admin Firestore rules never match. Needs a Cloud Function. |
| High     | `visaService.js` → Firestore migration                 | Still on localStorage. Same pattern as applicationService migration.                                                                                                  |
| High     | `programService.js` → Firestore migration              | Still uses localStorage + `Math.random()` IDs. Next in queue.                                                                                                         |
| High     | `usePrograms.js` → React Query                         | Currently uses `useState/useEffect`. Migrate after programService.                                                                                                    |
| Medium   | Password change guard for Google users                 | Detect `auth.currentUser.providerData[0].providerId === 'google.com'` and show message instead of attempting re-auth with email/password                              |
| Medium   | Admin createUser → Cloud Function (Phase 3)            | Current secondary app workaround works but a Cloud Function using Admin SDK is the proper long-term solution                                                          |
| Low      | usernames collection refactor                          | Decision pending — remove `usernames` collection and replace transaction with query-based uniqueness check. See Session 10.                                           |
| Low      | deleteUser — delete Firebase Auth account              | Current `deleteUser` only deletes the Firestore profile, not the Firebase Auth account. The Auth account becomes orphaned. Needs Admin SDK or a Cloud Function.       |

---

## Overview

This session was a full codebase review and repair sprint. The app had recently been migrated to an MVC architecture (services → hooks → pages), but the migration was incomplete — files were in wrong directories, several hooks bypassed the service layer, and the app would have broken the moment a real backend was connected. Everything below was found, diagnosed, and fixed.

---

## Part 1 — File Structure Fix

### Problem

A previous refactor created two new directories that shouldn't exist:

- `src/pages/dashboard/` (should be `src/pages/student-dashboard/visa/`)
- `src/pages/admin/` (should be `src/pages/admin-dashboard/visa/`)

Three visa page files were in the wrong place, and the route imports pointed to the wrong paths.

### What we did

| Action  | File                                                                                       |
| ------- | ------------------------------------------------------------------------------------------ |
| Moved   | `pages/dashboard/VisaSummary.jsx` → `pages/student-dashboard/visa/VisaSummary.jsx`         |
| Moved   | `pages/dashboard/VisaRequestForm.jsx` → `pages/student-dashboard/visa/VisaRequestForm.jsx` |
| Moved   | `pages/admin/VisaCases.jsx` → `pages/admin-dashboard/visa/VisaCases.jsx`                   |
| Deleted | Empty `pages/dashboard/` and `pages/admin/` directories                                    |
| Updated | `StudentRoutes.jsx` — fixed lazy import paths                                              |
| Updated | `AdminRoutes.jsx` — fixed lazy import path                                                 |
| Fixed   | All imports inside moved files to use `@/` Vite path aliases                               |

---

## Part 2 — Code Quality Fixes (from full audit)

### 2a. Toast render loop — `VisaSummary.jsx`

`toast.error(error)` was called directly in the render body, firing on every re-render when `error` was set. Wrapped in `useEffect([error])`.

### 2b. Duplicate `getStatusColor()` functions

`VisaCaseDetails.jsx` and `VisaCaseResponse.jsx` each defined an identical `getStatusColor()` switch statement. Both were removed and replaced with `<VisaStatusBadge status={...} />` — the shared component that already existed.

### 2c. Broken `getConsultationById` import (3 files)

`VisaCaseDetails.jsx`, `VisaCaseResponse.jsx`, and `UploadCaseDocuments.jsx` all imported `getConsultationById` from `mockVisaData.js`. This function never existed — it was a stale reference from before the service layer was added. All three were updated to use `getVisaRequestById` from `visaService.js`.

### 2d. Unused imports in layout files

- `AdminLayout.jsx`: removed unused `Bell`, `ShieldCheck`
- `StudentDashboardLayout.jsx`: removed unused `Bell`, `MessageSquare`, `Search`

### 2e. `AdminSettings.jsx` — missing cleanup guard

The async `useEffect` that fetches the user profile had no cleanup, meaning it could call `setState` on an unmounted component. Added `let cancelled = false` guard pattern.

### 2f. Notes section added to VisaCases admin modal

Added a Notes row to the admin detail modal in `VisaCases.jsx` that renders only when `selectedCase.notes` is non-empty.

---

## Part 3 — Backend Readiness Fixes (8 priority items)

After a full backend readiness audit against the database schema, 8 critical fixes were identified and implemented.

### Fix 1 — `useApplications()` wrong call signature

**Files:** `Dashboard.jsx`, `MyApplications.jsx`, `ApplicationSubmitForm.jsx`
**Problem:** All three called `useApplications(user?.id)` but the hook signature is `useApplications({ userId })`.
**Result:** Students saw 0 applications — the hook received the ID as an unrecognised positional argument and fell through to the "fetch all" branch.
**Fix:** Changed to `useApplications({ userId: user?.id })`.

### Fix 2 — AuthContext never stored the JWT token

**File:** `AuthContext.jsx`
**Problem:** `login()`, `signUp()`, and `loginWithGoogle()` stored the user object in `localStorage` but never stored a JWT token. The axios client in `api/services.js` reads `localStorage.getItem('token')`, which was always `null` — every authenticated API call would fail the moment a real backend was connected.
**Fix:** Added `_persistSession(result)` helper. When the backend returns `{ token, user }`, the token is stored under `'token'`. `logout()` now also clears `'token'`.

### Fix 3 — `applicationService` userId filter mismatch

**File:** `applicationService.js`
**Problem (filter):** `getApplicationsByUserId` filtered by `app.applicant?.identityId === userId`, but student IDs are strings like `"USR-001"` while `identityId` in mock data is a number. Always returned 0 results.
**Problem (create):** `createApplication` stored `applicant: data.applicant || {}` — an empty object — because the form passes `firstName`, `lastName`, `email` at the top level, not nested under `applicant`.
**Fix:** Filter now checks both `app.applicant.identityId` and `app.userId`. `createApplication` now builds the `applicant` and `programDetails` objects from top-level form fields.

### Fix 4 — Department dropdown always empty

**File:** `ApplicationSubmitForm.jsx`
**Problem:** The form read `selectedProgram?.departments ?? []`, but programs were refactored to use `department_major_ids` — so `departments` was always `undefined` and the dropdown showed "No programs listed."
**Fix:** Replaced with `getProgramMajors(selectedProgram.id)` which resolves IDs through `MOCK_DEPARTMENT_MAJORS` join table. Dropdown label updated to match the `{ name, language, degree }` shape returned by the helper.

### Fix 5 — Sync call in edit mode

**File:** `ApplicationSubmitForm.jsx`
**Problem:** `getApplicationByIdSync(id)` was used to load an application in edit mode — a synchronous localStorage read. This breaks the moment the backend is real.
**Fix:** Replaced with `getApplicationById(id).then(app => ...)` (async). Fields now map from the DTO shape (`applicant.firstName`, `programDetails.majorName`).

### Fix 6 — Wrong env variable syntax

**File:** `api/services.js`
**Problem:** `process.env.REACT_APP_API_URL` is Create React App syntax. This project uses Vite — the variable was always `undefined`, so the base URL fell back to `localhost:5000` with no way to override it via `.env`.
**Fix:** Changed to `import.meta.env.VITE_API_BASE_URL`.

### Fix 7 — Programs lost on page refresh

**File:** `usePrograms.js`
**Problem:** All program CRUD mutated the in-memory `MOCK_PROGRAMS` array directly. Refreshing the page reset everything — admin changes vanished.
**Fix:** Created `src/services/programService.js` which persists programs to `localStorage` under `'edubridge_programs'`, seeding from `MOCK_PROGRAMS` on first load. `usePrograms.js` was refactored to a thin controller that delegates all reads/writes to the service (same MVC pattern as `applicationService` / `visaService`).

### Fix 8 — Hardcoded `"0"` visa count on admin dashboard

**File:** `useDashboard.js`
**Problem:** "Active Visa Cases" stat card was hardcoded to `"0"` with a TODO comment.
**Fix:** Added `getVisaRequests()` to the parallel `Promise.all` fetch. Count now shows visa cases that are not Approved or Rejected.

---

## Part 4 — Programs Module — Full MVC Refactor

### Problem

The program module was not following MVC:

- `usePrograms.js` handled localStorage directly inside the hook (no service layer)
- `useProgram` (single program) read from in-memory `MOCK_PROGRAMS` array — so after saving a program, the view page showed stale data
- No `programService.js` existed

### What we built

**`src/services/programService.js`** (new file — the Model)

- `getPrograms()` — returns all programs from localStorage, seeds from `MOCK_PROGRAMS` on first load
- `getProgramById(id)` — used by view and edit pages
- `createProgram(data)` — auto-generates ID, saves to localStorage
- `updateProgram(id, data)` — used by admin edit form
- `deleteProgram(id)` — used by admin list
- All functions are `async` — ready for `fetch()` / `axios` swap

**`usePrograms.js`** (refactored — the Controller)

- `usePrograms()` — list hook, delegates to `programService.getPrograms()`
- `useProgram(id)` — single hook, now reads from localStorage via `programService.getProgramById()` with proper `cancelled` cleanup guard

### Additional fixes in the programs module

- `UniversityProgramDetailsPreview` — fixed departments display: falls back to `getProgramMajors(program.id)` when `program.departments` is absent (original mock data uses `department_major_ids`)
- `ProgramSections.jsx` — `ProgramDepartments` now renders `dept.major ?? dept.name` so both admin-entered rows (`major`) and join-table-resolved rows (`name`) display correctly

---

## Part 5 — UI / UX Bugs Fixed

### DatePicker prop name mismatch

**File:** `src/components/ui/DatePicker.jsx`
**Problem:** Component was defined with `{ date, setDate }` props but `AdminProgramDetail.jsx` called it with `value` and `onChange`. The date inputs showed empty and threw `TypeError: setDate is not a function` when clicked.
**Fix:** Component now accepts both APIs — `value`/`onChange` (standard) and `date`/`setDate` (legacy) — making it backwards-compatible with any other callers.

### Duration & Credits field not updating

**File:** `AdminProgramDetail.jsx` — Departments section
**Problem:** The "Duration — Credits" input called `updateDepartment` twice (once for `duration`, once for `credits`). Both calls read from the same stale `formData` snapshot, so the second overwrote the first — typing appeared to have no effect.
**Fix:** Combined both updates into a single `setFormData` call.

### Sidebar and header showing wrong user name

**Files:** `StudentDashboardLayout.jsx`, `AdminLayout.jsx`
**Problem:** Both layouts read `user?.name`, but the user object returned by `userService` stores the name as `user.identity.firstName + user.identity.lastName`. `user.name` is always `undefined`, so hardcoded fallbacks (`"Alex Johnson"`, `"Admin User"`) were always shown.
**Fix:** Added `displayName` computed value in each layout:

```js
const displayName =
  user?.name ||
  [user?.identity?.firstName, user?.identity?.lastName]
    .filter(Boolean)
    .join(" ") ||
  "Student"; // or "Admin"
```

All sidebar text, header button, avatar initials, and dropdown now use `displayName`.

---

## Architecture Summary — Current State

```
src/
├── services/          ← MODEL (all data access, async, localStorage now / API later)
│   ├── userService.js
│   ├── applicationService.js
│   ├── visaService.js
│   └── programService.js   ← NEW today
│
├── hooks/             ← CONTROLLER (thin wrappers, state management, no storage logic)
│   ├── useApplications.js
│   ├── useVisaConsultations.js
│   ├── useAdminVisaCases.js
│   ├── usePrograms.js      ← Refactored today
│   └── useDashboard.js     ← Fixed today
│
└── pages/             ← VIEW (UI only, calls hooks, no direct service/localStorage access)
    ├── admin-dashboard/
    │   └── visa/VisaCases.jsx
    └── student-dashboard/
        └── visa/
            ├── VisaSummary.jsx
            ├── VisaRequestForm.jsx
            ├── VisaCaseDetails.jsx
            └── VisaCaseResponse.jsx
```

---

---

## Session 2 — March 17, 2026

### Part 6 — Visa Flow: Submit → Payment → Case Details → Documents

This session completed the full student visa consultation flow end-to-end and fixed several bugs found during testing.

---

#### 6a. Visa Request Submission → Payment Redirect

**File:** `src/pages/student-dashboard/visa/VisaRequestForm.jsx`

**Before:** After submitting the form, the user was navigated to `/dashboard/visa-status/summary` with no indication of what to do next about payment.

**After:** On successful submission, the user is navigated to `/dashboard/visa-status/payment-methods` with router state `{ visaType }` so the payment page can display the correct visa type in the fee notice:

```js
navigate("/dashboard/visa-status/payment-methods", {
  state: { visaType: formData.visaType },
});
```

**Why:** Students need to know how and where to pay the consultation fee immediately after requesting. The payment page (`PaymentMethodsPage.jsx`) already existed with bank details — it just wasn't wired to the form.

---

#### 6b. VisaCaseDetails Crash on New Submissions

**Files:** `src/services/visaService.js`, `src/pages/student-dashboard/visa/VisaCaseDetails.jsx`

**Problems found:**

1. `createVisaRequest` never initialised `documents: []` — so `caseData.documents.length` threw `TypeError` when a student clicked into their new case.
2. The detail page read `caseData.fee` and `caseData.dateBooked` (old mock data names) but the service stores `consultationFee` and `appointmentDate`. New submissions showed "—" and "TBD" correctly after the fix; old mock records continue to work via `||` fallbacks.
3. `doc.date` — used for display — doesn't exist on new documents. Field is `doc.uploadedAt`. Fixed with fallback: `doc.uploadedAt ?? doc.date`.
4. `doc.size` was rendered as raw bytes (e.g. `1099375`) instead of formatted KB.

**Fixes:**

```js
// visaService.js — createVisaRequest now includes:
documents: [],

// VisaCaseDetails.jsx — fee display:
{caseData.consultationFee || caseData.fee || "—"}

// appointment display:
{caseData.appointmentDate || caseData.dateBooked || "TBD"}

// document size + date:
{doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : "—"}
{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : doc.date ?? "—"}
```

---

#### 6c. "Join Meeting" — URL Appended to Current Path

**Files:** `src/pages/student-dashboard/visa/VisaCaseDetails.jsx`, `src/pages/admin-dashboard/visa/VisaCases.jsx`

**Root cause:** `window.open(url, '_blank')` treats any URL that doesn't start with `http://` or `https://` as a **relative path** and resolves it against the current page URL. The admin had typed `https/https://www.youtube.com/` (missing `://`) — a typo the browser's `type="url"` input accepted without validation.

**Result:** `localhost:5173/dashboard/.../details/VR-xxx` + `https/https://...` = broken URL.

**Fix 1 — Student side (`VisaCaseDetails.jsx`):** Button replaced with `<a href target="_blank">`. The `href` is normalised before use:

```jsx
href={/^https?:\/\//i.test(caseData.meetingLink)
  ? caseData.meetingLink
  : `https://${caseData.meetingLink}`}
```

**Fix 2 — Admin side (`VisaCases.jsx`):** `handleSaveSchedule` normalises the link before persisting to localStorage so bad URLs are corrected at the source:

```js
const rawLink = scheduleData.meetingLink.trim();
const normalizedLink =
  rawLink && !/^https?:\/\//i.test(rawLink) ? `https://${rawLink}` : rawLink;
```

---

#### 6d. Document Upload — Was Completely Fake

**File:** `src/pages/student-dashboard/visa/UploadCaseDocuments.jsx`

**Problem:** The upload form existed and showed a file picker, but `handleSubmit` was:

```js
await new Promise(resolve => setTimeout(resolve, 2000)); // fake delay only
toast.success("Successfully uploaded!");
navigate(...); // nothing was ever saved
```

Files were never converted, never stored — the "Submitted Documents" section always showed 0 files.

**Fix:** Mirrored exactly what `ApplicationSubmitForm.jsx` does for applications:

1. Added `fileToBase64(file)` helper (same `FileReader` + Promise pattern).
2. Added `addDocumentsToVisaRequest(caseId, newDocs)` to `visaService.js` — merges new docs into the existing array without overwriting other fields.
3. Rewrote `handleSubmit` to:
   - Convert each file to a base64 data URL
   - Build document objects: `{ id, name, type, size, url, uploadedAt, status: "Received" }`
   - Call `addDocumentsToVisaRequest(id, newDocuments)`
   - Navigate back to case details only after the save succeeds

**Document shape stored (identical to application documents):**

```json
{
  "id": "vdoc-1773697750378-0.42",
  "name": "passport.pdf",
  "type": "application/pdf",
  "size": 1048576,
  "url": "data:application/pdf;base64,...",
  "uploadedAt": "2026-03-17T10:30:00.000Z",
  "status": "Received"
}
```

---

#### 6e. Document Preview and Delete — Persistent, MVC-Correct

**Files:** `src/services/visaService.js`, `src/pages/student-dashboard/visa/VisaCaseDetails.jsx`

##### Preview

The existing Eye button called `window.open(doc.url, '_blank')`. This fails silently in many browsers when the URL is a `data:` URI (blocked as a security measure).

**Fix:** Convert the base64 data URL → `Blob` → object URL, then open the object URL in a new tab. Object URLs (`blob:` scheme) are not blocked:

```js
const handlePreview = (doc) => {
  const [header, b64] = doc.url.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  const blobUrl = URL.createObjectURL(new Blob([arr], { type: mime }));
  const tab = window.open(blobUrl, "_blank");
  if (tab) setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
};
```

The object URL is revoked after 10 seconds (once the browser has loaded the file) to free memory.

##### Delete

The existing delete handler only did an optimistic in-memory update — **the document came back on page refresh** because localStorage was never updated.

**Fix:**

1. Added `deleteDocumentFromVisaRequest(caseId, docId)` to `visaService.js` — filters the document out of the array and writes back to localStorage.
2. Updated `handleDeleteDocument` to `await` the service call, then replace `caseData` with the returned updated record (not just filter local state).

```js
// visaService.js
export const deleteDocumentFromVisaRequest = async (caseId, docId) => {
  const all = readAll();
  const updated = all.map((r) =>
    r.id === caseId
      ? { ...r, documents: (r.documents ?? []).filter((d) => d.id !== docId) }
      : r,
  );
  writeAll(updated);
  return updated.find((r) => r.id === caseId);
};

// VisaCaseDetails.jsx
const updated = await deleteDocumentFromVisaRequest(id, docId);
setCaseData(updated); // whole case replaced, not just filtered state
```

---

#### 6f. Admin — Document Review (VisaCases.jsx admin modal)

The admin detail modal already displayed submitted documents. Two field-name mismatches were fixed:

- `doc.fileId` → `doc.id` (key prop)
- `doc.fileName` → `doc.name`
- `doc.uploadDate` → `doc.uploadedAt`
- Raw `doc.size` bytes → `(doc.size / 1024).toFixed(1) KB`
- Download button now triggers a real file download via `<a href=doc.url download=doc.name>` instead of showing a toast

---

### Visa Flow Architecture (complete, as of March 17)

```
STUDENT SIDE
────────────
VisaRequestForm
  → useVisaConsultations.submitRequest()
      → visaService.createVisaRequest()         [localStorage write]
  → navigate("/dashboard/visa-status/payment-methods", { state: { visaType } })

PaymentMethodsPage
  → Reads location.state.visaType for display
  → Shows bank details (BK Rwanda, Equity, Woori Bank Korea)
  → Student pays externally, then returns to dashboard

VisaSummary
  → useVisaConsultations(userId)
      → visaService.getVisaRequestsByUserId()   [localStorage read]
  → Lists all cases with status badges

VisaCaseDetails (/summary/details/:id)
  → visaService.getVisaRequestById(id)          [localStorage read]
  → Shows: destination, visa type, status, fee, appointment, documents
  → handlePreview(doc)   → Blob → object URL → new tab
  → handleDeleteDocument → visaService.deleteDocumentFromVisaRequest() → persist
  → "Join Meeting" → <a href> with URL normalization (https:// guard)

UploadCaseDocuments (/summary/details/:id/upload)
  → fileToBase64(file)                          [FileReader → base64]
  → visaService.addDocumentsToVisaRequest()     [localStorage write, merge]
  → navigate back to VisaCaseDetails

VisaCaseResponse (/summary/response/:id)
  → Shows admin notes, fee status, meeting link, consultant message

ADMIN SIDE
──────────
VisaCases (/admin/visa)
  → useAdminVisaCases()
      → visaService.getVisaRequests()           [localStorage read — all cases]
  → Table: search, filter by status
  → Detail modal per case:
      → Status update   → visaService.updateVisaStatus()
      → Fee update      → visaService.updateVisaFee()
      → Schedule meeting→ visaService.updateVisaSchedule()
                          (meetingLink is normalised to https:// on save)
      → View documents  → real download via <a href=doc.url download>
      → Notes           → shown when selectedCase.notes is non-empty
```

---

### Service Functions — visaService.js (complete list)

| Function                                       | Who calls it | What it does                              |
| ---------------------------------------------- | ------------ | ----------------------------------------- |
| `getVisaRequests()`                            | Admin        | All cases                                 |
| `getVisaRequestsByUserId(userId)`              | Student      | This student's cases                      |
| `getVisaRequestById(id)`                       | Detail pages | Single case                               |
| `createVisaRequest(formData, userId)`          | Student form | New case + `documents: []`                |
| `addDocumentsToVisaRequest(caseId, newDocs)`   | Upload form  | Merge docs, persist                       |
| `deleteDocumentFromVisaRequest(caseId, docId)` | Detail page  | Remove one doc, persist                   |
| `updateVisaRequest(id, formData)`              | Student edit | Student-safe update (strips admin fields) |
| `updateVisaStatus(id, status)`                 | Admin        | Status only                               |
| `updateVisaFee(id, fee, feeStatus)`            | Admin        | Fee only                                  |
| `updateVisaSchedule(id, schedule)`             | Admin        | Date, time, link                          |
| `deleteVisaRequest(id)`                        | Admin        | Delete whole case                         |

---

---

## Session 3 — March 17, 2026

### Part 7 — Admin Visa Case Detail Page

#### 7a. New full-page admin view for visa cases

**New file:** `src/pages/admin-dashboard/visa/AdminVisaCaseDetails.jsx`
**Updated:** `src/routes/AdminRoutes.jsx`, `src/pages/admin-dashboard/visa/VisaCases.jsx`

**Why:** The admin visa table previously had an Eye button that opened a modal. The modal only showed basic info and the scheduler. The student's `VisaCaseDetails` page showed documents nicely — the admin had no equivalent full-page view and could not preview or download student-uploaded documents.

**What was built:**

| Section             | Content                                                              |
| ------------------- | -------------------------------------------------------------------- |
| Student info card   | Name, email, phone, country of origin, status badge, submission date |
| Summary cards (4)   | Destination (with flag), visa type, status, fee + fee status badge   |
| Appointment section | Scheduled date/time, meeting type, clickable meeting link            |
| Notes               | Shown only when `caseData.notes` is non-empty                        |
| Documents grid      | Paginated (6 per page), preview + download only — **no delete**      |

**Document actions (admin):**

- **Preview** — same Blob URL pattern as student side: `base64 → atob → Uint8Array → Blob → createObjectURL → window.open`
- **Download** — `document.createElement('a')` with `href=doc.url` and `download=doc.name`
- **No delete button** — admin is read-only for student documents

**Navigation changes in `VisaCases.jsx`:**

| Button        | Before                  | After                                            |
| ------------- | ----------------------- | ------------------------------------------------ |
| Eye (view)    | Opened management modal | `navigate('/admin/visa/:id')` → full detail page |
| Edit (pencil) | Opened add/edit form    | Opens management modal (status + schedule)       |

**Route added to `AdminRoutes.jsx`:**

```jsx
<Route path="visa/:id" element={<AdminVisaCaseDetails />} />
```

---

#### 7b. Fee card removed from student VisaCaseDetails

**File:** `src/pages/student-dashboard/visa/VisaCaseDetails.jsx`

The student case detail page showed 4 summary cards: Destination, Visa Type, Status, and **Fee**. The fee is an admin-only field (set by admin after reviewing the request) — showing it on the student side before it's set was confusing (always showed "—"). Fee information is already visible on the `VisaCaseResponse` tab.

**Fix:** Removed the Fee card entirely from the student view. The grid is now 3 columns (Destination, Visa Type, Status). Fee details remain in the admin `AdminVisaCaseDetails` page and the student's Admin Response tab.

---

#### 7c. localStorage Quota Error on Document Upload

**Files:** `src/services/visaService.js`, `src/pages/student-dashboard/visa/UploadCaseDocuments.jsx`

**Problem:** Users with existing data in localStorage (applications + visa cases) were hitting the browser's **~5MB total localStorage limit** when uploading documents. Base64 encoding adds ~33% size overhead, so a 3MB file becomes ~4MB. `localStorage.setItem` silently throws a `QuotaExceededError` (`DOMException`), which was caught by the generic catch and showed "Failed to upload documents — Please try again or contact support."

The user had no idea why it failed — the error gave no actionable guidance.

**Fixes:**

1. **`visaService.js` — `writeAll`:** Now catches `QuotaExceededError` specifically and re-throws with a readable message:

```js
throw new Error(
  "Browser storage is full. Try uploading smaller files, or delete existing documents to free up space.",
);
```

2. **`UploadCaseDocuments.jsx` — catch block:** Passes `error.message` to the toast description so the specific reason is shown to the user instead of the fallback generic text.

3. **File size cap reduced:** Per-file maximum reduced from 10MB → **2MB**. A 2MB file encodes to ~2.7MB base64, which is realistic for a storage-constrained mock backend. The UI hint text updated to match.

**Note:** This is a fundamental limitation of `localStorage` as a mock backend. The long-term fix is replacing `writeAll` with a real API call — the service is already structured for that.

---

#### 7d. Toast Styling — System Colors and Bigger Typography

**File:** `src/App.jsx`

**Before:** Used Sonner's built-in `richColors` preset — generic green/yellow/red colors that didn't match the app's design system.

**After:** Replaced `richColors` with custom `classNames` matching the app's Tailwind palette:

| Toast type       | Background   | Border        | Text          |
| ---------------- | ------------ | ------------- | ------------- |
| Success          | `emerald-50` | `emerald-200` | `emerald-900` |
| Warning / Delete | `red-50`     | `red-200`     | `red-900`     |
| Error            | `red-50`     | `red-200`     | `red-900`     |
| Info             | `blue-50`    | `blue-200`    | `blue-900`    |

**Typography:** Title bumped from default `text-sm` → `text-base font-semibold`. Description from `text-xs` → `text-sm` with relaxed line height.

**Action button** ("Delete" in confirmation toasts): `red-600` background — signals danger clearly.
**Cancel button**: `slate-100` background / `slate-700` text — neutral.

This is a global change — all `toast.*()` calls in the entire app benefit automatically.

---

### Architecture — Updated (after Session 3)

```
ADMIN SIDE (updated)
─────────────────────
VisaCases (/admin/visa)
  → Table row Eye button  → navigate('/admin/visa/:id')  [NEW]
  → Table row Edit button → management modal (status + schedule)

AdminVisaCaseDetails (/admin/visa/:id)       [NEW FILE]
  → visaService.getVisaRequestById(id)
  → Shows: student card, 4 summary cards, appointment, notes, documents
  → handlePreview(doc) → Blob URL → new tab
  → handleDownload(doc) → <a download> trigger
  → NO delete — admin is read-only for student documents
```

---

## Tomorrow / Future Work

### High Priority — Backend Integration

| Task                         | Details                                                                                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Connect real auth API**    | `userService.loginUser` → `authAPI.login(email, password)`. Response will be `{ token, user }`. AuthContext is already ready to receive it (`_persistSession` handles the token). |
| **Connect applications API** | Replace `localStorage` body in `applicationService.js` with `applicationAPI.*` calls from `api/services.js`. The hook and all pages stay unchanged.                               |
| **Connect visa API**         | Same swap in `visaService.js` → `visaAPI.*`.                                                                                                                                      |
| **Connect programs API**     | Same swap in `programService.js` → `fetch('/api/programs/...')`.                                                                                                                  |
| **Connect users API**        | Same swap in `userService.js` → `userAPI.*`.                                                                                                                                      |
| **Create `.env` file**       | Add `VITE_API_BASE_URL=https://your-backend.com/api`. The axios client already reads it.                                                                                          |

### Medium Priority — Feature Completeness

| Task                                     | Details                                                                                                                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Student profile settings page**        | The student equivalent of `AdminSettings.jsx` — currently missing or incomplete. Should let students edit phone, nationality, gender, DOB and change password.                         |
| **Visa document upload**                 | `UploadCaseDocuments.jsx` exists but needs real file handling (upload to S3 / Cloudinary in production, or Base64 for demo like applications).                                         |
| **Application detail page for students** | Students can list and delete applications but there's no proper read-only detail view showing all fields, tracker stages, and admin feedback.                                          |
| **Admin feedback on applications**       | Admin can change status but the `sendFeedback` and `requestDocuments` API methods exist and are unused. Wire them to the UI.                                                           |
| **Programs — Departments (join table)**  | Currently admins add departments as flat rows stored in `departments[]`. In production, this should create/update `MAJOR` and `DEPARTMENT_MAJOR` records. Plan the form → API mapping. |
| **Real file download**                   | Documents stored as Base64 data URLs work for demo. In production, replace with signed S3 URLs.                                                                                        |

### Low Priority — Polish & UX

| Task                             | Details                                                                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Form validation**              | Add proper validation (Zod or simple custom) to `VisaRequestForm`, `ApplicationSubmitForm`, and the program form. Currently only HTML5 `required` is used. |
| **Loading skeletons**            | Some pages show a spinner, others show nothing while loading. Standardise with `<Skeleton>` components throughout.                                         |
| **Empty states**                 | Pages like `MyApplications` and `VisaSummary` need friendly empty state illustrations when a student has no records.                                       |
| **Notifications**                | The bell icon in layouts is commented out. When the backend is ready, wire it to a notifications endpoint.                                                 |
| **Search in admin tables**       | `UserManagement`, `ApplicationReview`, and `VisaCases` have search UI but some may not be fully wired.                                                     |
| **Hardcoded background colours** | Both layouts use `bg-[#F8FAFC]`. Replace with Tailwind `bg-slate-50` for consistency.                                                                      |
| **Analytics page**               | Currently a placeholder. Wire to `analyticsAPI.*` when backend is ready.                                                                                   |
| **Financial Reports**            | Same — placeholder, needs backend.                                                                                                                         |
| **Role Management**              | Route is commented out (`/admin/roles`). This will be a backend-only concern — implement after auth roles are live.                                        |

### Security — Before Going Live

| Task                                   | Details                                                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Remove passwords from localStorage** | `userService` currently stores plain-text passwords in `localStorage` for the mock. This MUST be removed — the real backend handles auth.  |
| **JWT refresh tokens**                 | The axios interceptor handles 401 → logout. Add a refresh token flow so sessions don't expire mid-use.                                     |
| **Input sanitisation**                 | Audit all free-text inputs (notes, descriptions) for XSS risk before rendering as HTML.                                                    |
| **Route protection audit**             | Verify all admin routes are wrapped in `<ProtectedRoute allowedRoles={['admin']}>` and all student routes in `allowedRoles={['student']}`. |

---

## Quick Reference — Key Files

| What you want to change             | File to edit                                             |
| ----------------------------------- | -------------------------------------------------------- |
| Auth logic (login, logout, session) | `src/context/AuthContext.jsx`                            |
| User data / password / profile      | `src/services/userService.js`                            |
| Application CRUD                    | `src/services/applicationService.js`                     |
| Visa request CRUD                   | `src/services/visaService.js`                            |
| Program CRUD                        | `src/services/programService.js`                         |
| Admin dashboard stats               | `src/hooks/useDashboard.js`                              |
| Axios base URL / auth header        | `src/api/services.js`                                    |
| Student sidebar & header            | `src/pages/student-dashboard/StudentDashboardLayout.jsx` |
| Admin sidebar & header              | `src/pages/admin-dashboard/AdminLayout.jsx`              |
| Student route definitions           | `src/routes/StudentRoutes.jsx`                           |
| Admin route definitions             | `src/routes/AdminRoutes.jsx`                             |
| Status badge colours                | `src/data/mockVisaData.js` → `VISA_STATUS_CONFIG`        |
| Program majors / join table         | `src/data/mockMajors.js`                                 |

---

---

## Session 4 — March 17, 2026

### Part 8 — Full MVC for CMS Content Types + Landing Page UI Overhaul + FAQ MVC

This session completed the MVC architecture for all remaining content types, overhauled the landing page UI/UX to be more interactive and modern, fixed the CMS tab nav responsiveness, and connected the FAQ section on ContactPage to the admin CMS via a persistent service layer.

---

#### 8a. Landing Page — Hero Wave & Video Loop Removed

**File:** `src/pages/home/pages/Hero.jsx`

The hero section had a curved SVG wave divider at the bottom and a background video that stuttered at the loop point. Both were removed:

- SVG wave `<div>` (with gradient `<path>`) deleted entirely
- Background video is a known issue (requires video re-encoding for seamless loop) — not fixable in code

---

#### 8b. New Animated Stats Bar

**New file:** `src/pages/home/pages/StatsBar.jsx`
**Updated:** `src/pages/home/LandingPage.jsx`

A new stats section placed directly below the hero shows 4 animated counters that trigger when scrolled into view:

| Stat              | Value   |
| ----------------- | ------- |
| Students Enrolled | 10,000+ |
| Countries Reached | 25+     |
| Visa Success Rate | 98%     |
| Years Experience  | 10+     |

Uses `useInView` + `requestAnimationFrame` with easeOutExpo easing. Numbers ≥ 1000 are formatted as `Xk`.

---

#### 8c. Landing Page — WhyChoose & AcademicServices Redesign

**Files:** `src/pages/home/pages/WhyChoose.jsx`, `src/pages/home/pages/AcademicServices.jsx`

Both sections were rewritten to remove the `useCMSManager`/`FeatureGrid`/`FeatureCard` dependency. The new versions use:

- Inline data arrays with per-item icon, color, and background
- framer-motion `whileInView` scroll-triggered animations with staggered delays (`i * 0.1s`)
- `whileHover={{ y: -6, boxShadow: "..." }}` lift effect
- Pill badges ("Why EduBridge", "What We Offer")
- Colored icon backgrounds (blue, emerald, amber, purple, rose, teal)

---

#### 8d. New Testimonials Carousel (Dark Theme)

**File:** `src/pages/home/pages/Testimonials.jsx` (rewritten)

Replaced the previous testimonials section with a dark navy auto-scrolling carousel:

- Background: `bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900`
- Auto-advances every 4 seconds, pauses on hover (`onMouseEnter/Leave`)
- `AnimatePresence` with slide-in (`x: 60`) / slide-out (`x: -60`) transition
- Arrow nav buttons (left/right), dot indicators (active: `w-8 bg-amber-400`, inactive: `w-2 bg-white/30`)
- 5 testimonials: Jane M. (Kenya), Samuel O. (Nigeria), Ms. Amina B. (Tanzania), David K. (Uganda), Grace N. (Rwanda)

---

#### 8e. New Gallery Teaser Section

**New file:** `src/pages/home/pages/GalleryTeaser.jsx`
**Updated:** `src/pages/home/LandingPage.jsx`

A masonry grid showing the first 6 items from `MOCK_MEDIA` (linked to `/gallery` for full view):

- 3-column CSS `columns` masonry layout
- Hover overlay with student name, country (MapPin icon), program (GraduationCap icon)
- Scroll-triggered staggered animations (`delay: i * 0.08`)
- "View All Stories" link to `/gallery`

**Updated `LandingPage.jsx` section order:**
Hero → StatsBar → Partners → WhyChoose → AcademicServices → GalleryTeaser → Testimonials → CallToAction

---

#### 8f. Full MVC for 4 Content Types

**Problem:** `CMSScholarships`, `CMSPosts`, and `CMSMedia` all used `useCMSManager` which only mutated in-memory arrays — admin changes were lost on page refresh. `BranchesPage` read from a static import. `ScholarshipsPage` and `BlogPage` fetched from `BASE_URL/scholarships` and `BASE_URL/blogs` — endpoints that don't exist.

**New Model layer (4 service files):**

| File                                 | Storage Key              | Seed Data                                                    |
| ------------------------------------ | ------------------------ | ------------------------------------------------------------ |
| `src/services/scholarshipService.js` | `edubridge_scholarships` | `MOCK_SCHOLARSHIPS`                                          |
| `src/services/postService.js`        | `edubridge_posts`        | `MOCK_BLOGS`                                                 |
| `src/services/mediaService.js`       | `edubridge_media`        | `MOCK_MEDIA`                                                 |
| `src/services/branchService.js`      | `edubridge_branches`     | `branches` from `branches.js` (full schema with coordinates) |

Each service follows the `programService.js` pattern: `_read()` with DEV-only seeding, `_save()`, async CRUD (`get`, `getById`, `create`, `update`, `delete`).

**New Controller layer (8 hooks):**

| Hook                    | Purpose                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| `useScholarships`       | Public read for ScholarshipsPage                                           |
| `useAdminScholarships`  | Admin CRUD with toast feedback                                             |
| `usePosts`              | Public read for BlogPage                                                   |
| `useAdminPosts`         | Admin CRUD with toast feedback                                             |
| `useMedia`              | Public read for GalleryPage                                                |
| `useAdminMedia`         | Admin CRUD with toast feedback                                             |
| `useBranches` (updated) | Replaced in-memory module variable with `branchService` localStorage calls |
| `useFAQQuestions`       | Public read + admin CRUD for FAQ items on ContactPage                      |

**Updated CMS pages (admin):**

- `CMSScholarships.jsx` — now uses `useAdminScholarships` (add/edit/remove persisted to localStorage)
- `CMSPosts.jsx` — now uses `useAdminPosts`
- `CMSMedia.jsx` — now uses `useAdminMedia`, shows loading skeleton

**Updated public pages:**

- `ScholarshipsPage.jsx` — replaced `fetch(BASE_URL/scholarships)` with `useScholarships()` hook
- `BlogPage.jsx` — replaced `fetch(BASE_URL/blogs)` with `usePosts()` hook
- `GalleryPage.jsx` — replaced static `MOCK_MEDIA` import with `useMedia()` hook
- `BranchesPage.jsx` — replaced static `branches` import with `useBranches()` hook; selectedBranch initialised via `useEffect` once data loads; loading spinner while branches fetch

---

#### 8g. ContentManagement Tab Nav — Responsiveness Fix

**File:** `src/pages/admin-dashboard/cms/ContentManagement.jsx`

The 6-tab nav (`flex space-x-8`) overflowed on small screens with no scroll or wrap.

**Fix:** Changed to `flex overflow-x-auto scrollbar-none` with `whitespace-nowrap flex-shrink-0` on each tab link. Tabs now horizontally scroll on mobile instead of overflowing. Short-form tab labels shown on very small screens (`xs:` breakpoint).

---

#### 8h. FAQ MVC Connection — CMSPollQuestions → ContactPage

**New file:** `src/services/faqService.js`
**New hook:** `src/hooks/useFAQQuestions.js`
**Updated:** `src/pages/admin-dashboard/cms/CMSPollQuestions.jsx`, `src/pages/contact/contactPage.jsx`

The FAQ section on ContactPage previously read from a static array in `faqData.js` — admin edits had no effect.

**Architecture:**

```
Admin (CMSPollQuestions FAQ Manager tab)
  → useFAQQuestions.add/edit/remove()
      → faqService.createFAQ/updateFAQ/deleteFAQ()
          → localStorage: "edubridge_faqs"
              ↑ seeded from faqData.js on first load

ContactPage
  → useFAQQuestions.faqs (read)
      → faqService.getFAQs()
          → localStorage: "edubridge_faqs"
```

**CMSPollQuestions** now has two sub-tabs:

1. **FAQ Manager** (default) — add/edit/delete Q&A pairs that appear live on ContactPage
2. **Poll Questions** — existing program-specific assessment questions (unchanged)

**ContactPage** now uses `const { faqs } = useFAQQuestions()` — live data instead of static import.

---

### Architecture — Updated (after Session 4)

```
src/
├── services/                    ← MODEL
│   ├── userService.js
│   ├── applicationService.js
│   ├── visaService.js
│   ├── programService.js
│   ├── scholarshipService.js    ← NEW
│   ├── postService.js           ← NEW
│   ├── mediaService.js          ← NEW
│   ├── branchService.js         ← NEW
│   └── faqService.js            ← NEW
│
├── hooks/                       ← CONTROLLER
│   ├── useApplications.js
│   ├── useVisaConsultations.js
│   ├── useAdminVisaCases.js
│   ├── usePrograms.js
│   ├── useDashboard.js
│   ├── useBranches.js           ← UPDATED (localStorage-backed)
│   ├── useScholarships.js       ← NEW
│   ├── useAdminScholarships.js  ← NEW
│   ├── usePosts.js              ← NEW
│   ├── useAdminPosts.js         ← NEW
│   ├── useMedia.js              ← NEW
│   ├── useAdminMedia.js         ← NEW
│   └── useFAQQuestions.js       ← NEW
│
└── pages/                       ← VIEW
    ├── home/pages/
    │   ├── Hero.jsx             (wave removed)
    │   ├── StatsBar.jsx         ← NEW
    │   ├── WhyChoose.jsx        (rewritten with framer-motion)
    │   ├── AcademicServices.jsx (rewritten with framer-motion)
    │   ├── Testimonials.jsx     (rewritten — dark carousel)
    │   └── GalleryTeaser.jsx    ← NEW
    ├── admin-dashboard/cms/
    │   ├── ContentManagement.jsx (tab nav fixed — scrollable)
    │   ├── CMSScholarships.jsx   (useAdminScholarships)
    │   ├── CMSPosts.jsx          (useAdminPosts)
    │   ├── CMSMedia.jsx          (useAdminMedia)
    │   └── CMSPollQuestions.jsx  (FAQ Manager + Poll Questions sub-tabs)
    ├── scholarships/ScholarshipsPage.jsx  (useScholarships)
    ├── blog/BlogPage.jsx                  (usePosts)
    ├── gallery/GalleryPage.jsx            (useMedia)
    ├── branches/BranchesPage.jsx          (useBranches)
    └── contact/contactPage.jsx            (useFAQQuestions)
```

---

## Session 5 — March 18, 2026

### DB Alignment Audit (Real ERD)

Reviewed the actual EDUBRIDGE DATABASE SCHEMA ERD. Updated the alignment score from the vague "60%" claimed previously to an honest **~45%**.

Key findings:

- The core academic flow (USER → IDENTITY → APPLICATION_TRACKER → DEPARTMENT_MAJOR_APPLICATION) has reasonable frontend coverage but with field-level mismatches.
- `USER.id` was `"USR-001"` (string) — DB uses integer PKs. Decided to switch to **UUIDs** going forward.
- `IDENTITY.dob` was named `date_birth` in mock data — renamed to align.
- `USER` had a denormalized `role` field — DB has a separate `ROLE` table with no direct FK on USER. To be aligned progressively.
- The APPLICATION table in DB is **finance-only** (fees). The frontend `MOCK_UNIFIED_APPLICATIONS` is a DTO that joins APPLICATION_TRACKER + IDENTITY + INSTITUTION — which is correct architecture for a read model, but not the same shape as the raw table.

Full field-level mismatch table documented in the audit above this session.

---

### Architecture Decision — CMS Content Goes to a Headless CMS

**Problem identified:** In Session 4 we gave Blog posts, Scholarships, Testimonials/Media, Branches, FAQ items, and Library resources a full localStorage-backed MVC layer (service file + hook file). This was over-engineered and wrong for what these features actually are.

**Why it was wrong:** These content types do not belong in the application database at all:

- They are marketing/informational content — they change on editorial schedules, not business logic schedules.
- They have no relational integrity requirements with USER, APPLICATION, or any other core table.
- The real DB ERD (reviewed this session) has zero tables for any of them, confirming they are out of scope for the backend.
- Persisting them to localStorage gave a false sense of "working" persistence — any real deployment would start empty and the admin edits would be invisible to other users.

**Decision:** Use a **headless CMS** (Strapi, Sanity, Contentful, or similar) for this content when the backend is built. Until then, read from static mock data files — no fake persistence.

---

### What Was Deleted

The following 12 files were removed entirely:

**Service files (Model layer) — deleted:**

- `src/services/scholarshipService.js`
- `src/services/postService.js`
- `src/services/mediaService.js`
- `src/services/branchService.js`
- `src/services/faqService.js`

**Hook files (Controller layer) — deleted:**

- `src/hooks/useScholarships.js`
- `src/hooks/useAdminScholarships.js`
- `src/hooks/usePosts.js`
- `src/hooks/useAdminPosts.js`
- `src/hooks/useMedia.js`
- `src/hooks/useAdminMedia.js`
- `src/hooks/useFAQQuestions.js`

---

### How Each Feature Now Works

| Feature                | Public page reads from                     | Admin page writes to                         |
| ---------------------- | ------------------------------------------ | -------------------------------------------- |
| Blog / News            | `MOCK_BLOGS` (mockData.js)                 | `useState(MOCK_BLOGS)` — session only        |
| Scholarships           | `MOCK_SCHOLARSHIPS` (mockData.js)          | `useState(MOCK_SCHOLARSHIPS)` — session only |
| Gallery / Testimonials | `MOCK_MEDIA` (mockData.js)                 | `useState(MOCK_MEDIA)` — session only        |
| FAQ                    | `faqs` (faqData.js)                        | `MOCK_POLL_QUESTIONS` — session only         |
| Branches (public)      | `branches` (branches.js) via `useBranches` | —                                            |
| Branches (admin)       | `useBranches` hook state                   | `useBranches` — session only                 |

"Session only" means admin edits are in-memory and reset on page refresh. This is intentional — the real persistence will come from a CMS API call when that is integrated.

---

### useBranches — CRUD Moved Into the Hook

`BranchManagement.jsx` was calling `createBranch`, `updateBranch`, `deleteBranch` from `useBranches`, but the hook only returned static data — those functions were `undefined`.

Fixed by moving all mutation logic into the hook:

- `useBranches` now owns `useState(STATIC_BRANCHES)` and exposes `createBranch`, `updateBranch`, `deleteBranch` with `toast.success` feedback inside.
- `BranchManagement` became a pure UI component: it handles form state, modal open/close, and the confirmation toast. No try/catch, no async.
- `BranchesPage` (public) is unaffected — it only destructures `{ branches }`.

---

### BranchesPage — Hook Error Fixed

**Bug:** `Error: Should have a queue. You are likely calling Hooks conditionally.`

**Root cause — two issues in the same file:**

1. `const InteractiveMap = lazy(...)` was placed between `import` statements (line 15, between lines 14 and 16). In ESM, all `import` declarations are hoisted but `const` is not. Vite's HMR saw the module boundary as malformed, corrupting React's fiber hook queue on hot reload.

2. `useState(null)` + `useEffect` to initialize `selectedBranch` from branches was unnecessary extra work. Since `useBranches` returns data synchronously (no async), `branches` is available on the first render.

**Fix:**

- Moved `const InteractiveMap = lazy(...)` to after all `import` statements.
- Replaced `useState(null)` + `useEffect` with a single lazy initializer: `useState(() => branches.find(b => b.isHeadOffice) ?? branches[0] ?? null)`.
- Removed `useEffect` and its import.
- Removed the `loading` variable and the `loading || !selectedBranch` JSX guard (branches are always synchronously available).

---

### CMS Admin Pages — `window.confirm` Replaced with Toast

All delete handlers in `src/pages/admin-dashboard/cms/` were using `window.confirm()` which blocks the JS thread and looks out of place in a modern UI. Replaced with sonner's action toast pattern across all four pages:

```js
toast("Delete this item?", {
  action: { label: "Delete", onClick: () => remove(id) },
  cancel: { label: "Cancel", onClick: () => {} },
});
```

Files updated: `CMSScholarships.jsx`, `CMSPosts.jsx`, `CMSMedia.jsx`, `CMSPollQuestions.jsx`.

---

### Updated Architecture (after Session 5)

```text
src/
├── services/                    ← MODEL (business data only)
│   ├── userService.js
│   ├── applicationService.js
│   ├── visaService.js
│   └── programService.js
│
├── hooks/                       ← CONTROLLER
│   ├── useApplications.js
│   ├── useVisaConsultations.js
│   ├── useAdminVisaCases.js
│   ├── usePrograms.js
│   ├── useDashboard.js
│   └── useBranches.js           (useState + CRUD, seeded from branches.js)
│
├── data/                        ← CMS CONTENT (static until headless CMS)
│   ├── mockData.js              (MOCK_BLOGS, MOCK_SCHOLARSHIPS, MOCK_MEDIA)
│   ├── mockUsers.js
│   ├── mockMajors.js
│   ├── mockVisaData.js
│   ├── faqData.js
│   └── branches.js
│
└── pages/                       ← VIEW
    ├── admin-dashboard/cms/
    │   ├── CMSScholarships.jsx  (useState(MOCK_SCHOLARSHIPS), toast confirm)
    │   ├── CMSPosts.jsx         (useState(MOCK_BLOGS), toast confirm)
    │   ├── CMSMedia.jsx         (useState(MOCK_MEDIA), toast confirm)
    │   └── CMSPollQuestions.jsx (useState(MOCK_POLL_QUESTIONS), no FAQ tab)
    ├── scholarships/            → reads MOCK_SCHOLARSHIPS directly
    ├── blog/                    → reads MOCK_BLOGS directly
    ├── gallery/                 → reads MOCK_MEDIA directly
    ├── contact/                 → reads faqs from faqData.js directly
    └── branches/                → reads via useBranches hook
```

---

## Session 6 — March 18, 2026

### Part A — CMS Admin Pages: useCMSManager Consolidation

**Problem:** Three CMS admin pages (`CMSScholarships`, `CMSPosts`, `CMSMedia`) each had ~30 lines of copy-pasted state + handlers (useState, useMemo, add/edit/remove helpers) while `useCMSManager` — a hook that centralises exactly this logic — sat unused. Only `CMSLibrary` was using it.

**What we did:**

- Rewrote all three pages to destructure from `useCMSManager(MOCK_DATA, EMPTY, searchKeys)` instead of owning their own state.
- Removed all inline `useState`, `useMemo`, `toast`, `add/edit/remove` helpers from each file.
- Removed the `loading ? (...) : (...)` ternary from `CMSMedia` — `loading` was always `false`.

| Page              | Hook call                                                        | Search keys          |
| ----------------- | ---------------------------------------------------------------- | -------------------- |
| `CMSScholarships` | `useCMSManager(MOCK_SCHOLARSHIPS, EMPTY, ['title', 'location'])` | title, location      |
| `CMSPosts`        | `useCMSManager(MOCK_BLOGS, EMPTY, ['title', 'category'])`        | title, category      |
| `CMSMedia`        | `useCMSManager(MOCK_MEDIA, EMPTY, ['studentName', 'country'])`   | studentName, country |

Any future change to delete confirmation UX, tag handling, or submit logic only needs to happen in one place: `src/hooks/useCMSManager.js`.

---

### Part B — SYSTEM_FILES: fileService.js Pattern

**Problem:** Both `CMSMedia` and `CMSLibrary` used `URL.createObjectURL(file)` to handle image/document uploads. This creates a temporary blob URL that:

- Exists only in the current browser session
- Cannot be stored in any database
- Is lost on page refresh

The real DB has a `SYSTEM_FILES` table (`id INT PK`, `file STRING` path, `user_id FK`). Files should be uploaded to the server, which stores them and returns a path like `/uploads/abc123.jpg`.

**What we did:**

- Created `src/services/fileService.js` — a stub that matches the final API interface today.
- Both `handleFileUpload` functions in `CMSMedia` and `CMSLibrary` are now `async` and call `uploadFile(file)` from the service.
- Stub returns `{ id: null, file: blob_url }` — same shape as the real API will return.
- When the backend is ready: swap only the body of `uploadFile()` in `fileService.js`. No component changes needed.

```js
// fileService.js stub (dev)
export async function uploadFile(file) {
  await new Promise((r) => setTimeout(r, 200));
  return { id: null, file: URL.createObjectURL(file) };
}

// fileService.js real (when backend is live — only this changes)
export async function uploadFile(file) {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/files", {
    method: "POST",
    body,
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json(); // { id: 42, file: '/uploads/2026/03/abc123.jpg' }
}
```

---

### Part C — DB Alignment: USER + IDENTITY Tables

**This was the main alignment sprint.** Previous score was ~45%. Target: bring USER and IDENTITY to full alignment.

#### USER table — changes made

| Field         | Before               | After                                         | Notes                                                    |
| ------------- | -------------------- | --------------------------------------------- | -------------------------------------------------------- |
| `id`          | `"USR-001"` (string) | UUID `"00000000-0000-0000-0000-000000000001"` | Architectural decision: UUIDs over DB auto-increment     |
| `username`    | missing              | `email.split("@")[0]` fallback                | DB requires username column                              |
| `salt`        | missing              | `null`                                        | Backend concern — acknowledged                           |
| `created_at`  | missing              | ISO timestamp                                 | Seeded in mock, set on `registerUser`                    |
| `updated_at`  | missing              | ISO timestamp                                 | Set on every `updateUser` and `updatePassword` call      |
| `permissions` | missing              | `["all"]` / `["view_own_app", "submit_app"]`  | Seeded per role; ROLE_PERMISSION table when backend live |

**Stable seed UUIDs added to mockUsers.js:**

```js
export const SEED_USER_IDS = {
  ADMIN: "00000000-0000-0000-0000-000000000001",
  STUDENT: "00000000-0000-0000-0000-000000000002",
};
```

#### IDENTITY table — changes made

| Field          | Before       | After                                  | Notes                                                                                   |
| -------------- | ------------ | -------------------------------------- | --------------------------------------------------------------------------------------- |
| `id`           | missing      | UUID per identity row                  | Added to each identity object                                                           |
| `user_id`      | missing      | `userId` from parent                   | FK back to USER                                                                         |
| `dob`          | `date_birth` | `dob`                                  | Renamed in mockUsers.js, userService.js, AdminSettings, StudentSettings, UserManagement |
| `language`     | missing      | `"English"` default                    | DB column                                                                               |
| `id_document`  | missing      | `null`                                 | FK → SYSTEM_FILES — placeholder                                                         |
| camelCase keys | inconsistent | `firstName`, `lastName` kept camelCase | JS convention; service layer translates to `first_name`/`last_name` on real API call    |

**Note on `phone`:** `identity.phone` exists in the frontend but has no column in the DB IDENTITY table. You must add `phone VARCHAR(20)` to the IDENTITY table before running migrations.

#### mockVisaData.js — linked to new UUIDs

All 4 visa records had `userId: "USR-002"` — updated to `"00000000-0000-0000-0000-000000000002"` to stay linked to John Doe after the ID migration.

#### Files changed in this alignment:

| File                                                       | Change                                                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/data/mockUsers.js`                                    | Full rewrite — UUID IDs, SEED_USER_IDS export, all new fields                        |
| `src/services/userService.js`                              | Full rewrite — uuid import, registerUser/loginWithGoogleToken/updateUser all aligned |
| `src/data/mockVisaData.js`                                 | 4 × `userId: "USR-002"` → UUID                                                       |
| `src/pages/admin-dashboard/AdminSettings.jsx`              | `identity?.date_birth` → `identity?.dob`                                             |
| `src/pages/student-dashboard/settings/StudentSettings.jsx` | `identity?.date_birth` → `identity?.dob`                                             |
| `src/pages/admin-dashboard/users/UserManagement.jsx`       | `identity?.date_birth` → `identity?.dob` (2 occurrences)                             |

---

### Part D — Auth: Login with Email or Username + Permissions

#### Email OR username login

`loginUser` was updated to accept an `identifier` parameter that is matched against both `user.email` and `user.username`:

```js
// userService.js
const user = users.find(
  (u) =>
    u.email.toLowerCase() === identifier.toLowerCase() ||
    u.username?.toLowerCase() === identifier.toLowerCase(),
);
```

This mirrors the SQL query the backend will run:

```sql
SELECT * FROM user WHERE email = ? OR username = ?
```

`SignInPage.jsx` — the email input field was renamed to an `identifier` field (`type="text"`, label "Email or Username"). Demo quick-fill buttons also updated.

`AuthContext.jsx` — `login({ email, password })` → `login({ identifier, password })` — the parameter rename makes the intent explicit.

#### hasPermission added to AuthContext

```js
const hasPermission = useCallback(
  (permissionName) => {
    if (!user) return false;
    const perms =
      user.permissions ??
      DEFAULT_ROLE_PERMISSIONS[user.role?.toLowerCase()] ??
      [];
    return perms.includes("all") || perms.includes(permissionName);
  },
  [user, DEFAULT_ROLE_PERMISSIONS],
);
```

- Falls back to `DEFAULT_ROLE_PERMISSIONS` so existing sessions without a `permissions` array still work.
- When the backend is live, `user.permissions` comes from the `ROLE_PERMISSION` table via JWT — same code, no component changes.
- `hasPermission` is exposed on the context and available in every hook/component via `useAuth()`.
- **Existing components are not changed** — `isAdmin` / `isStudent` still handle coarse route-level access. `hasPermission` is opt-in for fine-grained control, and will be used when a `staff` role is introduced.

---

### Updated DB Alignment Score — March 18, 2026

| DB Table               | Before Session 5 | After Session 6 | Key delta                                                                               |
| ---------------------- | ---------------- | --------------- | --------------------------------------------------------------------------------------- |
| USER                   | 70%              | **90%**         | UUID IDs, username, salt, timestamps, permissions                                       |
| IDENTITY               | 65%              | **90%**         | dob, id, user_id, id_document, language — all added                                     |
| ROLE                   | 80%              | **85%**         | staff role added, description is frontend-only extra                                    |
| PERMISSION             | 0%               | **40%**         | `hasPermission()` + `DEFAULT_ROLE_PERMISSIONS` stub                                     |
| ROLE_PERMISSION        | 0%               | **40%**         | default mappings per role seeded in AuthContext                                         |
| SYSTEM_FILES           | 35%              | **55%**         | `fileService.js` with matching `{ id, file }` shape; `id_document` FK noted on identity |
| APPLICATION_TRACKER    | 60%              | 60%             | unchanged                                                                               |
| FEES                   | 40%              | 40%             | string amounts vs float columns — not yet fixed                                         |
| MAJOR                  | 70%              | 70%             | unchanged                                                                               |
| INSTITUTION            | 30%              | 30%             | universityName/location shape mismatch — not yet fixed                                  |
| APPLICATION (finance)  | 25%              | 25%             | unchanged                                                                               |
| APPLICATION_SCHEDULE   | 0%               | 0%              | no frontend equivalent                                                                  |
| MAJOR_APPSCHEDULE      | 0%               | 0%              | no frontend equivalent                                                                  |
| DEPT_MAJOR_APP_TRACKER | 0%               | 0%              | join table — no frontend equivalent                                                     |

**Overall: ~45% → ~55%** (+10 points this session)

The 10-point gain came entirely from the USER/IDENTITY/auth layer which was the biggest realistic blocker for backend integration. The remaining gap is dominated by zero-coverage DB tables (APPLICATION_SCHEDULE, join tables) and type mismatches in the fees/institution areas.

---

### What Remains (Prioritised)

| #   | Task                                                                               | Tables affected             | Effort       |
| --- | ---------------------------------------------------------------------------------- | --------------------------- | ------------ |
| 1   | INSTITUTION: rename `universityName` → `name`, fix `location` shape                | INSTITUTION                 | Medium       |
| 2   | APPLICATION FEES: change string amounts to float in mock data + applicationService | FEES                        | Small        |
| 3   | Visa request IDs: `"VR-001"` → UUID format                                         | VISA_REQUEST (future table) | Small        |
| 4   | Application IDs: `"APP-xxx"` → UUID format                                         | APPLICATION_TRACKER         | Small        |
| 5   | APPLICATION_SCHEDULE: add scheduling concept to frontend                           | APPLICATION_SCHEDULE        | Large        |
| 6   | Use `hasPermission()` in at least one real component (staff role guard)            | ROLE_PERMISSION             | Medium       |
| 7   | Add `phone VARCHAR(20)` to DB IDENTITY table                                       | IDENTITY                    | DB migration |

---

## Session 7 — March 18, 2026

### DB Alignment: INSTITUTION + FEES + ID formats

This session addressed the top three remaining alignment items from the Session 6 "What Remains" table.

---

#### Part A — INSTITUTION: `universityName` → `name` + `representative_id`

**Files changed:** `src/data/mockData.js`, `src/services/programService.js`, and 7 component files.

**Problem:** The DB INSTITUTION table has `name` as its primary identifier column. Every program record in `MOCK_PROGRAMS` used `universityName` — a frontend-invented field name that would silently mismatch when API responses arrive with `name`.

**Changes in `mockData.js`:**

- `universityName` renamed to `name` in all 3 `MOCK_PROGRAMS` records
- `representative_id: null` added to each program (FK → USER table — the staff contact responsible for this institution)

**Changes in `programService.js`:**

- `createProgram` now explicitly sets `representative_id: data.representative_id ?? null` on new records

**Component updates (read `program.name` instead of `program.universityName`):**

| File                                  | What changed                                                           |
| ------------------------------------- | ---------------------------------------------------------------------- |
| `AdminProgramDetail.jsx`              | `formData.name` (all 5 occurrences)                                    |
| `ProgramDetail.jsx`                   | `program.name` (all 4 occurrences)                                     |
| `UniversityCard.jsx`                  | `university.name`                                                      |
| `UniversityPrograms.jsx`              | column accessor + display + filter                                     |
| `UniversityProgramDetailsPreview.jsx` | alt + display                                                          |
| `CMSPollQuestions.jsx`                | option display + inline badge                                          |
| `ApplicationSubmitForm.jsx`           | dropdown display (`p.name`) + DTO population (`selectedProgram?.name`) |

**Note:** `programDetails.universityName` in the application DTO (`applicationService.js`, `MOCK_UNIFIED_APPLICATIONS`) is **kept as-is** — it is a descriptive frontend read-model alias, not the raw DB column name, and renaming it would touch every application display component without backend benefit.

---

#### Part B — FEES: Numeric amounts + currency field

**Files changed:** `src/data/mockData.js`, `src/components/program/ProgramSections.jsx`, `src/pages/shared/AdminProgramDetail.jsx`

**Problem:** `tuitionFees[].amount` was stored as a formatted string (`"300,000 KRW"`) — the DB `amount` column is `FLOAT`. String amounts cannot be sorted, compared, or aggregated on the backend.

**Changes in `mockData.js`:**
All `tuitionFees` rows in all 3 programs updated:

```js
// Before:
{ level: "Bachelor's", item: "Entrance Fee", amount: "300,000 KRW" }

// After:
{ level: "Bachelor's", item: "Entrance Fee", amount: 300000, currency: "KRW" }
```

**Changes in `ProgramSections.jsx` (`ProgramTuitionFees`):**
Amount cell now formats the number:

```jsx
{
  typeof row.amount === "number"
    ? `${row.amount.toLocaleString()} ${row.currency ?? ""}`
    : row.amount;
} // fallback for any legacy string values
```

**Changes in `AdminProgramDetail.jsx`:**

- Default new fee row: `{ level: "Bachelor's", item: "", amount: 0, currency: "KRW" }`
- Amount input changed from `type="text"` → `type="number"`, stores `Number(e.target.value)`
- Added `currency` select dropdown (KRW / USD / EUR / GBP) next to amount field

---

#### Part C — ID Formats: Visa requests + Application tracker IDs → UUID

**Files changed:** `src/data/mockVisaData.js`, `src/services/visaService.js`, `src/services/applicationService.js`

**Problem:** New visa and application records were generated with timestamp-based IDs (`VR-${Date.now()}`, `APP-${Date.now()}`). Seed data used `VR-001` notation. The backend will use UUIDs for all PKs.

**Visa changes:**

Added `SEED_VISA_IDS` export to `mockVisaData.js` (same pattern as `SEED_USER_IDS`):

```js
export const SEED_VISA_IDS = {
  VR001: "20000000-0000-0000-0000-000000000001",
  VR002: "20000000-0000-0000-0000-000000000002",
  VR003: "20000000-0000-0000-0000-000000000003",
  VR004: "20000000-0000-0000-0000-000000000004",
};
```

All 4 `MOCK_VISA_REQUESTS` records updated to use `SEED_VISA_IDS.VR00x`.

`visaService.js` — `createVisaRequest` now generates:

```js
id: uuidv4(),  // was: `VR-${Date.now()}-${Math.random()...}`
```

**Application changes:**

`applicationService.js` — removed `generateId()` helper, replaced with:

```js
import { v4 as uuidv4 } from "uuid";
// createApplication:
trackerId: uuidv4(),  // was: generateId() → `APP-${Date.now()}-${Math.floor(...)}`
```

Seed data `MOCK_UNIFIED_APPLICATIONS` track IDs (`APP-1771461317295-608`, `APP-2024-001`) are left unchanged — they are demo data and will be replaced by real UUIDs when the backend is live.

---

### Updated DB Alignment Score — March 18, 2026 (Session 7)

| DB Table               | Session 6 | Session 7 | Key delta                                 |
| ---------------------- | --------- | --------- | ----------------------------------------- |
| USER                   | 90%       | 90%       | unchanged                                 |
| IDENTITY               | 90%       | 90%       | unchanged                                 |
| ROLE                   | 85%       | 85%       | unchanged                                 |
| PERMISSION             | 40%       | 40%       | unchanged                                 |
| ROLE_PERMISSION        | 40%       | 40%       | unchanged                                 |
| SYSTEM_FILES           | 55%       | 55%       | unchanged                                 |
| APPLICATION_TRACKER    | 60%       | **70%**   | trackerId now UUID                        |
| FEES                   | 40%       | **65%**   | amount → FLOAT, currency field added      |
| MAJOR                  | 70%       | 70%       | unchanged                                 |
| INSTITUTION            | 30%       | **75%**   | `name` aligned, `representative_id` added |
| APPLICATION (finance)  | 25%       | 25%       | unchanged                                 |
| APPLICATION_SCHEDULE   | 0%        | 0%        | no frontend equivalent                    |
| MAJOR_APPSCHEDULE      | 0%        | 0%        | no frontend equivalent                    |
| DEPT_MAJOR_APP_TRACKER | 0%        | 0%        | join table — no frontend equivalent       |

**Overall: ~55% → ~62%** (+7 points this session)

---

### What Remains (Updated)

| #   | Task                                                                    | Tables affected      | Effort       |
| --- | ----------------------------------------------------------------------- | -------------------- | ------------ |
| 1   | APPLICATION_SCHEDULE: add scheduling concept to frontend                | APPLICATION_SCHEDULE | Large        |
| 2   | Use `hasPermission()` in at least one real component (staff role guard) | ROLE_PERMISSION      | Medium       |
| 3   | APPLICATION (finance): wire fee fields to APPLICATION_TRACKER on submit | APPLICATION          | Medium       |
| 4   | Add `phone VARCHAR(20)` to DB IDENTITY table                            | IDENTITY             | DB migration |

---

## Session 8 — March 19, 2026

### Layout Consolidation: `DashboardLayout.jsx`

**New file:** `src/layouts/DashboardLayout.jsx`
**Deleted:** `src/pages/admin-dashboard/AdminLayout.jsx`, `src/pages/student-dashboard/StudentDashboardLayout.jsx`
**Routes already updated** (both import from `../layouts/DashboardLayout`)

The two layout files were structurally identical — same sidebar chrome, same header, same profile dropdown. The only differences were the nav item arrays and the settings path. Merging them into one `DashboardLayout` eliminates the duplication permanently.

**How it works:**

```js
const isAdmin = user?.role === "admin";
const currentNavItems = isAdmin ? adminNavItems : studentNavItems;
const settingsPath = isAdmin ? "/admin/settings" : "/dashboard/profile";
const portalName = isAdmin ? "Admin Portal" : "Student Portal";
```

- One `useAuth()` call, one sidebar, one header, one profile dropdown.
- Sidebar swaps nav arrays at runtime — no conditional rendering of entire components.
- `displayName` priority: `username` → `firstName + lastName` → `"User"` — same safe fallback for both roles.
- `displayEmail` from `user.email` with "No email provided" fallback.
- Both `AdminLayout`'s stray `console.log("AdminLayout Rendered...")` and `StudentDashboardLayout`'s commented-out Bell/MessageSquare/Search imports are gone.

---

### `programService.js` — Relational DTO Mapper

**File:** `src/services/programService.js`

The `createProgram` function was upgraded to produce a `relationalPayload` object that acts as a **blueprint for the backend developer**. When the admin submits a new university program via the form, the frontend data (one large nested JSON) is transformed into the exact shape required by the normalized SQL database.

```js
const relationalPayload = {
  institution: {
    id: institutionId,
    identity_id: data.representative_id || null, // FK → USER
    name: data.name,
    category: "University",
    location: JSON.stringify({ country: data.country, city: data.location }),
    // ...
  },
  departments_and_majors: data.departments.map((dept) => ({
    department: { institution_id: institutionId, category: dept.degree },
    major: {
      name: dept.major,
      language: dept.language,
      requirements: JSON.stringify(data.requiredDocuments),
    },
  })),
  fees: data.tuitionFees.map((fee) => ({
    level: fee.level,
    amount: fee.amount, // ← now FLOAT (aligned in Session 7)
    description: fee.item, // UI "item" → DB "description"
    status: data.status,
  })),
  unmapped_frontend_data: {
    visa_type: data.visaType, // needs column in INSTITUTION or MAJOR
    logo_url: data.logo, // needs logo_id FK → SYSTEM_FILES
    application_link: data.applicationLink,
    schedules: data.timeline, // needs APPLICATION_SCHEDULE date columns
  },
};
```

The mock frontend still saves the flat `data` object to localStorage for immediate UI reads. The `relationalPayload` is logged to the console and attached as `_databaseMap` on the saved record so the backend developer can inspect it in DevTools.

**ERD flaws surfaced by this mapper:**

| Gap                           | Required DB change                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `fees.institution_id` missing | Add `institution_id FK` to FEES table                                                    |
| Institution logo not storable | Add `logo_id FK → SYSTEM_FILES` to INSTITUTION                                           |
| Visa type has no DB column    | Add `visa_type VARCHAR` to INSTITUTION or MAJOR                                          |
| Timeline dates lost           | Add `start_date`, `end_date`, `exam_date`, `result_date` columns to APPLICATION_SCHEDULE |

---

## End-of-Day Architecture Summary — March 18–19, 2026

This two-day sprint took the frontend from a loosely-wired prototype to a backend-ready architecture. Here is a single, consolidated record of every decision made and the reasoning behind it.

---

### 1. The ID Standard — UUIDs Everywhere

**Decision:** All new records use `uuidv4()` from the `uuid` package. Seed data uses stable human-readable UUIDs (e.g., `"00000000-0000-0000-0000-000000000001"` for the admin seed user).

**Why:** String IDs like `"USR-001"` and `"VR-001"` would cause FK constraint failures the moment a real backend assigns real PKs. UUIDs are portable across backend frameworks, safe for distributed inserts, and avoid the N+1 collision problem of auto-increment integers in a distributed context.

**Files changed:** `mockUsers.js` (SEED_USER_IDS), `mockVisaData.js` (SEED_VISA_IDS), `visaService.js`, `applicationService.js`

---

### 2. Content vs. Transactional Data — The Boundary Decision

**Decision:** Transactional data (Users, Applications, Fees, Visa Requests) → SQL database. Marketing content (Blogs, FAQ, Media, Branches) → Headless CMS (Sanity/Strapi/Contentful, TBD).

**Why:** The real ERD has zero tables for any CMS content type. Adding those tables to the SQL database would break normalization and pollute the schema with editorial data that changes on a completely different schedule than business data. The DB schema confirmed this is out of scope.

**Effect on code:** 12 service/hook files (`scholarshipService`, `postService`, `mediaService`, etc.) were deleted in Session 5. CMS admin pages use `useState(MOCK_DATA)` — session-only, no fake persistence. Public pages read static mock data files until a real CMS API is wired.

---

### 3. USER + IDENTITY Tables — Full Schema Alignment

**Before:** Mock users had string IDs, no `username`, no `salt`, no `created_at`/`updated_at`, no `permissions`. The identity object used `date_birth` and was missing `id`, `user_id`, `language`, `id_document`.

**After:** All fields present and aligned with the ERD. `dob` (was `date_birth`) consistent across 6 files. `identity.id`, `identity.user_id`, `identity.language`, `identity.id_document: null` (FK → SYSTEM_FILES) all added.

**Remaining DB gap:** `phone VARCHAR(20)` does not exist in the DB IDENTITY table. Must be added before migration.

---

### 4. Authentication — Email OR Username Login + Permission-Based Access Control

**Login flexibility:** `loginUser(identifier, password)` now matches on `user.email` OR `user.username` — mirrors `SELECT * FROM user WHERE email = ? OR username = ?`.

**PBAC:** `hasPermission(permissionName)` added to `AuthContext`. Falls back to `DEFAULT_ROLE_PERMISSIONS` per role so existing sessions without a `permissions` array still work. When the backend is live, `user.permissions` from the `ROLE_PERMISSION` join table replaces the fallback automatically.

**Existing route guards unchanged:** `isAdmin`/`isStudent` still handle coarse route-level access. `hasPermission` is opt-in for fine-grained control (e.g., a future `staff` role that can view but not delete applications).

---

### 5. SYSTEM_FILES — File Upload Architecture

**Problem being solved:** Both `CMSMedia` and `CMSLibrary` used `URL.createObjectURL(file)` — a blob URL that only exists in the current browser tab, cannot be stored in a database, and is lost on refresh.

**Solution:** `fileService.js` — a stub with the same interface as the real API (`uploadFile(file) → { id, file: path }`). The frontend never calls `createObjectURL` directly again; it always goes through the service. When the backend is live, only the body of `uploadFile()` changes. No component changes needed.

**DB linkage:** `identity.id_document` is now `null` (placeholder) — a FK to the SYSTEM_FILES table. When a real upload happens, the returned `id` is stored there.

---

### 6. AdminSettings — Double Write Bug Fixed

**Bug:** `AdminSettings.jsx` called `userService.updateUser()` directly and then passed the result to `updateProfile()` (AuthContext), which called `userService.updateUser()` again. This caused two writes per save, a ~1.6s delay, and a race condition risk on the session state.

**Fix:** `AdminSettings.handleSaveProfile` calls `updateProfile(profileData)` only. `AuthContext.updateProfile` is the single authority — it writes to the DB and syncs the session in the correct order.

---

### 7. INSTITUTION Table + Program DTO

**Field rename:** `universityName` → `name` across 8 files — aligns with INSTITUTION.name.

**Fields added:** `representative_id: null` (FK → USER) on all program records.

**DTO mapper in `programService.js`:** The `createProgram` function now builds a `relationalPayload` that maps the flat UI form into the normalized INSERT structure required by the backend (INSTITUTION + DEPARTMENT + MAJOR + FEES tables).

**ERD gaps surfaced:** FEES is missing `institution_id` FK; INSTITUTION is missing `logo_id` FK; neither INSTITUTION nor MAJOR has a `visa_type` column; APPLICATION_SCHEDULE has no date columns yet.

---

### 8. Global Toast UI Polish

**File:** `src/App.jsx`

Replaced Sonner's `richColors` preset with a custom `classNames` config using the app's Tailwind palette (emerald for success, red for error/warning, blue for info). Title bumped to `text-base font-semibold`, description to `text-sm`. All 40+ `toast.*()` calls across the app now render consistently without any local changes.

---

### 9. Layout Consolidation

`AdminLayout.jsx` + `StudentDashboardLayout.jsx` → `src/layouts/DashboardLayout.jsx`

One component, two nav arrays, one role check. ~350 lines of duplicated layout code eliminated. Future sidebar, header, or dropdown changes are made in exactly one place.

---

### Final DB Alignment Score — March 19, 2026

| DB Table               | Score   | Status                                                                                                  |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| USER                   | **90%** | UUID, username, timestamps, permissions. Salt is backend concern.                                       |
| IDENTITY               | **90%** | dob, id, user_id, id_document FK, language all added. `phone` column still missing from DB schema.      |
| ROLE                   | **85%** | staff role prepared; description is frontend-extra.                                                     |
| PERMISSION             | **40%** | DEFAULT_ROLE_PERMISSIONS stub; real rows come from backend.                                             |
| ROLE_PERMISSION        | **40%** | Fallback mapping seeded; will be replaced by JWT claims.                                                |
| SYSTEM_FILES           | **55%** | fileService.js stub matches `{ id, file }` shape; id_document FK noted.                                 |
| INSTITUTION            | **75%** | `name` aligned, `representative_id` added, DTO mapper built. logo_id + visa_type still missing from DB. |
| FEES                   | **65%** | Amount is now FLOAT with currency field. institution_id FK still missing from DB.                       |
| APPLICATION_TRACKER    | **70%** | trackerId is UUID. applicant DTO is joined view (correct).                                              |
| MAJOR                  | **70%** | department_major_ids pattern correct; join table write is backend concern.                              |
| APPLICATION (finance)  | **25%** | No fee record created on application submit yet.                                                        |
| APPLICATION_SCHEDULE   | **0%**  | No frontend equivalent yet.                                                                             |
| MAJOR_APPSCHEDULE      | **0%**  | Join table — no frontend equivalent yet.                                                                |
| DEPT_MAJOR_APP_TRACKER | **0%**  | Join table — no frontend equivalent yet.                                                                |

**Overall: ~62%** — The entire user/auth/identity layer, all UUID IDs, the program/institution shape, and all fee amounts are now backend-ready. The remaining gap is dominated by join tables and the financial application flow, both of which require backend work before the frontend can wire them.

---

### Next Priority Tasks

| #   | Task                                                                                                                     | Effort       | Status              |
| --- | ------------------------------------------------------------------------------------------------------------------------ | ------------ | ------------------- |
| 1   | Add `institution_id` FK to DB FEES table                                                                                 | DB migration | ⏳ Pending          |
| 2   | Add `logo_id` FK + `visa_type` column to DB INSTITUTION                                                                  | DB migration | ⏳ Pending          |
| 3   | Add date columns to APPLICATION_SCHEDULE                                                                                 | DB migration | ⏳ Pending          |
| 4   | Add `phone VARCHAR(20)` to IDENTITY table                                                                                | DB migration | ⏳ Pending          |
| 5   | Wire APPLICATION fee record creation on `createApplication`                                                              | Medium       | ✅ Done (Session 8) |
| 6   | Use `hasPermission()` in at least one live UI component                                                                  | Medium       | ✅ Done (Session 8) |
| 7   | Connect real auth API (`userService.loginUser` → `authAPI.login`)                                                        | Large        | ⏳ Pending          |
| 8   | **Translation audit** — scan all pages for hardcoded strings not in translation files                                    | Medium       | ⏳ Tomorrow         |
| 9   | Add missing translation keys for new home sections (StatsBar, GalleryTeaser, Testimonials cards)                         | Small        | ⏳ Tomorrow         |
| 10  | Fix untranslated strings in `sw/translation.json` (`resources.scholarships`, `services.items.scholarships/study_abroad`) | Small        | ⏳ Tomorrow         |
| 11  | APPLICATION_SCHEDULE: add scheduling UI to program form (start/exam/result dates)                                        | Large        | ⏳ Pending          |
| 12  | Expose fee fields in `ApplicationSubmitForm.jsx` so students populate the fee block                                      | Small        | ⏳ Pending          |

---

## Session 9 — March 26, 2026

### Firebase Auth Bug: UUID Mismatch Breaking Sign-In

**Branch:** `frontendPhaseI`
**File changed:** `src/services/userService.js`

---

### Problem

After the Firebase migration, newly registered users could not sign back in. The app would either throw `"User profile not found"` or silently treat the user as unauthenticated after `onAuthStateChanged` fired — even though Firebase Auth held a valid session.

---

### Root Cause

Three bugs, all in `src/services/userService.js`:

#### Bug 1 — `identity.id` was a random UUID with no connection to the Firebase UID

In `registerUser` and `loginWithGoogleToken`, the profile was built like this:

```js
// BROKEN
const uid = userCredential.user.uid; // e.g. "XyZ8abc..."

const profile = {
  // uid was NOT stored as a field in the document body
  identity: {
    id: uuidv4(), // "550e8400-..." — random, unrelated to uid above
  },
};

await setDoc(doc(db, "users", uid), profile);
```

The Firebase UID existed only as the Firestore document path (`/users/{uid}`). The `identity.id` field held a random throw-away UUID with no link to the Firebase UID. The document body had no `uid` field at all.

**What Firestore actually stored:**

```
/users/XyZ8abc...          ← UID only in the document path
{
  identity: {
    id: "550e8400-..."      ← unrelated random UUID
  }
  // NO "uid" field in the document body
}
```

#### Bug 2 — Firestore security rules were silently denied

Firestore security rules that check `resource.data.uid == request.auth.uid` failed because `uid` was not a document field. This caused `getDoc` reads to be denied, making `snapshot.exists()` behave unexpectedly. `AuthContext` then called `setUser(null)`, leaving the user logged out despite a valid Firebase Auth session.

#### Bug 3 — Admin `createUser` had the same mismatch and used `addDoc`

The admin `createUser` function also used `uuidv4()` for `identity.id` and used `addDoc` (Firestore auto-ID). This meant the document ID, `uid` field, and `identity.id` were all three different values — no consistency.

---

### Solution

Ensured the Firebase UID (or one pre-generated UUID for admin-created users) is used consistently as the document ID, the `uid` field, and `identity.id` across all three functions.

#### `registerUser` (email/password signup)

```js
// FIXED
const uid = userCredential.user.uid;

const profile = {
  uid: uid,          // now stored as a searchable field
  ...
  identity: {
    id: uid,         // matches the document ID — no random UUID divergence
    ...
  },
};

await setDoc(doc(db, "users", uid), profile);
```

#### `loginWithGoogleToken` (Google OAuth — first-time signup)

Same two changes: `uid: uid` as a top-level field and `identity.id: uid`.

#### `createUser` (admin function — no Firebase Auth account)

One UUID generated once, used for document ID, `uid` field, and `identity.id`. Switched from `addDoc` to `setDoc` for consistency:

```js
// FIXED
const newId = uuidv4();  // generated once

const newUser = {
  uid: newId,
  ...
  identity: {
    id: newId,           // document ID, uid, identity.id all the same
  },
};

await setDoc(doc(db, "users", newId), newUser);
```

---

### Resulting Document Structure (all signup paths)

```
/users/{uid}
{
  uid: "XyZ8abc..."        ← document path, uid field, and identity.id all consistent
  identity: {
    id: "XyZ8abc..."
    ...
  }
}
```

---

### Migration Note

Existing users registered before this fix still have the old mismatched `identity.id` in Firestore. New signups are unaffected. Old accounts will need a one-time Firestore migration script to backfill the `uid` field and correct `identity.id` to match the Firebase UID.

---

## Session 10 — March 26, 2026

### Google OAuth Bug: Hybrid Token Exchange Breaking Google Sign-Up/Sign-In

**Branch:** `frontendPhaseI`
**Files changed:** `src/services/userService.js`, `src/context/AuthContext.jsx`, `src/pages/auth/SignInPage.jsx`, `src/pages/auth/SignUpPage.jsx`, `src/main.jsx`

---

### Problem

Google sign-up and sign-in silently failed. Email/password auth worked fine. Clicking the Google button would either throw an error or show a generic toast — `"Google Sign-Up failed. Please try again."` — with no useful detail.

---

### Root Cause

The app used two separate OAuth systems simultaneously:

1. `@react-oauth/google` — handled the Google popup and returned a raw Google ID token (JWT)
2. Firebase Auth — expected to receive and verify that token via `signInWithCredential`

The flow looked like this:

```
User clicks Google button
  → @react-oauth/google handles the popup
  → Returns credentialResponse.credential (Google ID token)
  → Code manually constructs a Firebase credential:
       GoogleAuthProvider.credential(idToken)   ← only ID token, no access token
       signInWithCredential(auth, googleCredential)
```

For this hybrid approach to work, **all three** of the following had to be true simultaneously:

1. Firebase Auth had Google provider enabled in the Firebase console
2. `VITE_GOOGLE_CLIENT_ID` in `.env` was the exact same OAuth 2.0 client ID registered in the Firebase Auth Google provider settings
3. The app's domain was in Firebase's authorized domains list

Any mismatch between the Google client ID used by `@react-oauth/google` and the one Firebase expected would cause silent rejection. The real Firebase error was swallowed in the catch block:

```js
// SignInPage.jsx / SignUpPage.jsx — before fix
} catch (err) {
  toast.error("Google Sign-Up failed. Please try again.");
  // err.code and err.message never surfaced — impossible to debug
}
```

---

### Solution

Removed `@react-oauth/google` entirely and replaced the hybrid flow with Firebase's native `signInWithPopup`. Firebase now owns the full Google OAuth flow — no manual token exchange, no `VITE_GOOGLE_CLIENT_ID` needed, no synchronization between two OAuth systems.

**`userService.js`** — renamed `loginWithGoogleToken(credential)` → `loginWithGoogle()`, swapped `signInWithCredential` for `signInWithPopup`:

```js
// BEFORE
export const loginWithGoogleToken = async (credential) => {
  const googleCredential = GoogleAuthProvider.credential(credential);
  const userCredential = await signInWithCredential(auth, googleCredential);
  ...
};

// AFTER
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  ...
};
```

**`AuthContext.jsx`** — updated `loginWithGoogle` to take no arguments and call the renamed service function.

**`SignInPage.jsx` / `SignUpPage.jsx`** — removed `<GoogleLogin>` component from `@react-oauth/google`, replaced with a plain button that calls `loginWithGoogle()` directly. Also surfaced the real error message in the catch block instead of hiding it.

**`main.jsx`** — removed `GoogleOAuthProvider` wrapper and the unused `clientId` variable.

---

### Files Before vs After

| File              | Before                                                                     | After                                                        |
| ----------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `userService.js`  | `signInWithCredential` + manual `GoogleAuthProvider.credential(idToken)`   | `signInWithPopup` with a fresh `GoogleAuthProvider` instance |
| `AuthContext.jsx` | `loginWithGoogle(credential)` — took a token arg                           | `loginWithGoogle()` — no args                                |
| `SignInPage.jsx`  | `<GoogleLogin onSuccess={...} onError={...} />` from `@react-oauth/google` | Plain `<button>` calling `loginWithGoogle()`                 |
| `SignUpPage.jsx`  | Same as SignInPage                                                         | Same fix                                                     |
| `main.jsx`        | Wrapped app in `<GoogleOAuthProvider clientId={...}>`                      | Wrapper removed entirely                                     |

---

### Prerequisite

Google Sign-In must be enabled in **Firebase Console → Authentication → Sign-in method → Google**. No additional environment variables are needed.

---

## Session 11 — March 26, 2026

### Username Login + Uniqueness Enforcement + Migration

**Branch:** `frontendPhaseI`
**Files changed:** `src/services/userService.js`
**Files created (then deleted):** `src/utils/migrateUsernames.js`, `src/pages/admin/MigrationPage.jsx`

---

### Problem 1 — Username Login Not Working

The sign-in form accepted "Email or Username" but `loginUser` passed the identifier directly to Firebase's `signInWithEmailAndPassword`, which only accepts a valid email. Entering a username threw `auth/invalid-email` and login silently failed.

**Fix — two-step lookup in `loginUser`:**

```js
// If identifier has no "@" it's a username — look up the email in Firestore first
const isEmail = identifier.includes("@");
if (!isEmail) {
  const q = query(collection(db, "users"), where("username", "==", identifier));
  const result = await getDocs(q);
  if (result.empty) throw new Error("No account found with that username.");
  email = result.docs[0].data().email;
}
// Then proceed with signInWithEmailAndPassword using the resolved email
```

---

### Problem 2 — Username Uniqueness Not Enforced

Nothing prevented two users from registering with the same username. A simple `getDocs` query check was added first, but it had a theoretical race condition — two simultaneous signups could both pass the check before either wrote.

**Fix — Firestore transaction + dedicated `/usernames` collection:**

Instead of a query check, a `runTransaction` atomically claims the username and writes the user profile in one operation. If two users race for the same username, Firestore retries the second transaction which then sees the claimed document and throws.

```js
await runTransaction(db, async (transaction) => {
  const usernameRef = doc(db, "usernames", desiredUsername);
  const usernameSnap = await transaction.get(usernameRef);

  if (usernameSnap.exists()) {
    throw new Error(`Username "${desiredUsername}" is already taken.`);
  }

  transaction.set(usernameRef, { uid }); // claim the username
  transaction.set(doc(db, "users", uid), profile); // write the user profile
});
```

If the transaction fails after the Firebase Auth account was already created, the Auth account is deleted immediately to prevent orphaned accounts:

```js
} catch (err) {
  await userCredential.user.delete();
  throw err;
}
```

The same transaction pattern was applied to the admin `createUser` function.

**New Firestore collection created:** `/usernames/{username}` → `{ uid: "..." }`

---

### Migration — Backfilling Existing Users

6 existing users had no `/usernames` document. A temporary migration page was built at `/admin/migrate-usernames`, run once, and then deleted along with its utility script and route.

**Users migrated:**

- Kurube
- Krube
- niyomukizaesperance7
- niyoespe
- princecuthbert
- ishimweprincecuthbert

All 6 now have a `/usernames` document in Firestore. New signups are covered by the transaction going forward.

---

### Notice:

**Regarding the authentication with google using firebase for deployed version(https://sensational-otter-aef2c9.netlify.app/)**: Currently it can't works because that same domain isn't registered inside the firebase google auth system.
Fix is — add your Netlify domain to Firebase Console → Authentication → Settings → Authorized domains.

## Next Session — March 27, 2026

### Application Submission Migration: localStorage → Firebase

**Context:** The entire application submission system is currently stored in the browser's localStorage under the key `"edubridge_applications"`. This means data is device-specific, browser-specific, and lost on cache clear. File uploads are stored as Base64 strings in localStorage, which quickly hits the ~5–10MB browser limit.

**Known problems with current state:**

| Problem                         | Effect                                                        |
| ------------------------------- | ------------------------------------------------------------- |
| Student submits on Chrome       | Admin opens Firefox → sees nothing                            |
| Browser data cleared            | All applications gone permanently                             |
| Student uses a different device | Their own submissions are invisible                           |
| File uploads                    | Stored as Base64 — a 5MB file becomes ~7MB of text in storage |
| localStorage size limit         | ~5–10MB total, easily hit with a few file uploads             |

**Plan:**

1. **Part 1 — Application data → Firestore**
   - Rewrite `src/services/applicationService.js` to use Firestore `applications` collection
   - `src/hooks/useApplications.js` stays the same — only the service layer changes

2. **Part 2 — File uploads → Firebase Storage**
   - Replace Base64-in-localStorage with Firebase Storage upload + download URLs
   - Update `ApplicationSubmitForm.jsx` upload handler

**Files to change:**

- `src/services/applicationService.js` — full rewrite
- `src/pages/student-dashboard/applications/ApplicationSubmitForm.jsx` — file upload handler
- `src/data/mockData.js` — seed data no longer needed once Firestore is live
