# Firebase Migration — Session Progress Report
**Date:** 2026-03-24
**Branch:** `frontendPhaseI`
**Author:** EduBridge Frontend Team

---

## Overview

This session migrated the EduBridge user management system from a **localStorage simulation** to a real **Firebase (Firestore + Firebase Authentication)** backend. The work followed an MVC pattern already established in the codebase via `useBranches.js`.

---

## Architecture Pattern Used

Every data flow follows a strict 3-layer structure:

```
Service Layer              Hook Layer (Controller)        View Layer
──────────────────         ──────────────────────         ──────────────────
src/services/              src/hooks/                     src/pages/
  userService.js    ←        useUsers.js             ←     UserManagement.jsx
  (Firestore/Auth)            (React Query)                 (UI only)
```

- **Service** — pure async functions, no React. Talks directly to Firebase.
- **Hook** — wraps service calls in React Query (`useQuery`, `useMutation`, `useQueryClient`). Owns all server state.
- **View** — only owns UI state (modal open/close, form fields). Calls the hook, renders data.

---

## Phase 1 — Firestore CRUD (Completed)

### Files Changed

#### `src/services/userService.js`
- Removed all localStorage simulation (`_getUsersDB`, `_saveUsersDB`, `STORAGE_KEY`, `MOCK_USERS`, `MOCK_ROLES`)
- Removed `getRoleId` helper — roles are now stored as plain strings in Firestore
- Removed `roleId` field from all user objects
- Migrated Admin CRUD functions to Firestore:

| Function | Before | After |
|---|---|---|
| `getUsers` | `localStorage.getItem` | `getDocs(collection(db, "users"))` |
| `getUserById` | `array.find()` | `getDoc(doc(db, "users", id))` |
| `createUser` | push to localStorage array | `addDoc(collection(db, "users"), data)` |
| `updateUser` | splice localStorage array | `updateDoc(doc(db, "users", id), data)` |
| `deleteUser` | filter localStorage array | `deleteDoc(doc(db, "users", id))` |

#### `src/hooks/useUsers.js`
- Fully rewritten from `useState + useEffect` to **React Query**
- Uses `useQuery` for fetching (replaces `useEffect`)
- Uses `useMutation` for create/update/delete
- Uses `useQueryClient.invalidateQueries(["users"])` after every mutation to auto-refetch
- `UserManagement.jsx` required **zero changes** — the hook contract stayed identical

#### `src/firebase/config.js`
- Added `getAuth` import and initialization
- Exported `auth` alongside `db`

---

## Phase 2 — Firebase Authentication (Partially Complete)

### What Was Done

#### `src/services/userService.js` — Auth functions migrated
- `registerUser` → `createUserWithEmailAndPassword(auth, email, password)` + `setDoc` to Firestore using Firebase uid as document ID
- `loginUser` → `signInWithEmailAndPassword(auth, email, password)` + `getDoc` to fetch full profile
- `loginWithGoogleToken` → `GoogleAuthProvider.credential(credential)` + `signInWithCredential(auth, ...)` + auto-creates Firestore profile on first login
- Passwords are **no longer stored in Firestore** — Firebase Auth handles them securely

#### `src/context/AuthContext.jsx` — Session management migrated
- Replaced `localStorage.getItem("edubridge_user_session")` with `onAuthStateChanged(auth, callback)`
- On every page load, Firebase automatically restores the session and fires the callback
- The callback fetches the full user profile from Firestore using `firebaseUser.uid`
- `logout` now calls `signOut(auth)` instead of `localStorage.removeItem`
- No more manual session persistence — Firebase handles it internally

### Key Design Decision — `setDoc` vs `addDoc`
When a user registers, `setDoc(doc(db, "users", uid), profile)` is used instead of `addDoc`. This forces the Firestore document ID to equal the Firebase Auth uid, creating a permanent link between Auth and Firestore:

```
Firebase Auth:  uid = "abc123"   (handles password + session)
Firestore:      /users/abc123    (handles profile data)
```

This is what makes `onAuthStateChanged` → `getDoc(doc(db, "users", firebaseUser.uid))` possible.

---

## Blocker — Firebase Console Configuration Required

### Error Encountered
```
Firebase: Error (auth/operation-not-allowed)
```
Triggered immediately on signup at `/signup`.

### Root Cause
Firebase disables all authentication providers by default. The **Email/Password** sign-in method must be manually enabled in the Firebase Console before the app can use it.

### What Needs to Be Done
See the next section: **Request for Firebase Admin**.

---

## Current State Summary

| Feature | Status |
|---|---|
| Admin CRUD (create/edit/delete users) | Working via Firestore |
| User list loads from Firestore | Working |
| Signup form | Blocked — needs Email/Password enabled |
| Login form | Blocked — needs Email/Password enabled |
| Google login | Blocked — needs Google provider enabled |
| Session persistence | Ready (code done, blocked by auth) |

---

## Next Steps (After Firebase Admin Unblocks)

1. **Step 4** — Test full signup → login → session persistence flow
2. **Step 4** — Build `useCurrentUser` hook that joins Firebase Auth state with Firestore profile for the student dashboard
3. **Step 5** — Migrate `updatePassword` to use Firebase Auth's `updatePassword()` function
4. Apply the same React Query pattern to remaining services (`applicationService`, `visaService`, etc.)
