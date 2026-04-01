// ─────────────────────────────────────────────────────────────
//  src/services/visaService.js

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";

const COLLECTION = "visaCases";

// ── Internal helper ────────────────────────────────────────────
// Maps a Firestore DocumentSnapshot to a plain object with `id`.
const snapToData = (snap) => ({ id: snap.id, ...snap.data() });

// ─────────────────────────────────────────────────────────────
//  PUBLIC API
//  Every function is async — same signatures as before.
// ─────────────────────────────────────────────────────────────

/**
 * Return ALL visa cases.
 * Used by: admin dashboard (VisaCases.jsx, useAdminVisaCases)
 */
export const getVisaRequests = async () => {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map(snapToData);
};

/**
 * Return only the cases belonging to one student.
 * Used by: student dashboard (VisaSummary, useVisaConsultations)
 *
 * @param {string} userId - Firebase Auth UID
 */
export const getVisaRequestsByUserId = async (userId) => {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(snapToData);
};

/**
 * Return a single case by its Firestore document ID.
 * Used by: detail pages, upload form.
 *
 * @param {string} id
 * @returns {object|null}
 */
export const getVisaRequestById = async (id) => {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? snapToData(snap) : null;
};

/**
 * Student submits a new visa consultation request.
 *
 * What this function does that the caller does NOT:
 *  - Generates a unique Firestore document ID
 *  - Sets status to "New" (student cannot choose their own status)
 *  - Sets submissionDate to today (server-side moment)
 *  - Strips any admin-only fields the form might accidentally send
 *
 * @param {object} formData - fields from VisaRequestForm
 * @param {string} userId   - Firebase Auth UID from AuthContext
 */
export const createVisaRequest = async (formData, userId) => {
  // Auto-generate a Firestore doc ID (no uuidv4 needed)
  const newRef = doc(collection(db, COLLECTION));

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
    userId,
    status: "New",
    submissionDate: new Date().toISOString().split("T")[0],

    // ── Admin-only fields — always empty on creation ──
    consultationFee: "",
    feeStatus: "Unpaid",
    appointmentDate: "",
    appointmentTime: "",
    meetingLink: "",
    adminNotes: "",

    // ── Documents uploaded by student ──
    documents: [],
  };

  await setDoc(newRef, newRequest);
  return { id: newRef.id, ...newRequest };
};

/**
 * Student edits their own request (before it is reviewed).
 *
 * SECURITY: strips status, fee, and all admin-only fields.
 * A student cannot elevate their own status by editing.
 *
 * @param {string} id
 * @param {object} formData
 */
export const updateVisaRequest = async (id, formData) => {
  // Destructure out admin fields so they can never be overwritten
  const {
    status,
    consultationFee,
    feeStatus,
    appointmentDate,
    appointmentTime,
    meetingLink,
    adminNotes,
    userId,
    id: _id,
    submissionDate,
    documents,
    ...studentFields
  } = formData;

  const ref_ = doc(db, COLLECTION, id);
  await updateDoc(ref_, studentFields);

  // Return the updated document
  const snap = await getDoc(ref_);
  return snapToData(snap);
};

/**
 * Admin updates the status of a case.
 * ONLY changes the status field — nothing else.
 *
 * @param {string} id
 * @param {string} status
 */
export const updateVisaStatus = async (id, status) => {
  const ref_ = doc(db, COLLECTION, id);
  await updateDoc(ref_, { status });
  const snap = await getDoc(ref_);
  return snapToData(snap);
};

/**
 * Admin records the consultation fee and payment status.
 *
 * @param {string} id
 * @param {string} consultationFee  - e.g. "$150"
 * @param {string} feeStatus        - "Paid" | "Unpaid"
 */
export const updateVisaFee = async (id, consultationFee, feeStatus) => {
  const ref_ = doc(db, COLLECTION, id);
  await updateDoc(ref_, { consultationFee, feeStatus });
  const snap = await getDoc(ref_);
  return snapToData(snap);
};

/**
 * Admin schedules the meeting.
 *
 * @param {string} id
 * @param {{ appointmentDate, appointmentTime, meetingType, meetingLink }} schedule
 */
export const updateVisaSchedule = async (id, schedule) => {
  const ref_ = doc(db, COLLECTION, id);
  await updateDoc(ref_, {
    appointmentDate: schedule.appointmentDate,
    appointmentTime: schedule.appointmentTime,
    meetingType: schedule.meetingType,
    meetingLink: schedule.meetingLink,
  });
  const snap = await getDoc(ref_);
  return snapToData(snap);
};

/**
 * Upload a single file to Firebase Storage and return its download URL.
 * Path: visaCases/{userId}/{timestamp}_{filename}
 *
 * @param {File}   file
 * @param {string} userId - Firebase Auth UID
 * @returns {Promise<string>} download URL
 */
export const uploadVisaDocument = async (file, userId) => {
  const path = `visaCases/${userId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

/**
 * Student adds documents to their case.
 * Each doc object must already have a `url` (Firebase Storage download URL).
 * Uses Firestore arrayUnion — no read needed before write.
 *
 * @param {string} id       - visa case ID
 * @param {Array}  newDocs  - array of { id, name, type, size, url, uploadedAt, status }
 */
export const addDocumentsToVisaRequest = async (id, newDocs) => {
  const ref_ = doc(db, COLLECTION, id);
  await updateDoc(ref_, { documents: arrayUnion(...newDocs) });
  const snap = await getDoc(ref_);
  return snapToData(snap);
};

/**
 * Student deletes a single document from their case.
 *
 * @param {string} caseId - visa case ID
 * @param {string} docId  - document ID to remove
 */
export const deleteDocumentFromVisaRequest = async (caseId, docId) => {
  const ref_ = doc(db, COLLECTION, caseId);
  const snap = await getDoc(ref_);
  if (!snap.exists()) return null;

  const data = snapToData(snap);
  const filtered = (data.documents ?? []).filter((d) => d.id !== docId);
  await updateDoc(ref_, { documents: filtered });

  // Return updated case
  const updated = await getDoc(ref_);
  return snapToData(updated);
};

/**
 * Admin deletes a case entirely.
 *
 * @param {string} id
 */
export const deleteVisaRequest = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
