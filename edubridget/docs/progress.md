# EduBridge — Firebase Integration Progress Report

> Last updated: 2026-04-01 (Session 18) | Branch: `frontendPhaseI`

---

## What Was Done — Friday, 27 March 2026 (Commit `f9fdbb7`)

### 1. `applicationService.js` — Full Firestore Migration

**Before:** All application data lived in `localStorage` with simulated delays and mock seed data.
**After:** Every function now reads/writes Firestore directly.

| Function                    | Before                              | After                                                 |
| --------------------------- | ----------------------------------- | ----------------------------------------------------- |
| `getApplications()`         | `localStorage.getItem(STORAGE_KEY)` | `getDocs(collection(db, "applications"))`             |
| `getApplicationsByUserId()` | `.filter()` on localStorage array   | Firestore `query(..., where("userId", "==", userId))` |
| `getApplicationById()`      | `.find()` on localStorage array     | `getDoc(doc(db, "applications", id))`                 |
| `createApplication()`       | push to localStorage array          | `setDoc(doc(db, "applications", trackerId), newApp)`  |
| `updateApplication()`       | splice localStorage array           | `updateDoc(ref, safeData)`                            |
| `updateApplicationStatus()` | mutate localStorage item            | `updateDoc(ref, { status })`                          |
| `updateTrackerStages()`     | mutate localStorage item            | `updateDoc(ref, { trackerStages: stages })`           |
| `deleteApplication()`       | `.filter()` + save to localStorage  | `deleteDoc(doc(db, "applications", id))`              |

**Critical fix:** `createApplication()` now pulls `uid` directly from `auth.currentUser` instead of relying on a passed-in `userId`. This eliminated a UUID mismatch bug where students' applications were created under a wrong ID.

**Security preserved:** `updateApplication()` still strips `status` and `trackerStages` from the payload — students cannot elevate their own application status by crafting the request data.

---

### 2. `useApplications.js` — Rewritten with React Query

**Before:** Custom `useState` + `useEffect` hook with manual loading/error flags.
**After:** Full React Query integration with 3 query modes and 5 mutations.

- **Query Mode 1** — single application by `trackerId` (used by `ApplicationPreview`, `AdminApplicationReview`)
- **Query Mode 2** — student's own applications by `userId` (used by `MyApplications`)
- **Query Mode 3** — all applications (used by admin dashboard)
- **5 Mutations:** create, update, updateStatus, updateTrackerStages, delete
- **Shared cache key `['applications']`** — any mutation invalidates all three query modes, keeping every view in sync without manual `refetch()` calls.

---

### 3. `AuthContext.jsx` — Hardened Auth Flows

| Change                                        | What it does                                                                                                                                                                                                                                        |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inactive account check on session restore** | When `onAuthStateChanged` fires (e.g. page refresh), if the user's Firestore profile has `status: "Inactive"`, the session is killed immediately via `firebaseSignOut(auth)`. A deactivated user cannot stay logged in by just not closing the tab. |
| `signOut` → `firebaseSignOut`                 | Renamed import to avoid shadowing the exported `logout` function — prevents subtle bugs if both are used in scope.                                                                                                                                  |
| `useMemo` dependency arrays cleaned up        | `updateProfile`, `hasPermission`, and the context value object now have correct, explicit dependency arrays. Avoids stale closures.                                                                                                                 |

---

### 4. Latest Commit `4adf405` — React Query for Admin Dashboard

- **`UserManagement.jsx`** — now reads users via React Query (`useUsers` hook → `userService.getUsers` → Firestore)
- **`AdminOverview.jsx`** — stats pulled via React Query from `useDashboard` hook
- **`AdminTable.jsx`, `AdminFilterBar.jsx`, `AdminStatsGrid.jsx`** — UI components updated to consume React Query state (loading skeletons, error states)
- **`useDashboard.js`** — replaced `useState/useEffect` with `useQueries` (parallel fetching of users, applications, visa cases)
- **`main.jsx`** — `QueryClientProvider` wrapping the app

---

## What Was Done — Monday, 30 March 2026 (Session 14)

### 1. Tuition Fees — new matrix data model designed & implemented

