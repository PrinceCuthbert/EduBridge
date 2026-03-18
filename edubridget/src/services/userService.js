// src/services/userService.js
import { MOCK_ROLES, MOCK_USERS } from "../data/mockUsers";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "edubridge_db_users";

// Helper: Find Role ID by name
const getRoleId = (roleName) =>
  MOCK_ROLES.find((r) => r.name === roleName)?.id || 2;

// ── Internal DB Simulation ───────────────────────────────────────────────────

const _getUsersDB = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed demo accounts (admin + student) — permanent dev credentials.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS));
      return MOCK_USERS;
    }
    return JSON.parse(data);
  } catch {
    return MOCK_USERS;
  }
};

const _saveUsersDB = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// ── Authentication ───────────────────────────────────────────────────────────

export const registerUser = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const users = _getUsersDB();

  if (users.find((u) => u.email === userData.email)) {
    throw new Error("User with this email already exists");
  }

  const userId = uuidv4();
  const identityId = uuidv4();
  const roleName = userData.role || "student";
  const now = new Date().toISOString();

  const newUserDTO = {
    // ── USER table ─────────────────────────────────────────────────────────
    id: userId,
    email: userData.email,
    username: userData.username || userData.email.split("@")[0], // DB requires username
    password: userData.password, // backend hashes this + salt
    salt: null, // backend concern
    role: roleName,
    roleId: getRoleId(roleName),
    status: "Active",
    created_at: now,
    updated_at: now,
    permissions:
      roleName === "admin" ? ["all"] : ["view_own_app", "submit_app"],

    // ── IDENTITY table ──────────────────────────────────────────────────────
    // JS keys stay camelCase (firstName, lastName) — the real API service layer
    // will translate to snake_case (first_name, last_name) on fetch().
    identity: {
      id: identityId,
      user_id: userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      nationality: userData.nationality || null,
      gender: userData.gender || null,
      dob: userData.dateOfBirth || null, // ← DB column: dob
      language: userData.language || "English",
      phone: userData.phoneNumber || null, // NOTE: add phone VARCHAR to DB IDENTITY table
      id_document: null, // FK → SYSTEM_FILES
    },

    // ── Frontend helpers (not in DB) ───────────────────────────────────────
    avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random`,
  };

  users.push(newUserDTO);
  _saveUsersDB(users);

  const { password, salt, ...safeUser } = newUserDTO;
  return safeUser;
};

export const loginUser = async (identifier, providedPassword) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const users = _getUsersDB();

  // Accepts either email OR username — matches DB where both are unique
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === identifier.toLowerCase() ||
      u.username?.toLowerCase() === identifier.toLowerCase()
  );

  if (!user || user.password !== providedPassword) {
    throw new Error("Invalid email/username or password");
  }

  const { password, salt, ...safeUser } = user;
  return safeUser;
};

export const loginWithGoogleToken = async (credential) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const decoded = jwtDecode(credential);
  const adminEmails =
    import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
  const isAdmin = adminEmails.includes(decoded.email);
  const roleName = isAdmin ? "admin" : "student";
  const now = new Date().toISOString();

  const users = _getUsersDB();
  let user = users.find((u) => u.email === decoded.email);

  if (!user) {
    const userId = uuidv4();
    user = {
      id: userId,
      email: decoded.email,
      username: decoded.email.split("@")[0],
      password: null,
      salt: null,
      role: roleName,
      roleId: getRoleId(roleName),
      status: "Active",
      created_at: now,
      updated_at: now,
      permissions:
        roleName === "admin" ? ["all"] : ["view_own_app", "submit_app"],
      identity: {
        id: uuidv4(),
        user_id: userId,
        firstName: decoded.given_name || decoded.name || "",
        lastName: decoded.family_name || "",
        nationality: null,
        gender: null,
        dob: null,
        language: "English",
        phone: null,
        id_document: null,
      },
      avatar: decoded.picture,
    };
    users.push(user);
    _saveUsersDB(users);
  }

  const { password, salt, ...safeUser } = user;
  return safeUser;
};

// ── Admin CRUD ───────────────────────────────────────────────────────────────

export const getUsers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const users = _getUsersDB();
  return users.map(({ password, salt, ...safeUser }) => safeUser);
};

export const getUserById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const users = _getUsersDB();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error("User not found");
  const { password, salt, ...safeUser } = user;
  return safeUser;
};

export const createUser = async (formData) => {
  // Admin form uses 'phone'; registerUser expects 'phoneNumber'
  return registerUser({ ...formData, phoneNumber: formData.phone });
};

export const updateUser = async (id, formData) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const users = _getUsersDB();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");

  const roleName = formData.role
    ? formData.role.toLowerCase()
    : users[idx].role;

  users[idx] = {
    ...users[idx],
    email: formData.email || users[idx].email,
    role: roleName,
    roleId: getRoleId(roleName),
    status: formData.status || users[idx].status,
    updated_at: new Date().toISOString(),
    identity: {
      ...users[idx].identity,
      firstName: formData.firstName || users[idx].identity.firstName,
      lastName: formData.lastName || users[idx].identity.lastName,
      nationality: formData.nationality || users[idx].identity.nationality,
      phone: formData.phone || users[idx].identity.phone,
      gender: formData.gender || users[idx].identity.gender,
      dob: formData.dateOfBirth || users[idx].identity.dob, // ← was date_birth
      language: formData.language || users[idx].identity.language || "English",
    },
  };

  _saveUsersDB(users);
  const { password, salt, ...safeUser } = users[idx];
  return safeUser;
};

export const deleteUser = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  let users = _getUsersDB();
  users = users.filter((u) => u.id !== id);
  _saveUsersDB(users);
  return true;
};

export const updatePassword = async (id, currentPassword, newPassword) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const users = _getUsersDB();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  if (users[idx].password !== currentPassword)
    throw new Error("Current password is incorrect");
  users[idx] = {
    ...users[idx],
    password: newPassword,
    updated_at: new Date().toISOString(),
  };
  _saveUsersDB(users);
  return true;
};
