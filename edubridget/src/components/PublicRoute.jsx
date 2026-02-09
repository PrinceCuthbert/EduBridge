import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    // Redirect authenticated users to their respective dashboard
    const redirectPath = isAdmin ? "/admin/dashboard" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicRoute;
