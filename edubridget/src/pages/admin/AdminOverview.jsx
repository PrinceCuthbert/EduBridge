import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Plane,
  TrendingUp,
  Award,
  Building2,
  ScrollText,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";

const MOCK_STATS = [
  {
    label: "Total Students",
    value: "1,284",
    change: "+12.5%",
    trend: "12% increase",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "New Applications",
    value: "42",
    change: "+3.2%",
    trend: "3% increase",
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Visa Consultations",
    value: "156",
    change: "+8.4%",
    trend: "8% increase",
    icon: Plane,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    label: "Total Programs",
    value: "84",
    change: "0%",
    trend: "Stable",
    icon: Award,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const QUICK_ACTIONS_CONFIG = [
  {
    label: "Manage Programs",
    desc: "Update university courses",
    icon: Award,
    color: "emerald",
    path: "/admin/programs",
  },
  {
    label: "Manage Branches",
    desc: "Overseas regional offices",
    icon: Building2,
    color: "blue",
    path: "/admin/branches",
  },
  {
    label: "Update Content",
    desc: "CMS & Blog management",
    icon: ScrollText,
    color: "purple",
    path: "/admin/cms",
  },
  {
    label: "View Reports",
    desc: "Financial analytics",
    icon: BarChart3,
    color: "amber",
    path: "/admin/finance",
  },
];

export default function AdminOverview() {
  const [stats, setStats] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStats(MOCK_STATS);
        setQuickActions(QUICK_ACTIONS_CONFIG);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        setStats(MOCK_STATS);
        setQuickActions(QUICK_ACTIONS_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
    },
    indigo: {
      bg: "bg-indigo-50",
      icon: "text-indigo-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
    },
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <AdminPageHeader 
        title="Admin Overview" 
        subtitle="Manage your students, visa, applications, and branches."
      />

      <AdminStatsGrid stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="xl:col-span-1 flex flex-col gap-5">
          <div className="px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colors = colorMap[action.color];
              return (
                <Link
                  key={index}
                  to={action.path}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200/60 hover:border-blue-500 hover:shadow-md transition-all group">
                  <div className={`p-3 rounded-xl ${colors.bg} ${colors.icon} transition-all group-hover:scale-105`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {action.label}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 font-medium">
                      {action.desc}
                    </span>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="xl:col-span-2 space-y-8">
          {/* Applications */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Applications</h3>
               <Link to="/admin/applications" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
            </div>
            
            <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <FileText size={24} className="text-slate-300" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">No new applications</h4>
                <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed mb-6">
                  Check back later for new student applications.
                </p>
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                  Refresh List
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
