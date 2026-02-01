
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * - Shows a loading spinner while checking auth status.
 * - Redirects to /signin if user is not authenticated.
 * - Optionally checks for specific roles (e.g., must be 'admin').
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected component to render
 * @param {string[]} [props.allowedRoles] - Array of roles allowed to access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while AuthContext initializes
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-slate-500 font-medium animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to Sign In, saving the current location to redirect back after login
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Role verification (optional)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have permission
    // Redirect to their appropriate dashboard or a 403 page
    // For simplicity, we redirect to home or their role's dashboard
    return <Navigate to="/" replace />;
  }

  // Authorized -> Render children
  return children;
};

export default ProtectedRoute;
