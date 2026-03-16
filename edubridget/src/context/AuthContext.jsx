// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import * as userService from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem("edubridge_user_session");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem("edubridge_user_session");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Persist session: stores user object + JWT token (if backend provides one).
  // When backend sends { token, user } instead of just the user object,
  // the token is stored under 'token' so axios interceptors in api/services.js can read it.
  const _persistSession = (result) => {
    const user = result?.user ?? result;
    const token = result?.token ?? null;
    localStorage.setItem('edubridge_user_session', JSON.stringify(user));
    if (token) {
      localStorage.setItem('token', token);
    }
    return user;
  };

  const login = useCallback(async ({ email, password }) => {
    const result = await userService.loginUser(email, password);
    const loggedInUser = _persistSession(result);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    try {
      const result = await userService.loginWithGoogleToken(credential);
      const googleUser = _persistSession(result);
      setUser(googleUser);
      return googleUser;
    } catch (err) {
      throw new Error("Google authentication failed");
    }
  }, []);

  const signUp = useCallback(async (userData) => {
    const result = await userService.registerUser(userData);
    const newUser = _persistSession(result);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('edubridge_user_session');
    localStorage.removeItem('token');
    setUser(null);
  }, []);

 // AFTER (writes to DB first, then syncs session)
const updateProfile = useCallback(async (formData) => {
  // 1. Write to the DB (same store as userService)
  const updatedUser = await userService.updateUser(user.id, formData);
  // 2. Sync the session so UI stays up-to-date
  const sessionUser = { ...user, ...updatedUser };
  localStorage.setItem('edubridge_user_session', JSON.stringify(sessionUser));
  setUser(sessionUser);
  return updatedUser;
}, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    loginWithGoogle,
    signUp,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  }), [user, loading, login, loginWithGoogle, signUp, logout, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};