Replaced the old flat fee structure `{ level, item, amount, currency }` with a grouped matrix model that supports multiple degree tracks as side-by-side columns.

**New shape stored in Firestore / form state:**

```js
tuitionFees: [
  {
    groupName: "Master's Programs",
    currency: "KRW",
    columns: ["M.Div", "M.A"],
    rows: [
      { item: "Application Fee", amounts: [100000, 100000] },
      { item: "Tuition Fee", amounts: [2750000, 2750000] },
      { item: "Scholarship (Deduction)", amounts: [900000, 825000] },
    ],
  },
];
```

**`useProgramForm` in `usePrograms.js`** — new helpers added:

- `addFeeGroup` / `removeFeeGroup` — add/remove an entire fee table
- `updateFeeGroup(gIdx, field, value)` — update group name or currency
- `addFeeColumn(gIdx)` / `removeFeeColumn(gIdx, cIdx)` / `updateFeeColumn(gIdx, cIdx, value)` — manage columns; adding a column appends a `0` to every existing row's `amounts` array to keep the matrix in sync
- `addFeeRow(gIdx)` / `removeFeeRow(gIdx, rIdx)` — manage rows; new row auto-fills `amounts` with `new Array(columns.length).fill(0)`
- `updateFeeRowItem(gIdx, rIdx, value)` — update fee item label (immutable, no direct mutation)
- `updateFeeCell(gIdx, rIdx, cIdx, value)` — update a single cell amount

### 2. `AdminProgramDetail.jsx` — tuition fees moved to full width

Tuition fees was cramped inside the `lg:col-span-2` left column. Moved it outside the `grid` to span the full page width, giving the matrix table room for many columns.

**Layout before → after:**

```
Before                           After
┌──────────────┬────────┐        ┌──────────────┬────────┐
│ Basic Info   │ Logo   │        │ Basic Info   │ Logo   │
│ Timeline     │ App    │        │ Timeline     │ App    │
│ Departments  │ Form   │        │ Departments  │ Form   │
│ Req Docs     │        │        │ Req Docs     │        │
│ Tuition Fees │        │        └──────────────┴────────┘
└──────────────┴────────┘        ┌───────────────────────┐
                                 │ Tuition Fees (full)   │
                                 └───────────────────────┘
```

**Also fixed:**

- Direct mutation bug: `newRows[rIdx].item = e.target.value` → `updateFeeRowItem(gIdx, rIdx, e.target.value)`
- `updateFeeCell` now coerces to `Number()` before storing — prevents string amounts
- `updateFeeRowItem` added to destructure imports
- Empty state shown when no fee groups exist yet

### 3. `ProgramSections.jsx` — currency display bug fixed

`typeof amt === "number"` failed silently when amounts were stored as strings (e.g. `"100000"` from an old form save). The currency was not appended in that case.

**Fix:** `isNaN(Number(amt)) ? amt : \`${Number(amt).toLocaleString()} ${group.currency}\``
Now handles both number and string amounts correctly.

---

## What Was Done — Monday, 30 March 2026 (Session 15)

### 1. `programService.js` — Full Firestore Migration

Replaced the entire localStorage implementation with Firestore. IDs migrated from `Math.random()` integers to `uuidv4()` strings (same pattern as `applicationService.js`).

| Function                  | Before                                 | After                                                          |
| ------------------------- | -------------------------------------- | -------------------------------------------------------------- |
| `getPrograms()`           | `localStorage.getItem(STORAGE_KEY)`    | `getDocs(collection(db, "programs"))`                          |
| `getProgramById(id)`      | `.find()` on parsed array              | `getDoc(doc(db, "programs", String(id)))`                      |
| `createProgram(data)`     | `Math.random()` int ID + push to array | `uuidv4()` string ID + `setDoc(doc(db, "programs", id), data)` |
| `updateProgram(id, data)` | splice + save to localStorage          | `updateDoc` + re-fetch + stamps `updatedAt`                    |
| `deleteProgram(id)`       | filter array + save to localStorage    | `deleteDoc(doc(db, "programs", String(id)))`                   |

