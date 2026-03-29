// src/hooks/useDashboard.js
import { useState, useEffect, useMemo } from 'react';
import { getUsers } from '../services/userService';
import { getApplications } from '../services/applicationService';
import { getVisaRequests } from '../services/visaService';
import { Users, FileText, Plane, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useQueries } from '@tanstack/react-query';

export function useDashboard() {
  const results = useQueries({
    queries: [
      { queryKey: ['users'], queryFn: getUsers },
      { queryKey: ['applications'], queryFn: getApplications },
      { queryKey: ['visaCases'], queryFn: getVisaRequests },
    ],
  });

  const [usersResult, appsResult, visaResult] = results;
  
  const users = usersResult.data || [];
  const applications = appsResult.data || [];
  const visaCases = visaResult.data || [];
  
  const loading = results.some(result => result.isLoading);
  const error = results.find(result => result.error)?.error;

  // 1. Calculate Stat Cards Dynamically
  const stats = useMemo(() => {
    const pendingApps = applications.filter(a => a.status === 'Pending').length;
    const activeVisa = visaCases.filter(v => v.status !== 'Approved' && v.status !== 'Rejected').length;

    return [
      {
        label: "Total Users",
        value: users.length.toString(),
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50"
      },
      {
        label: "Total Applications",
        value: applications.length.toString(),
        icon: FileText,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
      },
      {
        label: "Pending Review",
        value: pendingApps.toString(),
        icon: Award,
        color: "text-amber-600",
        bg: "bg-amber-50"
      },
      {
        label: "Active Visa Cases",
        value: activeVisa.toString(),
        icon: Plane,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
      }
    ];
  }, [users, applications, visaCases]);

  // 2. Extract Recent Applications
  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
      .slice(0, 4); // Get the 4 newest
  }, [applications]);

  const refresh = () => {
    results.forEach(result => result.refetch());
  };

  return { 
    stats, 
    recentApplications, 
    loading, 
    error,
    refresh
  };
}