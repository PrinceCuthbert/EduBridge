/**
 * fileService.js
 * Wraps all interactions with the SYSTEM_FILES table.
 *
 * Currently a dev stub — uploadFile() creates a local blob URL so the UI
 * works end-to-end without a backend.
 *
 * When the API is live, swap ONLY the body of uploadFile() below.
 * Every component that calls it stays untouched.
 */

// ─── STUB (active during development) ────────────────────────────────────────

/**
 * Upload a file and return its stored path.
 *
 * @param {File} file
 * @returns {Promise<{ id: number, file: string }>}
 *   id   — SYSTEM_FILES.id (null in stub)
 *   file — server path, e.g. "/uploads/2026/03/abc123.jpg"
 */
export async function uploadFile(file) {
  // Simulate a short network delay so the async pattern is exercised in dev.
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Blob URL — works for the current session, same as before.
  // Will be replaced by a real server path once the API is wired.
  return { id: null, file: URL.createObjectURL(file) };
}

// ─── REAL IMPLEMENTATION (replace stub above when backend is ready) ───────────
//
// import { getToken } from './userService';   // or wherever your auth token lives
//
// export async function uploadFile(file) {
//   const body = new FormData();
//   body.append('file', file);
//
//   const res = await fetch('/api/files', {
//     method: 'POST',
//     body,
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//
//   if (!res.ok) throw new Error('File upload failed');
//
//   // Backend inserts into SYSTEM_FILES and returns:
//   // { id: 42, file: '/uploads/2026/03/abc123.jpg' }
//   return res.json();
// }
