// ─────────────────────────────────────────────────────────────
//  src/data/mockVisaData.js
//
//  WHY THIS FILE EXISTS:
//  Same role as mockData.js for the application module.
//  It holds seed records AND the lookup helpers the UI needs
//  (status colours, country flags, visa type list).
//
//  FUTURE BACKEND SWAP:
//  When the backend is ready, delete MOCK_VISA_REQUESTS and
//  CURRENT_USER_ID — nothing else in this file changes.
// ─────────────────────────────────────────────────────────────

// ── Status config (single source of truth for colours) ───────
// Every component that renders a status badge imports this.
// Add a new status here and every badge in the app updates.
export const VISA_STATUS_CONFIG = {
  New: {
    label: "New",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-500",
    icon: "clock",
  },
  "In Progress": {
    label: "In Progress",
    badge: "bg-yellow-50 text-yellow-700 border-yellow-100",
    dot: "bg-yellow-500",
    icon: "alert",
  },
  "Pending Documents": {
    label: "Pending Documents",
    badge: "bg-orange-50 text-orange-700 border-orange-100",
    dot: "bg-orange-500",
    icon: "upload",
  },
  Approved: {
    label: "Approved",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
    icon: "check",
  },
  Rejected: {
    label: "Rejected",
    badge: "bg-red-50 text-red-700 border-red-100",
    dot: "bg-red-500",
    icon: "x",
  },
};

// ── Visa types offered ────────────────────────────────────────
export const VISA_TYPES = [
  "Study Visa",
  "Work Visa",
  "Tourist Visa",
  "Business Visa",
  "Transit Visa",
  "Family Reunification",
];

// ── Supported destination countries ──────────────────────────
export const VISA_COUNTRIES = [
  { code: "KR", name: "South Korea" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];

// ── Meeting formats ───────────────────────────────────────────
export const MEETING_TYPES = ["Video Call", "In-Person", "Phone Call"];

// ── Helper: country code → flag emoji ────────────────────────
// Used by VisaSummary table and VisaCases table.
export const getCountryFlag = (code) => {
  if (!code) return "";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
};