**Removed:** `MOCK_PROGRAMS` import, `STORAGE_KEY`, `_read()`, `_save()`, `delay()` — all gone.

**Kept:** The DTO mapper `console.log` inside `createProgram` — logs the relational payload shape for future SQL backend alignment. Useful for the backend developer.

### 2. `usePrograms()` + `useProgram()` — Migrated to React Query

Replaced `useState/useEffect/useCallback` with `useQuery` + `useMutation`.

**`usePrograms()`:**

- `useQuery(['programs'], getPrograms)` — fetches list, cached automatically
- `addMutation` → `createProgram` + `invalidate(['programs'])` on success
- `updateMutation` → `updateProgram(id, data)` + invalidate
- `deleteMutation` → `deleteProgram(id)` + invalidate
- `saving` flag exposed — `true` while add or update mutation is pending

**`useProgram(id)`:**

- `useQuery(['programs', id], () => getProgramById(id), { enabled: !!id })` — returns from cache instantly if the list was already loaded

**`useProgramForm`** — untouched. Pure local form state, no Firestore involvement.

### 3. Consumer files fixed

| File                     | Fix                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `AdminProgramDetail.jsx` | `Number(id)` → `String(id)`, `usePrograms(false)` → `usePrograms()`, `loading` → `saving` |
| `ProgramDetail.jsx`      | `Number(id)` → `id` (string) passed to `useProgram`                                       |
| `UniversityPrograms.jsx` | Dead `MOCK_PROGRAMS` import removed                                                       |

---

## What Was Done — Tuesday, 31 March 2026 (Session 16)

### 1. Firebase Storage — initialized

Added `getStorage(app)` to `config.js`, exported `storage`. Storage was configured in env vars but the SDK was never called.

### 2. Program application file — fixed (Firestore can't store File objects)

`AdminProgramDetail.jsx` `handleSubmit` was passing a raw JS `File` object to `updateDoc` → Firestore threw `Unsupported field value: a custom File object`. Fixed: file is now uploaded to Storage at `programs/application-forms/{timestamp}_{name}` first, download URL stored in Firestore. `instanceof File` guard ensures existing URL strings are not re-uploaded on edit.

### 3. Application document uploads — migrated to Firebase Storage

`ApplicationSubmitForm.jsx` was Base64-encoding files and embedding them in the Firestore document. Two Word docs (~806 KB) became ~1.07 MB after encoding, exceeding Firestore's 1 MB document limit.

Fixed: each file is uploaded to `applications/{userId}/{timestamp}_{name}` in Storage; only the URL is stored in Firestore. `MAX_FILE_SIZE` limit and `ACCEPTED_TYPES` restriction both removed — any file type and size accepted.

### 4. Submission date locked to server time

Removed `submissionDate` from form state and UI input. Date is now stamped inside `handleSubmit` at the moment of submit/update — users can no longer backdate applications. Displayed as read-only formatted text in the form.

### 5. Application edit pre-fill — university & department now restored

`programId` was never saved by `createApplication` (explicitly-built `newApp` object silently dropped it). Fixed by adding `programId: data.programId || ""` to `newApp`. Edit-mode field mapping simplified to read from the correct Firestore structure (`app.programId`, `app.programDetails.majorName`, `app.applicant.*`).

### 6. Department dropdown — fixed for Firestore programs

Removed `getProgramMajors` mock join table (integer IDs, never matched UUID programs). `availableDepartments` now reads `selectedUniversityProgram?.departments ?? []` from Firestore. Label uses `dept.major` (Firestore shape) not `dept.name` (old mock shape).

### 7. `ProgramDetail.jsx` — polish

- Q&A tab removed
- Logo fallback: 2-letter initials shown if no logo URL or image fails to load
- Download Form button opens in new tab (was navigating current tab)

### 8. Document preview & download — full overhaul

Both `ApplicationPreview.jsx` (student) and `AdminApplicationReview.jsx` (admin):

| Icon            | Behaviour                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Eye (green)     | PDF/image → new tab. `.docx/.doc` → mammoth.js renders HTML in modal. Other → download + toast |
| Download (blue) | `fetch` → `blob` → `<a download>` — true local save, no navigation                             |

