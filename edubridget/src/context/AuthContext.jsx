// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import * as userService from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase Auth manages session automatically — onAuthStateChanged fires on
  // every page load if the user is already logged in (no localStorage needed).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Auth knows WHO is logged in — Firestore has the full profile
        const snapshot = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snapshot.exists()) {
          const profile = snapshot.data();
          if (profile.status === "Inactive") {
            // Account was deactivated after login — kill the session immediately
            await firebaseSignOut(auth);
            setUser(null);
          } else {
            setUser({ id: firebaseUser.uid, ...profile });
          }
        } else {
          // Auth account exists but no Firestore profile (edge case)
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // cleanup listener on unmount
  }, []);

  const login = useCallback(async ({ identifier, password }) => {
    const result = await userService.loginUser(identifier, password);
    setUser(result);
    return result;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const result = await userService.loginWithGoogle();
    setUser(result);
    return result;
  }, []);

  const signUp = useCallback(async (userData) => {
    const result = await userService.registerUser(userData);
    setUser(result);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut(auth); // Firebase clears its own session
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (formData) => {
      const updatedUser = await userService.updateUser(user.id, formData);
      setUser((prev) => ({ ...prev, ...updatedUser }));
      return updatedUser;
    },
    [user],
  );

  // ── Permission checking ────────────────────────────────────────────────────
  const DEFAULT_ROLE_PERMISSIONS = useMemo(
    () => ({
      admin: ["all"],
      student: ["view_own_app", "submit_app", "edit_profile"],
      staff: ["view_apps", "update_app_status"],
    }),
    [],
  );

  const hasPermission = useCallback(
    (permissionName) => {
      if (!user) return false;
      const perms =
        user.permissions ??
        DEFAULT_ROLE_PERMISSIONS[user.role?.toLowerCase()] ??
        [];
      return perms.includes("all") || perms.includes(permissionName);
    },
    [user, DEFAULT_ROLE_PERMISSIONS],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      loginWithGoogle,
      signUp,
      logout,
      updateProfile,
      hasPermission,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      isStudent: user?.role === "student",
    }),
    [
      user,
      loading,
      login,
      loginWithGoogle,
      signUp,
      logout,
      updateProfile,
      hasPermission,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
