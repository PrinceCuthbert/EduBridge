// ─────────────────────────────────────────────────────────────
//  src/services/visaService.js
//
//  WHY THIS FILE EXISTS:
//  Single source of truth for ALL visa request CRUD.
//  Mirrors applicationService.js — same pattern, same rules.
//
//  THE ONE RULE:
//  No page, no hook, no component ever touches localStorage
//  directly. They all go through this file.
//
//  BACKEND SWAP (future):
//  Every function already returns a Promise.
//  To go live, replace the localStorage body with fetch().
//  Example at the bottom of this file.
// ─────────────────────────────────────────────────────────────

import { MOCK_VISA_REQUESTS } from "../data/mockVisaData";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "edubridge_visa_requests";

// ── Seed localStorage on first load ──────────────────────────
// Same trick as applicationService.js.
// If the key doesn't exist yet, write the mock records so the
// UI has something to show on a fresh browser session.
// ── Internal read/write helpers ───────────────────────────────
const readAll = () => {
  // Seed mock data only in development — production starts empty.
  if (import.meta.env.DEV && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_VISA_REQUESTS));
  }
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const writeAll = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    // DOMException: QuotaExceededError — browser storage is full
    if (
      err instanceof DOMException &&
      (err.name === "QuotaExceededError" ||
        err.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      throw new Error(
        "Browser storage is full. Try uploading smaller files, or delete existing documents to free up space.",
      );
    }
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────
//  PUBLIC API
//  Every function is async — ready for real fetch() calls.
// ─────────────────────────────────────────────────────────────

/**
 * Return ALL visa requests.
 * Used by: admin dashboard (VisaCases.jsx)
 */
export const getVisaRequests = async () => {
  return readAll();
};

/**
 * Return only the requests belonging to one student.
 * Used by: student dashboard (VisaSummary.jsx)
 *
 * @param {string} userId - from AuthContext (e.g. "student_01")
 */
export const getVisaRequestsByUserId = async (userId) => {
  return readAll().filter((r) => r.userId === userId);
};

/**
 * Return a single request by its ID.
 * Used by: detail pages, edit forms.
 *
 * @param {string} id
 * @returns {object|null}
 */
export const getVisaRequestById = async (id) => {
  return readAll().find((r) => r.id === id) ?? null;
};

/**
 * Student submits a new visa consultation request.
 *
 * What this function does that the caller does NOT:
 *  - Generates a unique ID
 *  - Sets status to "New" (student cannot choose their own status)
 *  - Sets submissionDate to today
 *  - Strips any admin-only fields (fee, adminNotes, meetingLink)
 *    the form might accidentally send
 *
 * @param {object} formData - fields from VisaRequestForm
 * @param {string} userId   - from AuthContext
 */
export const createVisaRequest = async (formData, userId) => {
  const all = readAll();

  const newRequest = {
    // ── Student-submitted fields ──
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    countryOfOrigin: formData.countryOfOrigin,
    destination: formData.destination,
    countryCode: formData.countryCode ?? "",
    visaType: formData.visaType,
    preferredDate: formData.preferredDate,
    meetingType: formData.meetingType,
    notes: formData.notes ?? "",

    // ── System-generated (never from form) ──
    id: uuidv4(),
    userId,
    status: "New",
    submissionDate: new Date().toISOString().split("T")[0],

    // ── Admin-only fields — always empty on creation ──
    // Admin fills these in later via updateVisaFee / updateVisaStatus.
    consultationFee: "",
    feeStatus: "Unpaid",
    appointmentDate: "",
    appointmentTime: "",
    meetingLink: "",
    adminNotes: "",

    // ── Documents uploaded by student ──
    documents: [],
  };

  writeAll([...all, newRequest]);
  return newRequest;
};

/**
 * Student edits their own request (before it is reviewed).
 *
 * SECURITY: strips status, fee, and all admin-only fields.
 * A student cannot elevate their own status by editing the payload.
 * Same protection as applicationService.js → updateApplication().
 *
 * @param {string} id
 * @param {object} formData
 */
export const updateVisaRequest = async (id, formData) => {
  const all = readAll();

  // Destructure out admin fields so they can never be overwritten
  const {
    status,           // strip — admin only
    consultationFee,  // strip — admin only
    feeStatus,        // strip — admin only
    appointmentDate,  // strip — admin only
    appointmentTime,  // strip — admin only
    meetingLink,      // strip — admin only
    adminNotes,       // strip — admin only
    userId,           // strip — cannot change ownership
    id: _id,          // strip — cannot change identity
    submissionDate,   // strip — cannot change original date
    ...studentFields  // only these are allowed through
  } = formData;

  const updated = all.map((r) =>
    r.id === id ? { ...r, ...studentFields } : r
  );

  writeAll(updated);
  return updated.find((r) => r.id === id);
};

/**
 * Admin updates the status of a request.
 * ONLY changes the status field — nothing else.
 *
 * @param {string} id
 * @param {string} status - must be a key in VISA_STATUS_CONFIG
 */
export const updateVisaStatus = async (id, status) => {
  const all = readAll();
  const updated = all.map((r) => (r.id === id ? { ...r, status } : r));
  writeAll(updated);
  return updated.find((r) => r.id === id);
};

/**
 * Admin records the consultation fee and marks payment status.
 * Separate from updateVisaStatus because fee is verified externally
 * (admin checks a bank transfer, M-Pesa, etc.) then updates here.
 *
 * @param {string} id
 * @param {string} consultationFee  - e.g. "$150"
 * @param {string} feeStatus        - "Paid" | "Unpaid"
 */
export const updateVisaFee = async (id, consultationFee, feeStatus) => {
  const all = readAll();
  const updated = all.map((r) =>
    r.id === id ? { ...r, consultationFee, feeStatus } : r
  );
  writeAll(updated);
  return updated.find((r) => r.id === id);
};

/**
 * Admin schedules the meeting (date, time, type, link).
 * Separate function because scheduling is one specific admin action.
 *
 * @param {string} id
 * @param {{ appointmentDate, appointmentTime, meetingType, meetingLink }} schedule
 */
export const updateVisaSchedule = async (id, schedule) => {
  const all = readAll();
  const updated = all.map((r) =>
    r.id === id
      ? {
          ...r,
          appointmentDate: schedule.appointmentDate,
          appointmentTime: schedule.appointmentTime,
          meetingType: schedule.meetingType,
          meetingLink: schedule.meetingLink,
        }
      : r
  );
  writeAll(updated);
  return updated.find((r) => r.id === id);
};

/**
 * Student adds documents to their case.
 * Merges new documents into the existing documents array — never overwrites.
 *
 * @param {string} id       - visa request ID
 * @param {Array}  newDocs  - array of { id, name, type, size, url, uploadedAt }
 */
export const addDocumentsToVisaRequest = async (id, newDocs) => {
  const all = readAll();
  const updated = all.map((r) =>
    r.id === id
      ? { ...r, documents: [...(r.documents ?? []), ...newDocs] }
      : r
  );
  writeAll(updated);
  return updated.find((r) => r.id === id);
};

/**
 * Student deletes a single document from their case.
 * Only removes the document — all other fields stay unchanged.
 *
 * @param {string} caseId - visa request ID
 * @param {string} docId  - document ID to remove
 */
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

/**
 * Admin deletes a case.
 *
 * @param {string} id
 */
export const deleteVisaRequest = async (id) => {
  const all = readAll();
  writeAll(all.filter((r) => r.id !== id));
};

// ─────────────────────────────────────────────────────────────
//  FUTURE BACKEND SWAP — example
//
//  Before (localStorage):
//  export const getVisaRequests = async () => {
//    return readAll();
//  };
//
//  After (real API):
//  export const getVisaRequests = async () => {
//    const res = await fetch("/api/visa-requests", {
//      headers: { Authorization: `Bearer ${getToken()}` },
//    });
//    if (!res.ok) throw new Error("Failed to fetch visa requests");
//    return res.json();
//  };
//
//  The hooks and pages never change — they already await everything.
// ─────────────────────────────────────────────────────────────