**mammoth.js** (`npm install mammoth`) converts `.docx` to HTML client-side — no external server or CORS dependency for preview. Microsoft Office Online viewer approach abandoned (Firebase Storage URLs blocked by CORS from external servers).

**Requires one-time CORS setup** on Firebase Storage bucket for fetch-based downloads to work:

```bash
echo '[{"origin":["*"],"method":["GET"],"maxAgeSeconds":3600}]' > cors.json
gsutil cors set cors.json gs://edubridge-5da54.appspot.com
```

---

## What Was Done — Tuesday, 1 April 2026 (Session 18)

### 1. `cmsService.js` — Generic Firestore CRUD Factory (NEW FILE)

Created `src/services/cmsService.js` — a factory function `createCmsService(collectionName)` that generates typed Firestore CRUD operations for any collection.

```js
export const createCmsService = (collectionName) => ({
  getAll:  async () => { ... },   // getDocs → maps to { id, ...data }
  create:  async (data) => { ... }, // addDoc + serverTimestamp on created_at/updated_at
  update:  async (id, data) => { ... }, // updateDoc + serverTimestamp on updated_at
  delete:  async (id) => { ... },   // deleteDoc
});
```

**Debug logging:** every write prints `[cmsService] CREATE/UPDATE/DELETE → collectionName/id` with the full payload to the browser console — useful for verifying the data shape before it lands in Firestore. `serverTimestamp()` appears as `___PRIVATE_ServerTimestampFieldValueImpl` in the log (normal — Firestore replaces it server-side).

**Three named instances exported:**

| Instance | Firestore Collection |
|---|---|
| `scholarshipService` | `scholarships` |
| `blogService` | `blogs` |
| `mediaService` | `media` |

---

### 2. `useCMSManager.js` — Refactored with TanStack Query

Signature changed from `useCMSManager(initialData, defaultFormData, searchKeys)` to `useCMSManager(service, collectionKey, defaultFormData, searchKeys)`.

| Concern | Before | After |
|---|---|---|
| Data source | `useState(initialData)` — in-memory, resets on refresh | `useQuery` → Firestore via service |
| Mutations | Directly mutated local state array | `useMutation` × 3 (create/update/delete) |
| Cache sync | Manual `setItems(...)` | `queryClient.invalidateQueries([collectionKey])` |
| Loading state | Always `false`, hardcoded | `isLoading` from `useQuery` |
| Save state | None | `isPending` = any mutation in flight |

**Returned additions:** `isLoading`, `isPending` — pages use these to show loading spinners and disable the submit button during saves.

**`handleDelete`** preserves the existing UX: sonner toast with an action button — the delete only fires if the admin confirms.

---

### 3. CMS Pages — Wired to Firestore (3 files)

Each page had a 2-line data-source change — all JSX untouched.

| File | Old | New |
|---|---|---|
| `CMSScholarships.jsx` | `useCMSManager(MOCK_SCHOLARSHIPS, ...)` | `useCMSManager(scholarshipService, 'scholarships', ...)` |
| `CMSPosts.jsx` | `useCMSManager(MOCK_BLOGS, ...)` | `useCMSManager(blogService, 'blogs', ...)` |
| `CMSMedia.jsx` | `useCMSManager(MOCK_MEDIA, ...)` | `useCMSManager(mediaService, 'media', ...)` |

All three pages also gained:
- `isLoading` passed to `AdminTable` (or a `Loader2` spinner for the card grid in CMSMedia)
- `isPending` disables the submit button with a "Saving…" label during writes

---

### 4. `ScholarshipsPage.jsx` — Public Page Connected to Firestore

The public `/scholarships` page was reading from `MOCK_SCHOLARSHIPS`. Now reads from the same `scholarships` Firestore collection as the admin CMS.

```diff
- import { MOCK_SCHOLARSHIPS } from "@/data/mockData";
+ import { useQuery } from "@tanstack/react-query";
+ import { scholarshipService } from "@/services/cmsService";

- const scholarships = MOCK_SCHOLARSHIPS;
+ const { data: allScholarships = [], isLoading } = useQuery({
+   queryKey: ['scholarships'],
+   queryFn: scholarshipService.getAll,
+   staleTime: 0, // always fresh — public-facing content
+ });
```

