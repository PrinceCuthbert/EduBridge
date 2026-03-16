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

// ── Internal helpers ──────────────────────────────────────────────────────────

const _read = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PROGRAMS));
      return [...MOCK_PROGRAMS];
    }
    return JSON.parse(data);
  } catch {
    return [...MOCK_PROGRAMS];
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

export const createProgram = async (data) => {
  await delay();
  const all = _read();
  const newId = Math.max(...all.map((p) => p.id), 0) + 1;
  const newProgram = {
    id: newId,
    ...data,
    status: data.status || "Active",
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
