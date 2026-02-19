# Application Module — Change Log & Technical Reference

**Date:** 2026-02-19  
**Project:** EduBridge Frontend (`src/`)  
**Scope:** End-to-end application submission and management module

---

## What Was Built

A fully functional application management flow for EduBridge, covering:
- Student submitting, editing, viewing, and deleting scholarship/program applications
- Admin viewing all applications, filtering by status, and updating application status

All data is persisted in **`localStorage`** under the key `"edubridge_applications"`. The service layer (`applicationService.js`) is the **only file that touches storage**, making it trivial to swap for real API calls later.

---

## Architecture Diagram

```
localStorage ("edubridge_applications")
        ↕
applicationService.js       ← data layer (CRUD)
        ↕
useApplications.js          ← React hook (userId? → student | null → admin)
        ↕
┌─────────────────────────┐       ┌──────────────────────────────────┐
│   Student Dashboard      │       │        Admin Dashboard            │
│  MyApplications          │       │  ApplicationReview  (list)        │
│  ApplicationSubmitForm   │       │  AdminApplicationReview (detail)  │
│  ApplicationDetail       │       │                                  │
└─────────────────────────┘       └──────────────────────────────────┘
        ↕ shared
  StatusBadge.jsx
```

---

## 1. Data Layer — `src/services/applicationService.js`

**Status:** NEW  
**Purpose:** Single source of truth for all application CRUD operations.

### Functions

| Function | Purpose |
|---|---|
| `getApplications()` | Returns all applications from localStorage |
| `getApplicationsByUserId(userId)` | Returns only apps from a specific student |
| `getApplicationById(id)` | Returns one application or `null` |
| `createApplication(data)` | Generates ID, sets status to `"Pending"`, saves |
| `updateApplication(id, data)` | Student-safe update — **strips `status` field** to prevent tampering |
| `updateApplicationStatus(id, status)` | Admin-only — changes status only |
| `deleteApplication(id)` | Removes entry by id |

### Application Data Shape

```js
{
  id:             "APP-<timestamp>-<rand>",
  userId:         "student_01",         // from AuthContext
  programId:      "prog-123",
  universityName: "Seoul National University",
  programName:    "Computer Science",
  firstName:      "John",
  lastName:       "Doe",
  phone:          "+254 712 345 678",
  email:          "student@test.com",
  submissionDate: "2026-02-19",
  status:         "Pending",
  documents: [
    { id, name, type, size, url, uploadedAt }
  ]
}
```

### Design Decisions
- **`updateApplication` strips status** — prevents a student from elevating their own status by editing the form payload.
- File URLs are stored as **object URL strings** (`URL.createObjectURL(file)`) — valid for the session. In production, these would be replaced with CDN/S3 URLs.

---

## 2. Hook — `src/hooks/useApplications.js`

**Status:** REWRITTEN (was using mock data store)

### Signature

```js
const {
  applications, loading, error,
  fetchApplications, createApplication,
  updateApplication, updateStatus, deleteApplication,
} = useApplications(userId?);
```

### Parameter
| `userId` | Behaviour |
|---|---|
| A string (e.g. `"student_01"`) | Filters to that student's applications only |
| `null` / omitted | Returns ALL applications (admin mode) |

### How it changed from the old version
| Before | After |
|---|---|
| Used an in-memory `applicationsStore` array (reset on page refresh) | Delegates to `applicationService.js` → persists in localStorage |
| No userId filtering | Accepts optional `userId` parameter |
| Exposed `addApplication`, `updateApplicationStatus` | Exposes `createApplication`, `updateApplication`, `updateStatus`, `deleteApplication` |
| `fetchApplications` had a fake 800ms delay | Synchronous localStorage read, no artificial delay |

---

## 3. Shared Component — `src/components/shared/StatusBadge.jsx`

**Status:** NEW  
**Used in:** `MyApplications`, `ApplicationDetail`, `ApplicationReview`, `AdminApplicationReview`

### Props
```jsx
<StatusBadge status="Approved" />
// status: "Pending" | "Reviewing" | "Needs Changes" | "Approved" | "Rejected"
```

### Colour mapping (STATUS_CONFIG — also exported)

| Status | Badge colour | Dot colour |
|---|---|---|
| Pending | slate | slate |
| Reviewing | blue | blue |
| Needs Changes | amber | amber |
| Approved | emerald | emerald |
| Rejected | red | red |

`STATUS_CONFIG` is exported so `AdminApplicationReview` can apply the same colours to status buttons without duplicating the map.

---

## 4. Student Pages

### 4a. `src/pages/dashboard/ApplicationSubmitForm.jsx`

**Status:** NEW (replaces old `ApplicationSubmission.jsx`, which is left in place but unrouted)

#### Modes
| Mode | Route | Trigger |
|---|---|---|
| **Create** | `/dashboard/applications/submit/:programId` | Navigating from a program page |
| **Edit** | `/dashboard/applications/edit/:id?edit=true` | Clicking Edit in MyApplications table |

#### Key behaviours
- In **create** mode: `programId` from `useParams()` pre-selects the dropdown.
- In **edit** mode: loads the existing application from `getApplicationById(id)` on mount, pre-fills all fields and shows existing uploaded documents with individual ✕ remove buttons.
- **File upload:** 10 MB per file limit, accepts `.pdf .doc .docx .zip .jpg .jpeg .png`. Files staged in React state, converted to object URLs on submit.
- `userId` comes from `useAuth()` — never hardcoded.