**Pagination added:** client-side, 6 per page. Numbered page buttons + prev/next arrows. `goToPage()` scrolls to top on navigation. Pagination only renders when `totalPages > 1`.

**Cache sync note:** `staleTime: 0` is intentionally set on the public page only. The admin CMS uses the global 5-minute staleTime (prevents unnecessary reads). When the admin mutates, `invalidateQueries(['scholarships'])` marks the cache stale — the public page refetches on next visit.

---

### 5. `GalleryPage.jsx` + `GalleryTeaser.jsx` — Media Connected to Firestore

Both the full Gallery page (`/gallery`) and the home-page teaser section now read from the `media` Firestore collection managed by the admin CMS at `/admin/cms/media`.

| File | Items shown | Loading state |
|---|---|---|
| `GalleryPage.jsx` | All items (masonry grid + lightbox) | Animated pulse skeleton (6 alternating-height blocks) |
| `GalleryTeaser.jsx` | First 6 items (`allMedia.slice(0, 6)`) | Animated pulse skeleton (6 blocks) |

Both share the same React Query key `['media']` → the fetch is deduplicated if both components are rendered in the same session.

`GalleryPage.jsx` also has an **empty state** (icon + copy + hint to use the admin CMS) for when the collection has no documents yet.

Field mapping from CMS → gallery display:

| Firestore field | Used by |
|---|---|
| `image` | Card photo, lightbox photo |
| `studentName` | Overlay title, lightbox heading |
| `country` | Flag/location tag |
| `university` | Lightbox subheading |
| `program` | Hover overlay + lightbox badge |
| `testimony` | Lightbox quote block |

---

## What Was Done — Tuesday, 31 March 2026 (Session 17)

### 1. `visaService.js` — Full Firestore + Firebase Storage Migration

**Before:** All visa data lived in `localStorage`. Documents were local file references. Data reset on every new browser session or incognito window.
**After:** Every operation reads/writes Firestore. Files upload to Firebase Storage. Data persists across devices and sessions.

| Function                          | Before                                   | After                                                              |
| --------------------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| `getVisaRequests()`               | `readAll()` from localStorage            | `getDocs(collection(db, "visaCases"))`                             |
| `getVisaRequestsByUserId()`       | `.filter()` on localStorage array        | Firestore `query(..., where("userId", "==", userId))`              |
| `getVisaRequestById()`            | `.find()` on localStorage array          | `getDoc(doc(db, "visaCases", id))`                                 |
| `createVisaRequest()`             | push to localStorage, `uuidv4()` ID      | `setDoc(newRef, newCase)` — auto-generated Firestore document ID   |
| `updateVisaRequest()`             | splice + save to localStorage            | `updateDoc(ref, safeData)` — admin fields stripped                 |
| `updateVisaStatus()`              | mutate in localStorage array             | `updateDoc(ref, { status })`                                       |
| `updateVisaFee()`                 | mutate in localStorage array             | `updateDoc(ref, { consultationFee, feeStatus })`                   |
| `updateVisaSchedule()`            | mutate in localStorage array             | `updateDoc(ref, schedule)`                                         |
| `uploadVisaDocument()`            | N/A (no file persistence)                | `uploadBytes()` to `visaCases/{userId}/{timestamp}_{filename}`     |
| `addDocumentsToVisaRequest()`     | N/A                                      | `arrayUnion(...newDocs)` appended to Firestore `documents` array   |
| `deleteDocumentFromVisaRequest()` | N/A                                      | `arrayRemove` on `documents` array + refetch                       |
| `deleteVisaRequest()`             | `.filter()` + save to localStorage       | `deleteDoc(doc(db, "visaCases", id))`                              |

**Removed:** `STORAGE_KEY`, `readAll()`, `writeAll()`, `MOCK_VISA_REQUESTS` import, `uuidv4` dependency — all gone.

