# EduBridge — Developer Log
**Last updated:** March 17, 2026
**Sessions:** March 16 (audit + MVC refactor) · March 17 session 2 (visa flow, document upload/preview/delete, bug fixes) · March 17 session 3 (admin visa detail page, UI polish, storage fix)

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
| Action | File |
|--------|------|
| Moved | `pages/dashboard/VisaSummary.jsx` → `pages/student-dashboard/visa/VisaSummary.jsx` |
| Moved | `pages/dashboard/VisaRequestForm.jsx` → `pages/student-dashboard/visa/VisaRequestForm.jsx` |
| Moved | `pages/admin/VisaCases.jsx` → `pages/admin-dashboard/visa/VisaCases.jsx` |
| Deleted | Empty `pages/dashboard/` and `pages/admin/` directories |
| Updated | `StudentRoutes.jsx` — fixed lazy import paths |
| Updated | `AdminRoutes.jsx` — fixed lazy import path |
| Fixed | All imports inside moved files to use `@/` Vite path aliases |

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
  [user?.identity?.firstName, user?.identity?.lastName].filter(Boolean).join(" ") ||
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
      : r
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

| Function | Who calls it | What it does |
|----------|-------------|--------------|
| `getVisaRequests()` | Admin | All cases |
| `getVisaRequestsByUserId(userId)` | Student | This student's cases |
| `getVisaRequestById(id)` | Detail pages | Single case |
| `createVisaRequest(formData, userId)` | Student form | New case + `documents: []` |
| `addDocumentsToVisaRequest(caseId, newDocs)` | Upload form | Merge docs, persist |
| `deleteDocumentFromVisaRequest(caseId, docId)` | Detail page | Remove one doc, persist |
| `updateVisaRequest(id, formData)` | Student edit | Student-safe update (strips admin fields) |
| `updateVisaStatus(id, status)` | Admin | Status only |
| `updateVisaFee(id, fee, feeStatus)` | Admin | Fee only |
| `updateVisaSchedule(id, schedule)` | Admin | Date, time, link |
| `deleteVisaRequest(id)` | Admin | Delete whole case |

---

---

## Session 3 — March 17, 2026

### Part 7 — Admin Visa Case Detail Page

#### 7a. New full-page admin view for visa cases

**New file:** `src/pages/admin-dashboard/visa/AdminVisaCaseDetails.jsx`
**Updated:** `src/routes/AdminRoutes.jsx`, `src/pages/admin-dashboard/visa/VisaCases.jsx`

**Why:** The admin visa table previously had an Eye button that opened a modal. The modal only showed basic info and the scheduler. The student's `VisaCaseDetails` page showed documents nicely — the admin had no equivalent full-page view and could not preview or download student-uploaded documents.

**What was built:**

| Section | Content |
|---------|---------|
| Student info card | Name, email, phone, country of origin, status badge, submission date |
| Summary cards (4) | Destination (with flag), visa type, status, fee + fee status badge |
| Appointment section | Scheduled date/time, meeting type, clickable meeting link |
| Notes | Shown only when `caseData.notes` is non-empty |
| Documents grid | Paginated (6 per page), preview + download only — **no delete** |

**Document actions (admin):**

- **Preview** — same Blob URL pattern as student side: `base64 → atob → Uint8Array → Blob → createObjectURL → window.open`
- **Download** — `document.createElement('a')` with `href=doc.url` and `download=doc.name`
- **No delete button** — admin is read-only for student documents

**Navigation changes in `VisaCases.jsx`:**

| Button        | Before                  | After                                            |
|---------------|-------------------------|--------------------------------------------------|
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
  "Browser storage is full. Try uploading smaller files, or delete existing documents to free up space."
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
|------------------|--------------|---------------|---------------|
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

| Task | Details |
|------|---------|
| **Connect real auth API** | `userService.loginUser` → `authAPI.login(email, password)`. Response will be `{ token, user }`. AuthContext is already ready to receive it (`_persistSession` handles the token). |
| **Connect applications API** | Replace `localStorage` body in `applicationService.js` with `applicationAPI.*` calls from `api/services.js`. The hook and all pages stay unchanged. |
| **Connect visa API** | Same swap in `visaService.js` → `visaAPI.*`. |
| **Connect programs API** | Same swap in `programService.js` → `fetch('/api/programs/...')`. |
| **Connect users API** | Same swap in `userService.js` → `userAPI.*`. |
| **Create `.env` file** | Add `VITE_API_BASE_URL=https://your-backend.com/api`. The axios client already reads it. |

