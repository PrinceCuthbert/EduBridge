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
  { code: "CA", name: "Canada" },
  { code: "US", name: "USA" },
  { code: "GB", name: "UK" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "KR", name: "South Korea" },
];

// ── Meeting formats ───────────────────────────────────────────
export const MEETING_TYPES = ["Video Call", "In-Person", "Phone Call"];

// ── Helper: country code → flag emoji ────────────────────────
// Used by VisaSummary table and VisaCases table.
export const getCountryFlag = (code) => {
  if (!code) return "🌍";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
};

// ─────────────────────────────────────────────────────────────
//  SEED DATA
//  Simulates what the backend would return.
//  Shape matches the database APPLICATION table:
//    id, userId, status, submissionDate, ...visa-specific fields
// ─────────────────────────────────────────────────────────────
export const MOCK_VISA_REQUESTS = [
  {
    id: "VR-001",
    userId: "USR-002", // links to USER table
    // ── Form fields (from VisaRequestForm) ──
    fullName: "John Kariuki",
    email: "john.k@email.com",
    phone: "+254 712 000 001",
    countryOfOrigin: "Kenya",
    destination: "Canada",
    countryCode: "CA",
    visaType: "Study Visa",
    preferredDate: "2024-02-15",
    meetingType: "Video Call",
    notes: "Need help with student permit requirements.",
    // ── System-generated fields ──
    status: "In Progress",
    submissionDate: "2024-02-10",
    // ── Admin-only fields (student never sets these) ──
    consultationFee: "$150",
    feeStatus: "Paid",
    appointmentDate: "2024-02-15",
    appointmentTime: "10:00",
    meetingLink: "https://zoom.us/j/example",
    adminNotes: "",
  },
  {
    id: "VR-002",
    userId: "USR-002",
    fullName: "John Kariuki",
    email: "john.k@email.com",
    phone: "+254 712 000 001",
    countryOfOrigin: "Kenya",
    destination: "UK",
    countryCode: "GB",
    visaType: "Work Visa",
    preferredDate: "2024-02-18",
    meetingType: "In-Person",
    notes: "",
    status: "Approved",
    submissionDate: "2024-02-12",
    consultationFee: "$200",
    feeStatus: "Paid",
    appointmentDate: "2024-02-18",
    appointmentTime: "14:00",
    meetingLink: "",
    adminNotes: "All documents verified.",
  },
  {
    id: "VR-003",
    userId: "USR-002",
    fullName: "John Kariuki",
    email: "john.k@email.com",
    phone: "+254 712 000 001",
    countryOfOrigin: "Kenya",
    destination: "USA",
    countryCode: "US",
    visaType: "General Visit",
    preferredDate: "2024-02-20",
    meetingType: "Video Call",
    notes: "Tourist trip, 2 weeks.",
    status: "Pending Documents",
    submissionDate: "2024-02-14",
    consultationFee: "$100",
    feeStatus: "Unpaid",
    appointmentDate: "",
    appointmentTime: "",
    meetingLink: "",
    adminNotes: "",
  },
  // ── Extra records (other students — visible to admin only) ──
  {
    id: "VR-004",
    userId: "USR-002",
    fullName: "Sarah Wanjiku",
    email: "sarah.w@email.com",
    phone: "+254 722 000 002",
    countryOfOrigin: "Kenya",
    destination: "Australia",
    countryCode: "AU",
    visaType: "Study Visa",
    preferredDate: "2024-02-12",
    meetingType: "Video Call",
    notes: "",
    status: "New",
    submissionDate: "2024-02-08",
    consultationFee: "",
    feeStatus: "Unpaid",
    appointmentDate: "",
    appointmentTime: "",
    meetingLink: "",
    adminNotes: "",
  },
];