**Added:** `snapToData()` helper — maps every Firestore `DocumentSnapshot` to `{ id, ...data }`. Mirrors the same pattern already in `applicationService.js`.

**Security preserved:** `updateVisaRequest()` still explicitly strips admin-only fields (`consultationFee`, `feeStatus`, `meetingDate`, `meetingTime`, `meetingType`, `meetingLink`, `adminNotes`) — a student crafting the request body cannot change those fields.

---

### 2. `useVisaConsultations.js` — Rewritten with React Query

Student-facing hook. Replaced `useState/useEffect` with `useQuery` + `useMutation`.

- **Query key:** `["visaCases", "user", userId]` — scoped to the logged-in user, no cross-user data leaks
- **`enabled: !!userId`** — no Firestore fetch fires before auth resolves
- **Mutations:** `submitRequest` → `createVisaRequest`, `editRequest` → `updateVisaRequest`, `cancelRequest` → `deleteVisaRequest`
- All mutations invalidate `["visaCases"]` to keep the admin list in sync immediately

---

### 3. `useAdminVisaCases.js` — Rewritten with React Query

Admin-facing hook. Exposes admin-only operations the student hook never surfaces.

- **Query key:** `["visaCases"]` — global, all cases
- **Mutations:** `addCase`, `setStatus`, `setFee`, `setSchedule`, `removeCase`
- Each mutation calls a **targeted update function** — `setStatus` only touches `status`, `setFee` only touches fee fields. No full-document overwrites.

---

### 4. `VisaCases.jsx` — Consultation Fee Management Panel

New **Consultation Fee** section added to the admin case details modal:

- **Amount** field (free text input, e.g. `$150`)
- **Payment Status** toggle — "Paid" (emerald) / "Unpaid" (amber)
- **Save Fee** button — calls `setFee()` from `useAdminVisaCases`, isolated from schedule/status saves

---

### 5. Document Upload Flow — Firebase Storage

`UploadCaseDocuments.jsx` now uploads files to Firebase Storage at `visaCases/{userId}/{timestamp}_{filename}` via `uploadVisaDocument()`, then appends document metadata to the Firestore case via `addDocumentsToVisaRequest()`. Documents persist across sessions and are accessible from any device.

---

### 6. Storage Proxy — Visa Documents Covered

The `/storage-proxy/` rules in `vite.config.js` and `netlify.toml` from Session 16 already cover visa document URLs — no new config needed. `toProxyUrl()` in `VisaCaseDetails.jsx` and `AdminVisaCaseDetails.jsx` routes all document fetches through the same proxy path, giving consistent CORS-safe preview and download behaviour.

---

## What Was Done — Monday, 30 March 2026 (Session 13)

### 1. `useBranches.js` — Branches CRUD completed on Firestore

Edit and Delete were silently broken — the hook only exposed `createBranch` but `BranchManagement.jsx` was calling `updateBranch` and `deleteBranch` which didn't exist.

**Added:**

- `updateBranchMutation` → `updateDoc(doc(db, "branches", id), data)`
- `deleteBranchMutation` → `deleteDoc(doc(db, "branches", id))`
- `submitting` flag (covers create + update pending states)
- Removed dead `MOCK_BRANCHES` import

**`BranchManagement.jsx`** — destructured `updateBranch`, `deleteBranch`, `submitting`. Removed unused `useEffect` import.

### 2. Stats card bugs fixed — `BranchManagement.jsx`

| Card           | Bug                                              | Fix                     |
| -------------- | ------------------------------------------------ | ----------------------- |
| Active Centers | `b.status == true` — string vs boolean, always 0 | `b.status === "Active"` |
| Total Staff    | `b.staffCount` — field is actually `b.staff`     | `b.staff \|\| 0`        |

---

## Firebase Connection Overview

### Overall: ~85% Connected to Firebase

