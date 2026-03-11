// src/hooks/useDashboard.js
import { useState, useEffect, useMemo } from 'react';
import { getUsers } from '../services/userService';
import { getApplications } from '../services/applicationService';
import { Users, FileText, Plane, Award } from 'lucide-react';
import { toast } from 'sonner';

export function useDashboard() {
  const [data, setData] = useState({ users: [], applications: [] });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch from both databases in parallel for speed!
      const [usersRes, appsRes] = await Promise.all([
        getUsers(),
        getApplications()
      ]);
      setData({ users: usersRes, applications: appsRes });
    } catch (error) {
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 1. Calculate Stat Cards Dynamically
  const stats = useMemo(() => {
    const { users, applications } = data;
    const pendingApps = applications.filter(a => a.status === 'Pending').length;

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
        label: "Active Visa Cases", // We will stub this until you build the Visa DB
        value: "0",
        icon: Plane,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
      }
    ];
  }, [data]);

  // 2. Extract Recent Applications
  const recentApplications = useMemo(() => {
    return [...data.applications]
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
      .slice(0, 4); // Get the 4 newest
  }, [data.applications]);

  return { 
    stats, 
    recentApplications, 
    loading, 
    refresh: fetchDashboardData 
  };
}