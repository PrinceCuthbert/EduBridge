// src/services/applicationService.js
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";

// ── Read ─────────────────────────────────────────────────────────────────────

export const getApplications = async () => {
  const snapshot = await getDocs(collection(db, "applications"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getApplicationsByUserId = async (userId) => {
  const q = query(
    collection(db, "applications"),
    where("userId", "==", userId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getApplicationById = async (id) => {
  const snapshot = await getDoc(doc(db, "applications", id));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

// ── Write ─────────────────────────────────────────────────────────────────────

export const createApplication = async (data) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("You must be logged in to submit an application.");

  const trackerId = uuidv4();
  const newApp = {
    trackerId,
    programId: data.programId || "",
    submissionDate: new Date().toISOString(),
    status: "Pending",
    userId: uid,
    applicant: data.applicant || {
      identityId: uid,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
    },
    programDetails: data.programDetails || {
      universityName: data.universityName || "",
      majorName: data.programName || data.departmentName || "",
    },
    trackerStages: [
      {
        stage: "Submitted",
        completed: true,
        date: new Date().toISOString().split("T")[0],
      },
      { stage: "Under Review", completed: false, date: null },
      { stage: "Decision", completed: false, date: null },
      { stage: "Admitted", completed: false, date: null },
    ],
    documents: data.documents || [],
    fee: {
      amount: data.fee?.amount ?? null,
      currency: data.fee?.currency ?? null,
      status: "Pending",
    },
  };

  await setDoc(doc(db, "applications", trackerId), newApp);
  return newApp;
};

export const updateApplication = async (id, data) => {
  const ref = doc(db, "applications", id);
  // Strip status and trackerStages — students cannot change these
  const { status, trackerStages, ...safeData } = data;
  await updateDoc(ref, safeData);
  const updated = await getDoc(ref);
  return { id: updated.id, ...updated.data() };
};

/** Admin-only: update application status */
export const updateApplicationStatus = async (id, status) => {
  const ref = doc(db, "applications", id);
  await updateDoc(ref, { status });
  const updated = await getDoc(ref);
  return { id: updated.id, ...updated.data() };
};

/** Admin-only: update tracker stages */
export const updateTrackerStages = async (id, stages) => {
  const ref = doc(db, "applications", id);
  await updateDoc(ref, { trackerStages: stages });
  const updated = await getDoc(ref);
  return { id: updated.id, ...updated.data() };
};

export const deleteApplication = async (id) => {
  await deleteDoc(doc(db, "applications", id));
  return true;
};