| Data Domain                         | Service File                | Status                       | Details                                                                 |
| ----------------------------------- | --------------------------- | ---------------------------- | ----------------------------------------------------------------------- |
| **Auth (login/signup/Google)**      | `userService.js`            | ✅ **100% Firebase**         | Firebase Auth + Firestore profiles, username uniqueness via transaction |
| **Users (CRUD)**                    | `userService.js`            | ✅ **100% Firebase**         | Admin creates users via secondary app instance to avoid signing out     |
| **Applications**                    | `applicationService.js`     | ✅ **100% Firebase**         | Migrated March 27 — Firestore CRUD + React Query                        |
| **Application file uploads**        | `ApplicationSubmitForm.jsx` | ✅ **100% Firebase Storage** | Migrated March 31 — files in Storage, URLs in Firestore                 |
| **Program application forms**       | `AdminProgramDetail.jsx`    | ✅ **100% Firebase Storage** | Migrated March 31 — PDF/doc uploads to Storage                          |
| **Branches**                        | `useBranches.js`            | ✅ **100% Firebase**         | Full CRUD — March 30                                                    |
| **Programs**                        | `programService.js`         | ✅ **100% Firebase**         | Migrated March 30 — Firestore + React Query + matrix tuition fees       |
| **Visa Cases**                      | `visaService.js`            | ✅ **100% Firebase**         | Migrated March 31 — Firestore CRUD + Firebase Storage + React Query     |
| **Visa document uploads**           | `UploadCaseDocuments.jsx`   | ✅ **100% Firebase Storage** | Files in Storage, metadata in Firestore `documents` array               |
| **Financial Reports**               | `financialService.js`       | ❌ **Mock data**             | Unblocked — `visaService` is live, financial migration is next          |
| **CMS (scholarships, posts, media)**| `cmsService.js`             | ✅ **100% Firebase**         | Migrated April 1 — Firestore CRUD, React Query, public pages connected  |

### Score Breakdown

```
Auth + Users         ████████████████████  100%  (Firebase Auth + Firestore)
Applications         ████████████████████  100%  (Firestore + React Query)
File Uploads         ████████████████████  100%  (Firebase Storage — March 31)
Storage Downloads    ████████████████████  100%  (Proxy + SDK — March 31)
Branches             ████████████████████  100%  (Firestore + React Query)
Programs             ████████████████████  100%  (DONE — completed March 30)
Visa Cases           ████████████████████  100%  (DONE — Firestore + Storage, March 31)
Financial            ░░░░░░░░░░░░░░░░░░░░    0%  (unblocked — next in queue)
CMS Content          ████████████████████  100%  (DONE — Firestore + React Query, April 1)

Overall              ██████████████████░░  ~92%
```

---

## What To Do Next (Priority Order)

### ~~Priority 1 — Branches~~ ✅ Done (March 30)

### ~~Priority 2 — Programs~~ ✅ Done (March 30)

### ~~Priority 3 — File Uploads (Applications + Programs)~~ ✅ Done (March 31)

### ~~Priority 4 — Firebase Storage Downloads (CORS)~~ ✅ Done (March 31)

**Problem:** Raw `fetch(downloadUrl)` is blocked by browser CORS policy on Firebase Storage.
`gsutil cors set` was not possible — developer only has access to a different GCP project,
not the `edubridge-5da54` Firebase project (`403 Permission Denied`).

**Solution:** Replaced `fetch()` with Firebase Storage SDK `getBlob()` / `getBytes()` in
`ApplicationPreview.jsx` and `AdminApplicationReview.jsx`. The SDK sends authenticated
requests through Firebase's own API, which handles CORS internally — no bucket config needed.

```js
// getStoragePath() parses path from download URL, then:
const blob = await getBlob(ref(storage, getStoragePath(doc.url)));         // download
const arrayBuffer = await getBytes(ref(storage, getStoragePath(doc.url))); // docx preview
```

### ~~Priority 5 — `visaService.js` → Firestore + Firebase Storage~~ ✅ Done (March 31)

Full Firestore migration + document uploads to Firebase Storage. Both student and admin hooks rewritten with React Query. Fee management UI added. Storage proxy covers visa documents with no extra config.

### Priority 6 — `financialService.js` → Firestore

Now unblocked. Financial data depends on real visa case data — with `visaService` live, the financial dashboard can pull real figures.

Steps:

