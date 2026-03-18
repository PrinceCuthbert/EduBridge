// src/data/mockUsers.js

/**
 * MOCK_ROLES — Matches the ROLE table in your schema
 * Schema: ROLE { id, role_name }
 */
export const MOCK_ROLES = [
  { id: 1, name: "admin",   description: "Full system access. Can manage all content, users, and applications." },
  { id: 2, name: "student", description: "Can browse programs, submit applications, and track visa status." },
  { id: 3, name: "staff",   description: "Can review applications and update statuses. No admin access." },
];

// Stable seed UUIDs — used by mockVisaData.js and mockData.js to link records.
// Format: 00000000-0000-0000-0000-00000000000X  (X = seat number, easy to grep)
export const SEED_USER_IDS = {
  ADMIN:   "00000000-0000-0000-0000-000000000001",
  STUDENT: "00000000-0000-0000-0000-000000000002",
};

/**
 * MOCK_USERS — Represents the JOIN of USER + IDENTITY tables.
 *
 * Field mapping:
 *   Top-level  → USER table   (id, email, username, password, salt, roleId, created_at, updated_at)
 *   identity   → IDENTITY table (id, user_id, first_name→firstName, last_name→lastName,
 *                                nationality, gender, dob, language, phone, id_document)
 *
 * NOTE on casing: JS objects use camelCase (firstName, lastName).
 * The service layer will translate to snake_case (first_name, last_name) when the real API is wired.
 * Exception: 'dob' — already short, same in both JS and DB.
 */
export const MOCK_USERS = [
  {
    // ── USER table ──────────────────────────────────────────
    id:         SEED_USER_IDS.ADMIN,
    email:      "admin@edubridge.africa",
    username:   "admin_super",
    password:   "admin123",   // backend hashes this + generates salt
    salt:       null,          // backend concern
    role:       "admin",
    roleId:     1,
    status:     "Active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    permissions: ["all"],

    // ── IDENTITY table ───────────────────────────────────────
    identity: {
      id:          "00000000-0000-0000-0001-000000000001",
      user_id:     SEED_USER_IDS.ADMIN,
      firstName:   "Super",
      lastName:    "Admin",
      nationality: "Rwanda",
      phone:       "+250788000000",
      gender:      "Not Specified",
      dob:         "1990-01-01",      // ← was date_birth
      language:    "English",
      id_document: null,              // FK → SYSTEM_FILES
    },

    // ── Frontend helpers (ignored by DB) ────────────────────
    avatar: "https://ui-avatars.com/api/?name=Super+Admin&background=0D8ABC&color=fff",
  },
  {
    // ── USER table ──────────────────────────────────────────
    id:         SEED_USER_IDS.STUDENT,
    email:      "student@test.com",
    username:   "johndoe99",
    password:   "student123",
    salt:       null,
    role:       "student",
    roleId:     2,
    status:     "Active",
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: "2024-01-15T00:00:00.000Z",
    permissions: ["view_own_app", "submit_app"],

    // ── IDENTITY table ───────────────────────────────────────
    identity: {
      id:          "00000000-0000-0000-0002-000000000002",
      user_id:     SEED_USER_IDS.STUDENT,
      firstName:   "John",
      lastName:    "Doe",
      nationality: "Kenya",
      phone:       "+254712345678",
      gender:      "Male",
      dob:         "2002-05-15",      // ← was date_birth
      language:    "English",
      id_document: null,
    },

    // ── Frontend helpers ────────────────────────────────────
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
  },
];
