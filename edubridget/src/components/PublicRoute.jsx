import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isStudent } = useAuth();

  if (isAuthenticated) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (isStudent) {
      return <Navigate to="/dashboard" replace />;
    }
    // Fallback if role is unknown or valid but not handled above
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicRoute;
