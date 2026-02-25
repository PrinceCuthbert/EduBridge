// src/services/applicationService.js
// Data layer for applications — swap localStorage calls for fetch() to connect a real backend.

const STORAGE_KEY = "edubridge_applications";

const generateId = () =>
  `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Simulate network latency
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Internal synchronous read
const _getApps = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

const _saveApps = (apps) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));

// ── Read ────────────────────────────────────────────────────────────────────

export const getApplications = async () => {
  await delay();
  return _getApps();
};

export const getApplicationsByUserId = async (userId) => {
  await delay();
  // Compare as strings to handle number/string type mismatches (e.g. userId=1 vs "1")
  return _getApps().filter((app) => String(app.userId) === String(userId));
};

export const getApplicationById = async (id) => {
  await delay();
  return _getApps().find((app) => app.id === id) || null;
};

// Synchronous version for components that cannot use async (e.g. edit-mode load in useEffect)
export const getApplicationByIdSync = (id) =>
  _getApps().find((app) => app.id === id) || null;

// ── Write ────────────────────────────────────────────────────────────────────

export const createApplication = async (data) => {
  await delay();
  const apps = _getApps();
  const newApp = {
    ...data,
    id: generateId(),
    status: "Pending",
    submissionDate: new Date().toISOString().split("T")[0],
  };
  apps.push(newApp);
  _saveApps(apps);
  return newApp;
};

/** Student-editable update — status can never be changed through this function. */
export const updateApplication = async (id, data) => {
  await delay();
  const apps = _getApps();
  const idx = apps.findIndex((app) => app.id === id);
  if (idx === -1) throw new Error("Application not found");

  const { status, ...safeData } = data; // strip status intentionally
  apps[idx] = { ...apps[idx], ...safeData };
  _saveApps(apps);
  return apps[idx];
};

/** Admin-only status update. */
export const updateApplicationStatus = async (id, status) => {
  await delay();
  const apps = _getApps();
  const idx = apps.findIndex((app) => app.id === id);
  if (idx === -1) throw new Error("Application not found");

  apps[idx].status = status;
  _saveApps(apps);
  return apps[idx];
};

export const deleteApplication = async (id) => {
  await delay();
  const apps = _getApps().filter((app) => app.id !== id);
  _saveApps(apps);
  return true;
};