1. Identify what data `financialService.js` currently mocks
2. Map fields to Firestore (likely aggregates over `visaCases` and `applications` collections)
3. Replace mock return values with live Firestore queries
4. Wire into React Query via a `useFinancials` hook

### ~~Priority 7 — CMS Modules → Firestore~~ ✅ Done (April 1)

`cmsService.js` factory created. `useCMSManager.js` rewritten with `useQuery` + `useMutation`. All three CMS pages (Scholarships, Posts, Media) wired to Firestore. Public-facing pages (`ScholarshipsPage`, `GalleryPage`, `GalleryTeaser`) connected to the same collections with `staleTime: 0` for freshness.

### Priority 8 — Firebase Security Rules

Currently all Firestore writes may be open. Before going to production:

- Users can only read/write their own documents
- Only admins can update `status` fields
- `usernames` collection is write-once (claimed, never changed by the user)

---

## Edge Cases to Test

### Auth

| #   | Scenario                                            | Expected                                                                                                                                        |
| --- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Admin deactivates a user who is currently logged in | On next page load / token refresh, `onAuthStateChanged` fires, `status: "Inactive"` is detected, session is killed, user is redirected to login |

|=> Solution: Passed if I disactivate an account as an admin, on next login the user is told that account is disactivated, please contact support.|

| 2 | Student logs in with correct username but wrong password | Firebase throws `auth/wrong-password` — error shown, no crashing |

|=> It currently shows "Firebase: Error (auth/invalid-credential)."|

| 3 | Two users try to register with the same username at the same millisecond | Firestore transaction on `usernames/{username}` ensures only one succeeds; the second gets "Username already taken" |
| 4 | Google sign-in with an email that already has an email/password account | Firebase links or throws `auth/account-exists-with-different-credential` — handle gracefully |
| 5 | User refreshes the page mid-session | `onAuthStateChanged` restores session from Firebase token — no logout flash |

### Applications

| #                                                  | Scenario                                                                     | Expected                                                                       |
| -------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 6                                                  | Student submits application while not logged in (`auth.currentUser` is null) | `createApplication` throws `"You must be logged in"` before touching Firestore |
| => It currently tells me thata I must login first. |

| 7 | Student crafts a payload with `status: "Approved"` in `updateApplication` | `status` is stripped by the destructure guard — Firestore doc is unchanged for that field |
| 8 | Admin updates status of an application that was just deleted | `updateDoc` throws because the doc doesn't exist — handle with try/catch in mutation |
| 9 | Two admins update the same application status simultaneously | Last write wins (Firestore default) — acceptable for now; flag for optimistic locking later |
| 10 | `getApplicationById` called with an ID that doesn't exist | Returns `null` — pages must handle null gracefully without crashing |

### Visa Cases (localStorage — test before migrating)

| #   | Scenario                                                | Expected                                                                                 |
| --- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 11  | Student submits a visa request, closes browser, reopens | Data persists from localStorage in same browser — but lost on different device/incognito |
| 12  | localStorage quota is exceeded (many large documents)   | `writeAll()` catches `QuotaExceededError` and throws a user-friendly message             |

### React Query Cache

| #   | Scenario                                               | Expected                                                                             |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| 13  | Admin deletes a user, then navigates back to user list | `invalidateQueries(['users'])` forces a fresh Firestore fetch — deleted user is gone |
| 14  | Student creates an application on slow network         | Mutation is pending — UI should show loading state, not allow double-submit          |
| 15  | Admin dashboard loads — Firestore is slow              | `useQueries` shows loading state for all 3 stats cards until all 3 resolve           |

### User Management

| #   | Scenario                                                                | Expected                                                                                                                            |
| --- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 16  | Admin creates a user — the secondary Firebase app fails to clean up     | `finally` block in `createUser` always calls `deleteApp(secondaryApp)` — no app leak                                                |
| 17  | Admin creates a user with an email that already exists in Firebase Auth | `createUserWithEmailAndPassword` throws `auth/email-already-in-use` — caught and shown to admin                                     |
| 18  | Admin deletes a user from Firestore                                     | Firestore doc is deleted, but Firebase Auth account still exists — orphan auth account (known gap, needs Admin SDK to fully delete) |
