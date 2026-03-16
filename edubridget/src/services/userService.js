// src/services/userService.js
import { MOCK_ROLES, MOCK_USERS } from "../data/mockUsers";
import { jwtDecode } from "jwt-decode";

const STORAGE_KEY = "edubridge_db_users";

// Helper: Find Role ID
const getRoleId = (roleName) => MOCK_ROLES.find(r => r.name === roleName)?.id || 2; 

// --- Internal DB Simulation ---
const _getUsersDB = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Always seed the demo accounts (admin + student) in both dev and prod.
      // These are the permanent demo credentials shown on the sign-in page.
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

// ── Authentication API Methods (Moved from authService.js) ────────

export const registerUser = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const users = _getUsersDB();
  
  if (users.find(u => u.email === userData.email)) {
    throw new Error("User with this email already exists");
  }

  const userId = `USR-${Date.now()}`;
  const roleName = userData.role || "student";

  const newUserDTO = {
    id: userId,
    email: userData.email,
    password: userData.password, 
    role: roleName,
    roleId: getRoleId(roleName),
    status: "Active",
    identity: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      nationality: userData.nationality, 
      phone: userData.phoneNumber,
      gender: userData.gender, 
      date_birth: userData.dateOfBirth
    },
    avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random`
  };

  users.push(newUserDTO);
  _saveUsersDB(users);

  const { password, ...safeUser } = newUserDTO;
  return safeUser;
};

export const loginUser = async (email, providedPassword) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const users = _getUsersDB();
  const user = users.find(u => u.email === email);

  if (!user || user.password !== providedPassword) {
    throw new Error("Invalid email or password");
  }

  const { password, ...safeUser } = user;
  return safeUser;
};

export const loginWithGoogleToken = async (credential) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const decoded = jwtDecode(credential);
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
  const isAdmin = adminEmails.includes(decoded.email);
  const roleName = isAdmin ? "admin" : "student";

  const users = _getUsersDB();
  let user = users.find(u => u.email === decoded.email);

  if (!user) {
    user = {
      id: decoded.sub || `google_${Date.now()}`,
      email: decoded.email,
      password: null, 
      role: roleName,
      roleId: getRoleId(roleName),
      status: "Active",
      identity: {
        firstName: decoded.given_name || decoded.name,
        lastName: decoded.family_name || "",
        nationality: null,
        phone: null,
      },
      avatar: decoded.picture
    };
    users.push(user);
    _saveUsersDB(users);
  }

  const { password, ...safeUser } = user;
  return safeUser;
};

// ── Admin CRUD API Methods ──────────────────────────────────────

export const getUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const users = _getUsersDB();
  return users.map(({ password, ...safeUser }) => safeUser);
};

export const getUserById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const users = _getUsersDB();
  const user = users.find(u => u.id === id);
  
  if (!user) throw new Error("User not found");
  
  const { password, ...safeUser } = user;
  return safeUser;
};

export const createUser = async (formData) => {
  // Uses the exact same logic as registerUser, just mapped from a different form
  return registerUser({
    ...formData,
    phoneNumber: formData.phone // map admin form 'phone' to auth 'phoneNumber'
  }); 
};

export const updateUser = async (id, formData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const users = _getUsersDB();
  const idx = users.findIndex(u => u.id === id);
  
  if (idx === -1) throw new Error("User not found");

  const roleName = formData.role ? formData.role.toLowerCase() : users[idx].role;

  users[idx] = {
    ...users[idx],
    email: formData.email || users[idx].email,
    role: roleName,
    roleId: getRoleId(roleName),
    status: formData.status || users[idx].status,
    identity: {
      ...users[idx].identity,
      firstName: formData.firstName || users[idx].identity.firstName,
      lastName: formData.lastName || users[idx].identity.lastName,
      nationality: formData.nationality || users[idx].identity.nationality,
      phone: formData.phone || users[idx].identity.phone,
      gender: formData.gender || users[idx].identity.gender,
      date_birth: formData.dateOfBirth || users[idx].identity.date_birth,
      language: formData.language || users[idx].identity?.language || ''
    }
  };

  _saveUsersDB(users);
  const { password, ...safeUser } = users[idx];
  return safeUser;
};

export const deleteUser = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  let users = _getUsersDB();
  users = users.filter(u => u.id !== id);
  _saveUsersDB(users);
  return true;
};

export const updatePassword = async (id, currentPassword, newPassword) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const users = _getUsersDB();
  const idx = users.findIndex(u => u.id === id);

  if (idx === -1) throw new Error("User not found");

  if (users[idx].password !== currentPassword) {
    throw new Error("Current password is incorrect");
  }

  users[idx] = { ...users[idx], password: newPassword };
  _saveUsersDB(users);
  return true;
};