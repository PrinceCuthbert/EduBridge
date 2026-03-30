# EduBridge — Firebase Integration Progress Report

> Last updated: 2026-03-31 (Session 16) | Branch: `frontendPhaseI`

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

| Function | Before | After |
|---|---|---|
| `getPrograms()` | `localStorage.getItem(STORAGE_KEY)` | `getDocs(collection(db, "programs"))` |
| `getProgramById(id)` | `.find()` on parsed array | `getDoc(doc(db, "programs", String(id)))` |
| `createProgram(data)` | `Math.random()` int ID + push to array | `uuidv4()` string ID + `setDoc(doc(db, "programs", id), data)` |
| `updateProgram(id, data)` | splice + save to localStorage | `updateDoc` + re-fetch + stamps `updatedAt` |
| `deleteProgram(id)` | filter array + save to localStorage | `deleteDoc(doc(db, "programs", String(id)))` |

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

| File | Fix |
|---|---|
| `AdminProgramDetail.jsx` | `Number(id)` → `String(id)`, `usePrograms(false)` → `usePrograms()`, `loading` → `saving` |
| `ProgramDetail.jsx` | `Number(id)` → `id` (string) passed to `useProgram` |
| `UniversityPrograms.jsx` | Dead `MOCK_PROGRAMS` import removed |

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

| Icon | Behaviour |
|---|---|
| Eye (green) | PDF/image → new tab. `.docx/.doc` → mammoth.js renders HTML in modal. Other → download + toast |
| Download (blue) | `fetch` → `blob` → `<a download>` — true local save, no navigation |

**mammoth.js** (`npm install mammoth`) converts `.docx` to HTML client-side — no external server or CORS dependency for preview. Microsoft Office Online viewer approach abandoned (Firebase Storage URLs blocked by CORS from external servers).

**Requires one-time CORS setup** on Firebase Storage bucket for fetch-based downloads to work:
```bash
echo '[{"origin":["*"],"method":["GET"],"maxAgeSeconds":3600}]' > cors.json
gsutil cors set cors.json gs://edubridge-5da54.appspot.com
```

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

### Overall: ~65% Connected to Firebase

| Data Domain | Service File | Status | Details |
|---|---|---|---|
| **Auth (login/signup/Google)** | `userService.js` | ✅ **100% Firebase** | Firebase Auth + Firestore profiles, username uniqueness via transaction |
| **Users (CRUD)** | `userService.js` | ✅ **100% Firebase** | Admin creates users via secondary app instance to avoid signing out |
| **Applications** | `applicationService.js` | ✅ **100% Firebase** | Migrated March 27 — Firestore CRUD + React Query |
| **Application file uploads** | `ApplicationSubmitForm.jsx` | ✅ **100% Firebase Storage** | Migrated March 31 — files in Storage, URLs in Firestore |
| **Program application forms** | `AdminProgramDetail.jsx` | ✅ **100% Firebase Storage** | Migrated March 31 — PDF/doc uploads to Storage |
| **Branches** | `useBranches.js` | ✅ **100% Firebase** | Full CRUD — March 30 |
| **Programs** | `programService.js` | ✅ **100% Firebase** | Migrated March 30 — Firestore + React Query + matrix tuition fees |
| **Visa Cases** | `visaService.js` | ❌ **localStorage** | Full mock — no Firebase yet |
| **Financial Reports** | `financialService.js` | ❌ **Mock data** | Blocked on `visaService` migration |
| **CMS (scholarships, posts, etc.)** | `useCMSManager.js` | ❌ **In-memory only** | Seeded from mock arrays, resets on page refresh |

### Score Breakdown

```
Auth + Users         ████████████████████  100%  (Firebase Auth + Firestore)
Applications         ████████████████████  100%  (Firestore + React Query)
File Uploads         ████████████████████  100%  (Firebase Storage — March 31)
Branches             ████████████████████  100%  (Firestore + React Query)
Programs             ████████████████████  100%  (DONE — completed March 30)
Visa Cases           ░░░░░░░░░░░░░░░░░░░░    0%  (localStorage — next in queue)
Financial            ░░░░░░░░░░░░░░░░░░░░    0%  (blocked on visaService)
CMS Content          ░░░░░░░░░░░░░░░░░░░░    0%  (in-memory mock)

Overall              █████████████░░░░░░░  ~65%
```

