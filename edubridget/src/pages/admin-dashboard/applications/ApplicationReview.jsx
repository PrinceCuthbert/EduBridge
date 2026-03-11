// src/pages/admin/ApplicationReview.jsx
// Admin list view — shows ALL applications from all students.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminFilterBar  from "../../../components/admin/AdminFilterBar";
import AdminTable      from "../../../components/admin/AdminTable";
import StatusBadge     from "../../../components/shared/StatusBadge";
import { useApplications } from "../../../hooks/useApplications";
// [FIX #5] Replaced local formatDate with shared utility — src/utils/formatDate.js
import { formatDate } from "../../../utils/formatDate";


// table where all data of the applications are rendered


const TAB_OPTIONS = ["All", "Pending", "Reviewing", "Needs Changes", "Approved", "Rejected"];

const initials = (firstName = "", lastName = "") =>
  ((firstName[0] ?? "") + (lastName[0] ?? "")).toUpperCase() || "?";

export default function ApplicationReview() {
  const navigate = useNavigate();
  const [searchTerm,   setSearchTerm]   = useState("");
  const [activeTab,    setActiveTab]    = useState("All");

  // No userId → fetch all applications
  const { applications, loading, fetchApplications } = useApplications();

 // 1. Update filter to look inside the nested DTO
  const filtered = applications.filter((app) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      `${app.applicant?.firstName} ${app.applicant?.lastName}`.toLowerCase().includes(q) ||
      (app.programDetails?.universityName ?? "").toLowerCase().includes(q) ||
      (app.programDetails?.majorName ?? "").toLowerCase().includes(q) ||
      (app.trackerId ?? "").toLowerCase().includes(q);
    
    const matchesTab = activeTab === "All" || app.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const columns = [
    {
      header: "Applicant",
      render: (app) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
            <span className="text-xs font-bold">
              {initials(app.applicant.firstName, app.applicant.lastName)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {app.applicant.firstName} {app.applicant.lastName}
            </p>
            <p className="text-xs text-slate-400 font-mono">{app.id?.slice(-8).toUpperCase()}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Program",
      render: (app) => (
        <div>
          <p className="text-sm font-medium text-slate-900">{app.programDetails.universityName}</p>
          <p className="text-xs text-slate-500">{app.programDetails.majorName}</p>
        </div>
      ),
    },
   {
      header: "Submission",
      render: (app) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            {formatDate(app.submissionDate)}
          </div>
        </div>
      ),
    },
    {
      header: "Current Status",
      className: "text-center",
      render: (app) => (
        <div className="flex justify-center">
          <StatusBadge status={app.status} />
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right pr-6",
      render: (app) => (
        <div className="flex items-center justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Make sure to route using the new trackerId
              navigate(`/admin/applications/${app.trackerId}/review`);
            }}
            className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200"
          >
            Review
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader
        title="Application Review"
        subtitle="Track and manage student applications"
        count={filtered.length}
      />

      {/* Tab pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TAB_OPTIONS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors
              ${activeTab === tab
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AdminFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by name, ID or program…"
      />

      <AdminTable
        columns={columns}
        data={filtered}
        isLoading={loading}
        emptyState={
          !loading && (
            <div className="flex flex-col items-center max-w-sm mx-auto py-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <FileText size={32} className="text-slate-300" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 mb-1">
                No applications found
              </h4>
              <p className="text-sm text-slate-500 text-center">
                Try adjusting the search or status filter.
              </p>
              <button
                onClick={() => { setSearchTerm(""); setActiveTab("All"); }}
                className="mt-4 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )
        }
      />
    </div>
  );
}