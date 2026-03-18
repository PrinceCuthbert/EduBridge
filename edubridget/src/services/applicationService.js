// src/services/applicationService.js
import { MOCK_UNIFIED_APPLICATIONS } from "../data/mockData";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "edubridge_applications";

// Simulate network latency
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Internal synchronous read — seeds mock data in development only.
const _getApps = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed mock data only in development — production starts empty.
      if (import.meta.env.DEV) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(MOCK_UNIFIED_APPLICATIONS),
        );
        return MOCK_UNIFIED_APPLICATIONS;
      }
      return [];
    }
    return JSON.parse(data);
  } catch {
    return import.meta.env.DEV ? MOCK_UNIFIED_APPLICATIONS : [];
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
  const id = String(userId);
  return _getApps().filter(
    (app) =>
      String(app.applicant?.identityId) === id || String(app.userId) === id,
  );
};

export const getApplicationById = async (id) => {
  await delay();
  // Changed app.id to app.trackerId
  return _getApps().find((app) => app.trackerId === id) || null;
};

export const getApplicationByIdSync = (id) =>
  _getApps().find((app) => app.trackerId === id) || null;

// ── Write ────────────────────────────────────────────────────────────────────

export const createApplication = async (data) => {
  await delay();
  const apps = _getApps();

  // Build the new DTO structure when a student applies
  const newApp = {
    trackerId: uuidv4(),
    applicationId: Math.floor(Math.random() * 10000), // Simulated DB auto-increment
    submissionDate: new Date().toISOString(),
    status: "Pending",
    userId: data.userId || null, // top-level for quick filtering
    applicant: data.applicant || {
      identityId: data.userId || null,
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
      { stage: "Enrolled", completed: false, date: null },
    ],
    documents: data.documents || [],
  };

  apps.push(newApp);
  _saveApps(apps);
  return newApp;
};

export const updateApplication = async (id, data) => {
  await delay();
  const apps = _getApps();
  const idx = apps.findIndex((app) => app.trackerId === id);
  if (idx === -1) throw new Error("Application not found");

  const { status, trackerStages, ...safeData } = data; // Prevent student from changing status/stages
  apps[idx] = { ...apps[idx], ...safeData };
  _saveApps(apps);
  return apps[idx];
};

/** Admin-only status update. */
export const updateApplicationStatus = async (id, status) => {
  await delay();
  const apps = _getApps();
  const idx = apps.findIndex((app) => app.trackerId === id);
  if (idx === -1) throw new Error("Application not found");

  apps[idx].status = status;
  _saveApps(apps);
  return apps[idx];
};

/** NEW: Admin-only Tracker Stages update. */
export const updateTrackerStages = async (id, stages) => {
  await delay();
  const apps = _getApps();
  const idx = apps.findIndex((app) => app.trackerId === id);
  if (idx === -1) throw new Error("Application not found");

  apps[idx].trackerStages = stages;
  _saveApps(apps);
  return apps[idx];
};

export const deleteApplication = async (id) => {
  await delay();
  const apps = _getApps().filter((app) => app.trackerId !== id);
  _saveApps(apps);
  return true;
};