---

## What To Do Next (Priority Order)

### ~~Priority 1 — Branches~~ ✅ Done (March 30)
### ~~Priority 2 — Programs~~ ✅ Done (March 30)
### ~~Priority 3 — File Uploads (Applications + Programs)~~ ✅ Done (March 31)

### Priority 1 — Firebase Storage CORS (Required for downloads)

Fetch-based downloads in `ApplicationPreview.jsx` and `AdminApplicationReview.jsx` use `fetch(storageUrl)` → blob. This requires CORS to be configured on the Storage bucket or the fetch silently falls back to `window.open`.

```bash
echo '[{"origin":["*"],"method":["GET"],"maxAgeSeconds":3600}]' > cors.json
gsutil cors set cors.json gs://edubridge-5da54.appspot.com
```

### Priority 2 — `visaService.js` → Firestore

The biggest remaining data gap. Visa data resets to mock on every fresh session, never persisted.

Steps:
1. Replace `readAll()` / `writeAll()` with Firestore (`getDocs`, `setDoc`, `updateDoc`, `deleteDoc`)
2. Use `where("userId", "==", userId)` for `getVisaRequestsByUserId`
3. Migrate visa document uploads to Firebase Storage (same pattern as `ApplicationSubmitForm.jsx`)
4. Update `financialService.js` — unlocks real financial data once `visaService` is live

### Priority 3 — CMS Modules → Firestore

`useCMSManager.js` holds all CMS data in React state. Scholarships, posts, and publishers reset on every refresh.

Steps:

1. Create Firestore collections: `scholarships`, `posts`, `publishers`
2. Rewrite `useCMSManager.js` with `useQuery` + `useMutation` (same pattern as `useUsers`)
3. Or replace per-page with dedicated hooks

### Priority 5 — Firebase Security Rules

Currently all Firestore writes may be open. Before going to production:

- Users can only read/write their own documents
- Only admins can update `status` fields
- `usernames` collection is write-once (claimed, never changed by the user)

---

## Edge Cases to Test

### Auth

| #   | Scenario                                                                 | Expected                                                                                                                                        |
| --- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Admin deactivates a user who is currently logged in                      | On next page load / token refresh, `onAuthStateChanged` fires, `status: "Inactive"` is detected, session is killed, user is redirected to login |
| 2   | Student logs in with correct username but wrong password                 | Firebase throws `auth/wrong-password` — error shown, no crash                                                                                   |
| 3   | Two users try to register with the same username at the same millisecond | Firestore transaction on `usernames/{username}` ensures only one succeeds; the second gets "Username already taken"                             |
| 4   | Google sign-in with an email that already has an email/password account  | Firebase links or throws `auth/account-exists-with-different-credential` — handle gracefully                                                    |
| 5   | User refreshes the page mid-session                                      | `onAuthStateChanged` restores session from Firebase token — no logout flash                                                                     |

### Applications

| #   | Scenario                                                                     | Expected                                                                                    |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 6   | Student submits application while not logged in (`auth.currentUser` is null) | `createApplication` throws `"You must be logged in"` before touching Firestore              |
| 7   | Student crafts a payload with `status: "Approved"` in `updateApplication`    | `status` is stripped by the destructure guard — Firestore doc is unchanged for that field   |
| 8   | Admin updates status of an application that was just deleted                 | `updateDoc` throws because the doc doesn't exist — handle with try/catch in mutation        |
| 9   | Two admins update the same application status simultaneously                 | Last write wins (Firestore default) — acceptable for now; flag for optimistic locking later |
| 10  | `getApplicationById` called with an ID that doesn't exist                    | Returns `null` — pages must handle null gracefully without crashing                         |

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
