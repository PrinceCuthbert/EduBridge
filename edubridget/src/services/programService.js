// src/services/programService.js
//
// Service layer for university programs.
// All Firestore operations live here — hooks and pages never touch db directly.
// ─────────────────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from "uuid";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";

// ── Read ──────────────────────────────────────────────────────────────────────

export const getPrograms = async () => {
  const snapshot = await getDocs(collection(db, "programs"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getProgramById = async (id) => {
  const snapshot = await getDoc(doc(db, "programs", String(id)));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

// ── Write ─────────────────────────────────────────────────────────────────────

export const createProgram = async (data) => {
  const id = uuidv4();
  const now = new Date().toISOString();

  const newProgram = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  // DTO mapper log — kept for future SQL backend alignment
  // Shows how Firestore fields map to relational tables
  console.log("PROGRAM PAYLOAD TO FIRESTORE:", JSON.stringify({
    institution: {
      id,
      name: data.name,
      country: data.country,
      location: data.location,
      visaType: data.visaType,
    },
    departments_and_majors: (data.departments || []).map((dept) => ({
      degree: dept.degree,
      major: dept.major,
      language: dept.language,
      duration: dept.duration,
      credits: dept.credits,
      languageRequirement: dept.languageRequirement,
    })),
    fees: (data.tuitionFees || []).flatMap((group) =>
      (group.rows || []).flatMap((row) =>
        (row.amounts || []).map((amt, cIdx) => ({
          level: group.groupName,
          track: group.columns[cIdx],
          item: row.item,
          amount: amt,
          currency: group.currency,
        }))
      )
    ),
    timeline: data.timeline,
    requiredDocuments: data.requiredDocuments,
  }, null, 2));

  await setDoc(doc(db, "programs", id), newProgram);
  return newProgram;
};

export const updateProgram = async (id, data) => {
  const ref = doc(db, "programs", String(id));
  const updates = { ...data, updatedAt: new Date().toISOString() };
  await updateDoc(ref, updates);
  const updated = await getDoc(ref);
  return { id: updated.id, ...updated.data() };
};

export const deleteProgram = async (id) => {
  await deleteDoc(doc(db, "programs", String(id)));
  return true;
};
