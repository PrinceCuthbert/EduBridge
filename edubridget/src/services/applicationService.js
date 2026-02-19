// src/services/applicationService.js
// Data layer for applications — swap localStorage calls for fetch() to connect a real backend.

const STORAGE_KEY = "edubridge_applications";

const generateId = () =>
  `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// ── Read ────────────────────────────────────────────────────────────────────

export const getApplications = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

export const getApplicationsByUserId = (userId) =>
  getApplications().filter((app) => app.userId === userId);

export const getApplicationById = (id) =>
  getApplications().find((app) => app.id === id) || null;

// ── Write ────────────────────────────────────────────────────────────────────

const saveApplications = (apps) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));

export const createApplication = (data) => {
  const apps = getApplications();
  const newApp = {
    ...data,
    id: generateId(),
    status: "Pending",
    submissionDate: new Date().toISOString().split("T")[0],
  };
  apps.push(newApp);
  saveApplications(apps);
  return newApp;
};

/** Student-editable update — status can never be changed through this function. */
export const updateApplication = (id, data) => {
  const apps = getApplications();
  const idx = apps.findIndex((app) => app.id === id);
  if (idx === -1) throw new Error("Application not found");

  const { status, ...safeData } = data; // strip status intentionally
  apps[idx] = { ...apps[idx], ...safeData };
  saveApplications(apps);
  return apps[idx];
};

/** Admin-only status update. */
export const updateApplicationStatus = (id, status) => {
  const apps = getApplications();
  const idx = apps.findIndex((app) => app.id === id);
  if (idx === -1) throw new Error("Application not found");

  apps[idx].status = status;
  saveApplications(apps);
  return apps[idx];
};

export const deleteApplication = (id) => {
  const apps = getApplications().filter((app) => app.id !== id);
  saveApplications(apps);
  return true;
};
