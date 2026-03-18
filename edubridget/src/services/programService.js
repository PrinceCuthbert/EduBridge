// src/services/programService.js
//
// WHY THIS FILE EXISTS:
//   Service/Model layer for university programs — mirrors applicationService.js
//   and visaService.js. The hooks and pages never touch localStorage directly.
//
// BACKEND SWAP:
//   Every function is async. To go live, replace the localStorage body with
//   an API call (fetch / axios). The hooks never change.
// ─────────────────────────────────────────────────────────────────────────────

import { MOCK_PROGRAMS } from "../data/mockData";

const STORAGE_KEY = "edubridge_programs";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Internal helpers ──────────────────a────────────────────────────────────────

const _read = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed mock data only in development — production starts empty.
      if (import.meta.env.DEV) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PROGRAMS));
        return [...MOCK_PROGRAMS];
      }
      return [];
    }
    return JSON.parse(data);
  } catch {
    return import.meta.env.DEV ? [...MOCK_PROGRAMS] : [];
  }
};

const _save = (programs) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));

// ── Read ──────────────────────────────────────────────────────────────────────

export const getPrograms = async () => {
  await delay();
  return _read();
};

export const getProgramById = async (id) => {
  await delay(300);
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  return _read().find((p) => p.id === numId) ?? null;
};

// ── Write ─────────────────────────────────────────────────────────────────────
// src/services/programService.js

export const createProgram = async (data) => {
  await delay();
  const all = _read();

  // 1. Simulate Backend Relational IDs
  const institutionId = Math.floor(Math.random() * 10000);

  // 2. THIS IS THE DTO MAPPER
  // We format the incoming UI data to perfectly match the SQL Database Schema

  const relationalPayload = {
    // --- 1. INSTITUTION TABLE ---
    institution: {
      id: institutionId,
      identity_id: data.representative_id || null, // FK from schema
      name: data.name,
      category: "University", // From DB schema
      location: JSON.stringify({ country: data.country, city: data.location }), // DB expects JSON
      phone: null, // Add to UI later if needed
      id_document: null, // FK from schema
      email: null, // Add to UI later if needed
    },

    // --- 2. DEPARTMENT & MAJOR TABLES ---
    // The backend will iterate through this array to populate DEPARTMENT, MAJOR, and DEPARTMENT_MAJOR
    departments_and_majors: data.departments.map((dept) => ({
      department: {
        institution_id: institutionId,
        category: dept.degree || "General",
      },
      major: {
        name: dept.major,
        language: dept.language,
        // Mapping your required documents array into the DB's JSON requirements column
        requirements: JSON.stringify(data.requiredDocuments),
      },
      // Note: Backend will insert these, get the IDs, and insert into DEPARTMENT_MAJOR
    })),

    // --- 3. FEES TABLE ---
    fees: data.tuitionFees.map((fee) => ({
      level: fee.level,
      amount: fee.amount,
      description: fee.item, // Mapped UI 'item' to DB 'description'
      status: data.status,
    })),

    // --- 4. ORPHAN DATA (Needs DB Updates) ---
    // These fields exist in your UI but DO NOT have columns in your ERD.
    // By grouping them here, you clearly tell your backend developer
    // "We need to add these columns/tables to the database."
    unmapped_frontend_data: {
      visa_type: data.visaType,
      logo_url: data.logo,
      application_link: data.applicationLink,
      // Timeline needs actual date columns added to APPLICATION_SCHEDULE
      schedules: data.timeline,
    },
  };

  // For the sake of the mock frontend working today, we save the flat 'data'
  // so the UI can read it back easily.
  // BUT in production, the backend will execute SQL INSERTs using the 'relationalPayload'.

  // ADD THIS LINE:
  console.log(
    "🚀 PAYLOAD SENDING TO BACKEND:",
    JSON.stringify(relationalPayload, null, 2),
  );

  const newProgram = {
    id: institutionId,
    ...data,
    _databaseMap: relationalPayload, // We attach it so you can inspect it in the browser!
    createdAt: new Date().toISOString(),
  };

  _save([...all, newProgram]);
  return newProgram;
};

export const updateProgram = async (id, data) => {
  await delay();
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  const all = _read();
  const idx = all.findIndex((p) => p.id === numId);
  if (idx === -1) throw new Error("Program not found");
  all[idx] = { ...all[idx], ...data, id: numId };
  _save(all);
  return all[idx];
};

export const deleteProgram = async (id) => {
  await delay();
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  const filtered = _read().filter((p) => p.id !== numId);
  _save(filtered);
  return true;
};
