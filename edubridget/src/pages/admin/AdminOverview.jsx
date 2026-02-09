import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  FileText,
  Plane,
  TrendingUp,
  Award,
  Building2,
  ScrollText,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Mock stats data - Replace with API call
const MOCK_STATS = [
  {
    title: "Total Students",
    value: "0",
    icon: Users,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "Pending Applications",
    value: "0",
    icon: FileText,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-50",
  },
  {
    title: "Active Visa Cases",
    value: "0",
    icon: Plane,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    title: "Total Programs",
    value: "0",
    icon: Award,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
  },
];

// Quick actions configuration - Can be customized per admin role
const QUICK_ACTIONS_CONFIG = [
  {
    label: "Manage Programs",
    icon: Award,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    path: "/admin/programs",
  },
  {
    label: "Manage Branches",
    icon: Building2,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    path: "/admin/branches",
  },
  {
    label: "Update Content",
    icon: ScrollText,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    path: "/admin/cms",
  },
  {
    label: "View Reports",
    icon: BarChart3,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-50",
    path: "/admin/finance",
  },
];

/**
 * AdminOverview Component
 *
 * Modern SaaS dashboard matching the reference design
 */
export default function AdminOverview() {
  // Initialize state as empty - ready for API
  const [stats, setStats] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on mount - Replace with actual API call
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await dashboardAPI.getOverview();
        // setStats(response.data.stats);
        // setQuickActions(response.data.quickActions);

        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 300));
        setStats(MOCK_STATS);
        setQuickActions(QUICK_ACTIONS_CONFIG);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        if (import.meta.env.DEV) {
          console.error("Dashboard data fetch error:", error);
        }
        // Fallback to mock data on error
        setStats(MOCK_STATS);
        setQuickActions(QUICK_ACTIONS_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                <div className="w-4 h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                      <Icon size={20} className={stat.iconColor} />
                    </div>
                    <TrendingUp size={16} className="text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              QUICK ACTIONS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.path}
                    className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-primary hover:bg-slate-50 transition-all group">
                    <div
                      className={`p-2 rounded-lg ${action.iconBg} group-hover:scale-110 transition-transform`}>
                      <Icon size={18} className={action.iconColor} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Recent Applications & Active Visa Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-base">
              Recent Applications
            </h3>
            <Link
              to="/admin/applications"
              className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={28} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">
              No applications yet
            </p>
            <p className="text-sm text-slate-500">
              Applications will appear here once submitted
            </p>
          </div>
        </div>

        {/* Active Visa Cases */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-base">
              Active Visa Cases
            </h3>
            <Link
              to="/admin/visa"
              className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Plane size={28} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">
              No visa cases yet
            </p>
            <p className="text-sm text-slate-500">
              Visa cases will appear here once created
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