#### How the form was built
1. `useParams()` reads `id` (either a programId or applicationId depending on mode).
2. `useSearchParams()` reads `?edit=true` flag to determine mode.
3. On mount (edit mode): `getApplicationById(id)` → setForm + setExistingDocs.
4. On submit: validates programId → looks up program name from `usePrograms()` → constructs document objects → calls `createApplication` or `updateApplication` → toast → navigate.

---

### 4b. `src/pages/dashboard/ApplicationDetail.jsx`

**Status:** NEW  
**Route:** `/dashboard/applications/:id`

A read-only page. Loads application with `getApplicationById(id)` (synchronous, no hook needed). Displays:
- Application ID, university name, program name, `<StatusBadge>`
- Applicant name, email, phone, submission date
- Uploaded documents with download links (`<a href={doc.url} download>`)

---

### 4c. `src/pages/dashboard/MyApplications.jsx`

**Status:** REWRITTEN

#### New features vs old version
| Feature | Old | New |
|---|---|---|
| Data source | Mock in-memory store | `useApplications(user.id)` → localStorage |
| Loading state | None | Animated skeleton (3 placeholder rows) |
| Empty state | None | Illustrated empty state + "Browse Programs" button |
| Status filter | Dropdown (non-functional) | Functional `<select>` — real filter on `applications` array |
| Sort | Dropdown (non-functional) | Functional — sorts by `submissionDate` asc/desc |
| Status display | Inline `getStatusColor()` — duplicated logic | `<StatusBadge>` component |
| Delete | None | Trash icon → **Sonner toast warning** with `action: Delete` and `cancel` buttons. Duration 8 s. No `window.confirm`. |
| Edit | None | Pencil icon → navigate to `/dashboard/applications/edit/:id?edit=true` |
| View | Eye icon (no navigation) | Eye icon → navigate to `/dashboard/applications/:id` |

#### Delete flow (toast-based)
```
click Trash icon
  → toast.warning("Delete application for X?", {
      action: { label: "Delete", onClick: () => deleteApplication(id) },
      cancel: { label: "Cancel" },
      duration: 8000
    })
  → on "Delete" click: deleteApplication(id) → fetchApplications() → toast.success
```

---

## 5. Admin Pages

### 5a. `src/pages/admin/ApplicationReview.jsx`

**Status:** REWRITTEN (was both list AND detail page — split into two)

#### What changed
- Now serves as the **list page only** (old detail functionality moved to `AdminApplicationReview.jsx`).
- Uses `useApplications()` with no userId → fetches all students' applications.
- Added **tab pill filter row**: All | Pending | Reviewing | Needs Changes | Approved | Rejected.
- "View" button renamed to **"Review"** and navigates to `/admin/applications/:id/review`.
- Applicant column now shows **initials avatar** (blue circle with first + last initial) instead of a `ui-avatars.com` image request.
- Uses `<StatusBadge>` instead of a local `getStatusColor()` function.

---

### 5b. `src/pages/admin/AdminApplicationReview.jsx`

**Status:** NEW  
**Route:** `/admin/applications/:id/review`

Three-column layout (2 main + 1 sidebar):

| Section | Content |
|---|---|
| Applicant Profile | Initials avatar, full name, email, phone, submission date, App ID |
| Program Details | University name, program name, graduation cap icon |
| Submitted Documents | File grid with type emoji + name + size + date + download link |
| Status Management (sidebar) | `STATUS_CONFIG` buttons — clicking fires `updateStatus(id, s)` |

#### Status update flow
```
click status button (e.g. "Reviewing")
  → setUpdating("Reviewing")     ← shows spinner on that button
  → updateStatus(id, "Reviewing")  ← writes to localStorage
  → setApp(getApplicationById(id))  ← refreshes local state immediately
  → toast.success("Status updated to 'Reviewing'")
  → setUpdating(null)
```

The **current status button** renders with `bg-slate-900 text-white` and is disabled. All other buttons are white/bordered and hoverable.

---

## 6. Routes Updated

### `src/routes/StudentRoutes.jsx`

```
ADDED:
  /dashboard/applications/:id          → ApplicationDetail (read-only)
  /dashboard/applications/submit/:id   → ApplicationSubmitForm (create mode)
  /dashboard/applications/edit/:id     → ApplicationSubmitForm (edit mode)

REMOVED:
  Old ApplicationSubmission import & route
```

### `src/routes/AdminRoutes.jsx`

```
ADDED:
  /admin/applications/:id/review       → AdminApplicationReview

REMOVED:
  ApplicationDetail (old admin detail that used hardcoded mock data) — file left intact but not routed
```

---

## 7. Files Left Unchanged (but affected indirectly)

| File | Why affected |
|---|---|
| `src/pages/admin/ApplicationDetail.jsx` | Still exists but no longer has a route. Contains old hardcoded mock data. Safe to delete in a future cleanup. |
| `src/pages/dashboard/ApplicationSubmission.jsx` | Still exists, unrouted. The new `ApplicationSubmitForm.jsx` supersedes it. |
| `src/data/mockData.js` | `MOCK_APPLICATIONS` export no longer used anywhere except the old hook (now replaced). Can be pruned. |

---

## 8. Test Credentials

| Role | Email | Password | User ID |
|---|---|---|---|
| Student | `student@test.com` | `student123` | `student_01` |
| Admin | `admin@edubridge.africa` | `admin123` | `admin_01` |

Applications from the student are stored in localStorage and immediately visible to the admin (same browser, same key).

---

## 9. Future Backend Integration

To replace localStorage with real API calls, edit **only `applicationService.js`**:

```js
// Before (localStorage)
export const getApplications = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
};

// After (real API)
export const getApplications = async () => {
  const res = await fetch("/api/applications", { headers: authHeaders() });
  return res.json();
};
```

The hook and all page components will work without any changes.
