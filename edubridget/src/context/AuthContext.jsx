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

  const login = useCallback(async ({ email, password }) => {
    // Call the Model/Service
    const loggedInUser = await userService.loginUser(email, password);
    
    // Update the State
    localStorage.setItem('edubridge_user_session', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }, []); 

  const loginWithGoogle = useCallback(async (credential) => {
    try {
   // Call the Service(Model)
      const googleUser = await  userService.loginWithGoogleToken(credential);
      
      // Update the State
      localStorage.setItem("edubridge_user_session", JSON.stringify(googleUser));
      setUser(googleUser);
      return googleUser;
    } catch (err) {
      throw new Error("Google authentication failed");
    }
  }, []);

  const signUp = useCallback(async (userData) => {
    // Call the Service(Model)
    const newUser = await userService.registerUser(userData);
    
    // Update the State
    localStorage.setItem('edubridge_user_session', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('edubridge_user_session');
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