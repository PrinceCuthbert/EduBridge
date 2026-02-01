
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Redirect based on role
  if (user && user.role === 'admin') {
      // In a real app we might have a separate AdminDashboard component
      // For now we will render a simple view
      return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p className="mb-4">Welcome, {user.name} ({user.email})</p>
            <Button onClick={logout} variant="destructive">Logout</Button>
        </div>
      );
  }

  if (user && user.role === 'student') {
      return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
            <p className="mb-4">Welcome, {user.name} ({user.email})</p>
            <Button onClick={logout} variant="outline">Logout</Button>
        </div>
      );
  }

  return <Navigate to="/signin" />;
}
