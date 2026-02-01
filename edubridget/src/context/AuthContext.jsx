
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * 
 * Manages the global authentication state of the application.
 * It checks for existing sessions on mount and provides login/logout methods
 * to the rest of the app via the useAuth hook.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('edubridge_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from local storage", error);
        localStorage.removeItem('edubridge_user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Mock Login Function
   * 
   * Simulates an API call with a timeout.
   * Checks credentials against hardcoded dummy users for demonstration purposes.
   * 
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - Resolves with user object or rejects with error message
   */
  const login = async ({ email, password }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dummy Admin Credentials
    if (email === 'admin@edubridge.africa' && password === 'admin123') {
      const adminUser = {
        id: 'admin_01',
        name: 'Admin User',
        email: email,
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
      };
      localStorage.setItem('edubridge_user', JSON.stringify(adminUser));
      setUser(adminUser);
      return adminUser;
    }

    // Dummy Student Credentials
    if (email === 'student@test.com' && password === 'student123') {
      const studentUser = {
        id: 'student_01',
        name: 'John Doe',
        email: email,
        role: 'student',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
      };
      localStorage.setItem('edubridge_user', JSON.stringify(studentUser));
      setUser(studentUser);
      return studentUser;
    }

    // Invalid Credentials
    throw new Error('Invalid email or password');
  };

  /**
   * Logout Function
   * 
   * Clears user state and removes data from localStorage.
   */
  const logout = () => {
    localStorage.removeItem('edubridge_user');
    setUser(null);
    // Optional: Redirect to login page logic handles this via ProtectedRoute state change or manually in UI
  };

  /**
   * Update Profile Function
   * Allows updating the current user's details without re-logging
   */
  const updateProfile = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('edubridge_user', JSON.stringify(updated));
      return updated;
    });
  };

  // Values exposed to consumers
  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * 
 * Custom hook to easily consume the AuthContext.
 * Throws an error if used outside of AuthProvider to ensure proper usage.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
