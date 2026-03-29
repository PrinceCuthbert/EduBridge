// src/services/userService.js
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
  runTransaction,
} from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import { db, auth, firebaseConfig } from "../firebase/config";

// ── Authentication (Firebase Auth + Firestore profile) ────────────────────────

export const registerUser = async (userData) => {
  const desiredUsername = userData.username || userData.email.split("@")[0];

  // Step 1: Create Firebase Auth account first to get the uid
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    userData.email,
    userData.password,
  );
  const uid = userCredential.user.uid;

  const roleName = userData.role || "student";
  const now = new Date().toISOString();
  const profile = {
    uid,
    email: userData.email,
    username: desiredUsername,
    role: roleName,
    status: "Active",
    created_at: now,
    updated_at: now,
    permissions:
      roleName === "admin" ? ["all"] : ["view_own_app", "submit_app"],
    identity: {
      id: uid,
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

  try {
    // Step 2: Atomically claim the username and write the user profile.
    // runTransaction guarantees no two users can claim the same username simultaneously.
    await runTransaction(db, async (transaction) => {
      const usernameRef = doc(db, "usernames", desiredUsername);
      const usernameSnap = await transaction.get(usernameRef);

      if (usernameSnap.exists()) {
        throw new Error(
          `Username "${desiredUsername}" is already taken. Please choose another.`,
        );
      }

      transaction.set(usernameRef, { uid }); // claim the username
      transaction.set(doc(db, "users", uid), profile); // write the user profile
    });
  } catch (err) {
    // Transaction failed — delete the Auth account so it doesn't orphan
    await userCredential.user.delete();
    throw err;
  }

  return { id: uid, ...profile };
};

export const loginUser = async (identifier, password) => {
  // If identifier is not an email, look up the email by username in Firestore first
  let email = identifier;
  const isEmail = identifier.includes("@");

  if (!isEmail) {
    const q = query(
      collection(db, "users"),
      where("username", "==", identifier),
    );
    const result = await getDocs(q);

    if (result.empty) throw new Error("No account found with that username.");
    email = result.docs[0].data().email;
  }

  // Firebase Auth verifies the password — we never touch it in Firestore
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const uid = userCredential.user.uid;

  // Fetch the full profile from Firestore using the uid
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) throw new Error("User profile not found");

  const profile = snapshot.data();
  if (profile.status === "Inactive") {
    await userCredential.user.getIdToken(); // ensure auth is fresh before signing out
    await auth.signOut();
    throw new Error("Your account has been deactivated. Please contact support.");
  }

  return { id: uid, ...profile };
};

export const loginWithGoogle = async () => {
  // Firebase opens the Google OAuth popup directly — no third-party token exchange needed
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
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
      uid: uid,
      email: firebaseUser.email,
      username: firebaseUser.email.split("@")[0],
      role: roleName,
      status: "Active",
      created_at: now,
      updated_at: now,
      permissions:
        roleName === "admin" ? ["all"] : ["view_own_app", "submit_app"],
      identity: {
        id: uid,
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

  const profile = snapshot.data();
  if (profile.status === "Inactive") {
    await auth.signOut();
    throw new Error("Your account has been deactivated. Please contact support.");
  }

  return { id: uid, ...profile };
};

// ── Admin CRUD (Firestore) ────────────────────────────────────────────────────

export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};



export const getUserById = async (id) => {
  const ref = doc(db, "users", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) throw new Error("User not found");
  return { id: snapshot.id, ...snapshot.data() };
};

export const createUser = async (formData) => {
  if (!formData.password) throw new Error("An initial password is required.");

  const desiredUsername = formData.username || formData.email.split("@")[0];
  const roleName = formData.role || "student";
  const now = new Date().toISOString();

  // ── Step 1: Create Firebase Auth account in a secondary app instance ─────────
  // Using a secondary app prevents signing out the currently logged-in admin.
  const secondaryApp = initializeApp(firebaseConfig, "adminCreateUser");
  const secondaryAuth = getAuth(secondaryApp);
  let uid;

  try {
    const credential = await createUserWithEmailAndPassword(
      secondaryAuth,
      formData.email,
      formData.password,
    );
    uid = credential.user.uid; // real Firebase Auth UID
  } finally {
    // Always clean up the secondary app — whether creation succeeded or failed
    await secondaryAuth.signOut();
    await deleteApp(secondaryApp);
  }

  // ── Step 2: Write the Firestore profile using the real UID ───────────────────
  const newUser = {
    uid,
    email: formData.email,
    username: desiredUsername,
    role: roleName,
    status: formData.status || "Active",
    created_at: now,
    updated_at: now,
    permissions:
      roleName === "admin" ? ["all"] : ["view_own_app", "submit_app"],
    identity: {
      id: uid,
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

  await runTransaction(db, async (transaction) => {
    const usernameRef = doc(db, "usernames", desiredUsername);
    const usernameSnap = await transaction.get(usernameRef);
    if (usernameSnap.exists()) {
      throw new Error(`Username "${desiredUsername}" is already taken.`);
    }
    transaction.set(usernameRef, { uid });
    transaction.set(doc(db, "users", uid), newUser);
  });

  return { id: uid, ...newUser };
};

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
    permissions:
      roleName === "admin" ? ["all"] : ["view_own_app", "submit_app"],
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

export const deleteUser = async (id) => {
  await deleteDoc(doc(db, "users", id));
  return true;
};

export const updatePassword = async (id, currentPassword, newPassword) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("You must be logged in to change your password.");

  // Firebase requires re-authentication before sensitive operations.
  // If the user logged in a long time ago, this refreshes their session.
  const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
  await reauthenticateWithCredential(currentUser, credential);

  await firebaseUpdatePassword(currentUser, newPassword);
  return true;
};
