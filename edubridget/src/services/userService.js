// src/services/userService.js
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { db, auth } from "../firebase/config";

// ── Authentication (Firebase Auth + Firestore profile) ────────────────────────

export const registerUser = async (userData) => {
  // Step 1: Create the account in Firebase Auth (handles password securely)
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userData.email,
    userData.password
  );
  const uid = userCredential.user.uid;

  // Step 2: Build the profile — no password stored here, Firestore is public data only
  const roleName = userData.role || "student";
  const now = new Date().toISOString();
  const profile = {
    email: userData.email,
    username: userData.username || userData.email.split("@")[0],
    role: roleName,
    status: "Active",
    created_at: now,
    updated_at: now,
    permissions: roleName === "admin" ? ["all"] : ["view_own_app", "submit_app"],
    identity: {
      id: uuidv4(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      nationality: userData.nationality || null,
      gender: userData.gender || null,
      dob: userData.dateOfBirth || null,
      language: userData.language || "English",
      phone: userData.phoneNumber || null,
      id_document: null,
    },
    avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random`,
  };

  // Step 3: Save profile to Firestore using Firebase Auth uid as the document ID
  // setDoc (not addDoc) lets us control the document ID — uid links Auth ↔ Firestore
  await setDoc(doc(db, "users", uid), profile);

  return { id: uid, ...profile };
};

export const loginUser = async (email, password) => {
  // Firebase Auth verifies the password — we never touch it in Firestore
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Fetch the full profile from Firestore using the uid
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) throw new Error("User profile not found");

  return { id: uid, ...snapshot.data() };
};

export const loginWithGoogleToken = async (credential) => {
  // Exchange the Google JWT for a Firebase Auth credential
  const googleCredential = GoogleAuthProvider.credential(credential);
  const userCredential = await signInWithCredential(auth, googleCredential);
  const uid = userCredential.user.uid;
  const firebaseUser = userCredential.user;

  // Check if a Firestore profile already exists for this Google user
  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    // First-time Google login — create the profile
    const adminEmails =
      import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
    const isAdmin = adminEmails.includes(firebaseUser.email);
    const roleName = isAdmin ? "admin" : "student";
    const now = new Date().toISOString();

    const profile = {
      email: firebaseUser.email,
      username: firebaseUser.email.split("@")[0],
      role: roleName,
      status: "Active",
      created_at: now,
      updated_at: now,
      permissions: roleName === "admin" ? ["all"] : ["view_own_app", "submit_app"],
      identity: {
        id: uuidv4(),
        firstName: firebaseUser.displayName?.split(" ")[0] || "",
        lastName: firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
        nationality: null,
        gender: null,
        dob: null,
        language: "English",
        phone: null,
        id_document: null,
      },
      avatar: firebaseUser.photoURL,
    };

    await setDoc(ref, profile);
    return { id: uid, ...profile };
  }

  return { id: uid, ...snapshot.data() };
};

// ── Admin CRUD (Firestore) ────────────────────────────────────────────────────

// localStorage version:
// export const getUsers = async () => {
//   const users = _getUsersDB();
//   return users.map(({ password, salt, ...u }) => u);
// };
export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// localStorage version:
// export const getUserById = async (id) => {
//   const users = _getUsersDB();
//   const user = users.find((u) => u.id === id);
//   if (!user) throw new Error("User not found");
//   return user;
// };
export const getUserById = async (id) => {
  const ref = doc(db, "users", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) throw new Error("User not found");
  return { id: snapshot.id, ...snapshot.data() };
};

// localStorage version:
// export const createUser = async (formData) => {
//   return registerUser({ ...formData, phoneNumber: formData.phone });
// };
export const createUser = async (formData) => {
  const roleName = formData.role || "student";
  const now = new Date().toISOString();
  const newUser = {
    email: formData.email,
    username: formData.email.split("@")[0],
    role: roleName,
    status: formData.status || "Active",
    created_at: now,
    updated_at: now,
    permissions: roleName === "admin" ? ["all"] : ["view_own_app", "submit_app"],
    identity: {
      id: uuidv4(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      nationality: formData.nationality || null,
      gender: formData.gender || null,
      dob: formData.dateOfBirth || null,
      language: formData.language || "English",
      phone: formData.phone || null,
      id_document: null,
    },
    avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`,
  };
  const docRef = await addDoc(collection(db, "users"), newUser);
  return { id: docRef.id, ...newUser };
};

// localStorage version:
// export const updateUser = async (id, formData) => { ... localStorage logic ... };
export const updateUser = async (id, formData) => {
  const ref = doc(db, "users", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) throw new Error("User not found");

  const existing = snapshot.data();
  const roleName = formData.role ? formData.role.toLowerCase() : existing.role;

  const updates = {
    email: formData.email || existing.email,
    role: roleName,
    status: formData.status || existing.status,
    updated_at: new Date().toISOString(),
    permissions: roleName === "admin" ? ["all"] : ["view_own_app", "submit_app"],
    identity: {
      ...existing.identity,
      firstName: formData.firstName || existing.identity.firstName,
      lastName: formData.lastName || existing.identity.lastName,
      nationality: formData.nationality || existing.identity.nationality,
      phone: formData.phone || existing.identity.phone,
      gender: formData.gender || existing.identity.gender,
      dob: formData.dateOfBirth || existing.identity.dob,
      language: formData.language || existing.identity.language || "English",
    },
  };

  await updateDoc(ref, updates);
  return { id, ...existing, ...updates };
};

// localStorage version:
// export const deleteUser = async (id) => { ... filter localStorage ... };
export const deleteUser = async (id) => {
  await deleteDoc(doc(db, "users", id));
  return true;
};

// updatePassword will be migrated to Firebase Auth's updatePassword() in a later step
export const updatePassword = async (id, currentPassword, newPassword) => {
  throw new Error("Password update will be available after full Firebase Auth migration.");
};
