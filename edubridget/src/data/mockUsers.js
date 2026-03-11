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

/**
 * MOCK_USERS — Represents the JOIN of USER and IDENTITY tables
 * * Schema Mapping:
 * - Top level properties map to USER table (id, email, password)
 * - 'identity' object maps to IDENTITY table (first_name, last_name, nationality, etc.)
 */
export const MOCK_USERS = [
  {
    id: "USR-001",
    email: "admin@edubridge.africa",
    username: "admin_super",
    password: "admin123", // In a real DB, this is a hashed string
    role: "admin",
    roleId: 1,
    identity: {
      firstName: "Super",
      lastName: "Admin",
      nationality: "Rwanda",
      phone: "+250788000000",
      gender: "Not Specified",
      date_birth: "1990-01-01",
      language: "English"
    },
    avatar: "https://ui-avatars.com/api/?name=Super+Admin&background=0D8ABC&color=fff"
  },
  {
    id: "USR-002",
    email: "student@test.com",
    username: "johndoe99",
    password: "student123",
    role: "student",
    roleId: 2,
    identity: {
      firstName: "John",
      lastName: "Doe",
      nationality: "Kenya",
      phone: "+254712345678",
      gender: "Male",
      date_birth: "2002-05-15",
      language: "English"
    },
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random"
  }
];