### Medium Priority — Feature Completeness

| Task | Details |
|------|---------|
| **Student profile settings page** | The student equivalent of `AdminSettings.jsx` — currently missing or incomplete. Should let students edit phone, nationality, gender, DOB and change password. |
| **Visa document upload** | `UploadCaseDocuments.jsx` exists but needs real file handling (upload to S3 / Cloudinary in production, or Base64 for demo like applications). |
| **Application detail page for students** | Students can list and delete applications but there's no proper read-only detail view showing all fields, tracker stages, and admin feedback. |
| **Admin feedback on applications** | Admin can change status but the `sendFeedback` and `requestDocuments` API methods exist and are unused. Wire them to the UI. |
| **Programs — Departments (join table)** | Currently admins add departments as flat rows stored in `departments[]`. In production, this should create/update `MAJOR` and `DEPARTMENT_MAJOR` records. Plan the form → API mapping. |
| **Real file download** | Documents stored as Base64 data URLs work for demo. In production, replace with signed S3 URLs. |

### Low Priority — Polish & UX

| Task | Details |
|------|---------|
| **Form validation** | Add proper validation (Zod or simple custom) to `VisaRequestForm`, `ApplicationSubmitForm`, and the program form. Currently only HTML5 `required` is used. |
| **Loading skeletons** | Some pages show a spinner, others show nothing while loading. Standardise with `<Skeleton>` components throughout. |
| **Empty states** | Pages like `MyApplications` and `VisaSummary` need friendly empty state illustrations when a student has no records. |
| **Notifications** | The bell icon in layouts is commented out. When the backend is ready, wire it to a notifications endpoint. |
| **Search in admin tables** | `UserManagement`, `ApplicationReview`, and `VisaCases` have search UI but some may not be fully wired. |
| **Hardcoded background colours** | Both layouts use `bg-[#F8FAFC]`. Replace with Tailwind `bg-slate-50` for consistency. |
| **Analytics page** | Currently a placeholder. Wire to `analyticsAPI.*` when backend is ready. |
| **Financial Reports** | Same — placeholder, needs backend. |
| **Role Management** | Route is commented out (`/admin/roles`). This will be a backend-only concern — implement after auth roles are live. |

### Security — Before Going Live

| Task | Details |
|------|---------|
| **Remove passwords from localStorage** | `userService` currently stores plain-text passwords in `localStorage` for the mock. This MUST be removed — the real backend handles auth. |
| **JWT refresh tokens** | The axios interceptor handles 401 → logout. Add a refresh token flow so sessions don't expire mid-use. |
| **Input sanitisation** | Audit all free-text inputs (notes, descriptions) for XSS risk before rendering as HTML. |
| **Route protection audit** | Verify all admin routes are wrapped in `<ProtectedRoute allowedRoles={['admin']}>` and all student routes in `allowedRoles={['student']}`. |

---

## Quick Reference — Key Files

| What you want to change | File to edit |
|------------------------|-------------|
| Auth logic (login, logout, session) | `src/context/AuthContext.jsx` |
| User data / password / profile | `src/services/userService.js` |
| Application CRUD | `src/services/applicationService.js` |
| Visa request CRUD | `src/services/visaService.js` |
| Program CRUD | `src/services/programService.js` |
| Admin dashboard stats | `src/hooks/useDashboard.js` |
| Axios base URL / auth header | `src/api/services.js` |
| Student sidebar & header | `src/pages/student-dashboard/StudentDashboardLayout.jsx` |
| Admin sidebar & header | `src/pages/admin-dashboard/AdminLayout.jsx` |
| Student route definitions | `src/routes/StudentRoutes.jsx` |
| Admin route definitions | `src/routes/AdminRoutes.jsx` |
| Status badge colours | `src/data/mockVisaData.js` → `VISA_STATUS_CONFIG` |
| Program majors / join table | `src/data/mockMajors.js` |
