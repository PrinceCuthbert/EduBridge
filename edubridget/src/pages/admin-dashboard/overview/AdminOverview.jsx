// src/pages/admin/AdminOverview.jsx
import React from "react";
import {
  Award,
  Building2,
  ScrollText,
  BarChart3,
  ArrowRight,
  FileText,
  Clock,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../../components/admin/AdminStatsGrid";
import StatusBadge from "../../../components/shared/StatusBadge"; // Reusing your badge!
import { formatDate } from "../../../utils/formatDate";

// IMPORT THE NEW DASHBOARD VIEWMODEL
import { useDashboard } from "../../../hooks/useDashboard";

const QUICK_ACTIONS_CONFIG = [
  {
    label: "Manage Applications",
    desc: "View applicants",
    icon: Award,
    color: "emerald",
    path: "/admin/applications",
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

const colorMap = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600" },
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600" },
};

export default function AdminOverview() {
  // Consume the ViewModel!
  const { stats, recentApplications, loading, refresh } = useDashboard();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <AdminPageHeader
        title="Admin Overview"
        subtitle="Manage your students, visa, applications, and branches."
      />

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      ) : (
        <>
          {/* Stat Cards populated directly from the hook */}
          <AdminStatsGrid stats={stats} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Quick Actions (Static Navigation) */}
            <div className="xl:col-span-1 flex flex-col gap-5">
              <div className="px-1">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Quick Actions
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {QUICK_ACTIONS_CONFIG.map((action, index) => {
                  const Icon = action.icon;
                  const colors = colorMap[action.color];
                  return (
                    <Link
                      key={index}
                      to={action.path}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200/60 hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                      <div
                        className={`p-3 rounded-xl ${colors.bg} ${colors.icon} transition-all group-hover:scale-105`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {action.label}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5 font-medium">
                          {action.desc}
                        </span>
                      </div>
                      <ArrowRight
                        size={16}
                        className="ml-auto text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Updates (Dynamic Data) */}
            <div className="xl:col-span-2 space-y-8">
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    New Applications
                  </h3>
                  <Link
                    to="/admin/applications"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
                  {recentApplications.length === 0 ? (
                    // The Empty State
                    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                        <FileText size={24} className="text-slate-300" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        No new applications
                      </h4>
                      <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed mb-6">
                        Check back later for new student applications.
                      </p>
                      <button
                        onClick={refresh}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all"
                      >
                        Refresh List
                      </button>
                    </div>
                  ) : (
                    // The Populated List
                    <div className="divide-y divide-slate-100">
                      {recentApplications.map((app) => (
                        <Link
                          key={app.trackerId}
                          to={`/admin/applications/${app.trackerId}/review`}
                          className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                              {app.applicant?.firstName?.[0]}
                              {app.applicant?.lastName?.[0]}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {app.applicant?.firstName}{" "}
                                {app.applicant?.lastName}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-slate-500">
                                  {app.programDetails?.universityName}
                                </p>
                                <span className="text-slate-300 text-[10px]">
                                  •
                                </span>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <Clock size={12} />{" "}
                                  {formatDate(app.submissionDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <StatusBadge status={app.status} />
                            <ArrowRight
                              size={16}
                              className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
