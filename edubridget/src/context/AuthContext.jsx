import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";
import { processGoogleUser } from "../services/googleAuth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem("edubridge_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("edubridge_user");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // OPTIMIZATION: Wrap functions in useCallback so they don't recreate on every render
  const login = useCallback(async ({ email, password }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    let loggedInUser = null;

    if (email === 'admin@edubridge.africa' && password === 'admin123') {
      loggedInUser = {
        id: 'admin_01',
        name: 'Admin User',
        email: email,
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
      };
    } else if (email === 'student@test.com' && password === 'student123') {
      loggedInUser = {
        id: 'student_01',
        name: 'John Doe',
        email: email,
        role: 'student',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
      };
    }

    if (loggedInUser) {
      localStorage.setItem('edubridge_user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return loggedInUser;
    }

    throw new Error('Invalid email or password');
  }, []); // Empty dependency array means this function never changes

  const loginWithGoogle = useCallback(async (credential) => {
    try {
      const decoded = jwtDecode(credential);
      const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
      const newUser = processGoogleUser(decoded, adminEmails);

      localStorage.setItem("edubridge_user", JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (err) {
      throw new Error("Google authentication failed");
    }
  }, []);

  const signUp = useCallback(async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser = {
      id: `user_${Date.now()}`,
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      role: 'student',
      avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random`
    };

    localStorage.setItem('edubridge_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('edubridge_user');
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser(prev => {
      if (!prev) return null; // Safety check
      const updated = { ...prev, ...updates };
      localStorage.setItem('edubridge_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // OPTIMIZATION: Memoize the value object
  // This object will only reference a new location in memory if [user, loading] changes.
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