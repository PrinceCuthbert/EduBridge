// src/pages/dashboard/MyApplications.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, ChevronDown, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { useApplications } from "../../../hooks/useApplications";
import StatusBadge from "../../../components/shared/StatusBadge";
// [FIX #5] Replaced local formatDate with shared utility — src/utils/formatDate.js
import { formatDate } from "../../../utils/formatDate";

const STATUS_OPTIONS = ["All Statuses", "Pending", "Reviewing", "Needs Changes", "Approved", "Rejected"];
const SORT_OPTIONS   = ["Newest First", "Oldest First"];

// ── Skeleton row ─────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(4)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-slate-100 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

export default function MyApplications() {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [sortOrder,    setSortOrder]    = useState("Newest First");

  const {
    applications,
    loading,
    fetchApplications,
    deleteApplication,
  } = useApplications(user?.id);

  // [FIX #1] Manual fetch removed — useApplications auto-fetches on mount now.

  // ── Filter & sort ──────────────────────────────────────────────────────────
  const displayed = [...applications]
    .filter((app) =>
      filterStatus === "All Statuses" ? true : app.status === filterStatus
    )
    .sort((a, b) => {
      const diff = new Date(b.submissionDate) - new Date(a.submissionDate);
      return sortOrder === "Newest First" ? diff : -diff;
    });

  // ── Delete with toast confirm ──────────────────────────────────────────────
  const handleDelete = (app) => {
    toast.warning(`Delete application for ${app.universityName}?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          await deleteApplication(app.id);
          toast.success("Application deleted.");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      duration: 8000,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Applications</h1>

        <div className="flex items-center gap-3">
          {/* Status filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  University &amp; Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Submission Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Loading skeleton */}
              {loading && [...Array(3)].map((_, i) => <SkeletonRow key={i} />)}

              {/* Empty state */}
              {!loading && displayed.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-col items-center py-16 gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
                        <GraduationCap size={28} className="text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700">
                          {filterStatus === "All Statuses"
                            ? "No applications yet"
                            : `No "${filterStatus}" applications`}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {filterStatus === "All Statuses"
                            ? "Browse programs and submit your first application."
                            : "Try a different status filter."}
                        </p>
                      </div>
                      {filterStatus === "All Statuses" && (
                        <button
                          onClick={() => navigate("/dashboard/programs")}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Browse Programs
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Rows */}
              {!loading &&
                displayed.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* University & Program */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {app.universityName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {app.programName}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {formatDate(app.submissionDate)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => navigate(`/dashboard/applications/${app.id}`)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() =>
                            navigate(`/dashboard/applications/edit/${app.id}?edit=true`)
                          }
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Application"
                        >
                          <Edit size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(app)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}