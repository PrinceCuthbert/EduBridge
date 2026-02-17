import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminFilterBar from "../../components/admin/AdminFilterBar";
import AdminTable from "../../components/admin/AdminTable";
import { useApplications } from "../../hooks/useApplications";

export default function ApplicationReview() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const { applications, loading, fetchApplications } = useApplications();

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.scholarship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Needs Changes":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Reviewing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const columns = [
    {
      header: "Applicant",
      render: (app) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={`https://ui-avatars.com/api/?name=${app.studentName}&background=f1f5f9&color=6366f1`} 
              alt={app.studentName}
              className="w-10 h-10 rounded-full border border-slate-200"
            />
          </div>
          <div className="flex flex-col">
            {/* REMOVED: font-serif, text-[17px], tracking-tight */}
            {/* ADDED: text-sm, font-medium */}
            <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
              {app.studentName}
            </span>
            {/* REMOVED: uppercase, tracking-[0.1em] */}
            <span className="text-xs text-slate-500">
              {app.id}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Program",
      render: (app) => (
        <div className="flex flex-col">
          {/* REMOVED: tracking-tight, font-bold */}
          <span className="text-sm text-slate-700 font-medium">
            {app.scholarship}
          </span>
        </div>
      )
    },
    {
      header: "Filing Date",
      render: (app) => (
        // REMOVED: uppercase, tracking-[0.15em]
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={14} className="text-slate-400" />
          {app.date}
        </div>
      )
    },
    {
      header: "Status",
      className: "text-center",
      render: (app) => (
        <div className="flex justify-center">
          {/* REMOVED: uppercase, tracking-[0.15em] */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'Approved' ? 'bg-emerald-500' : (app.status === 'Needs Changes' ? 'bg-amber-500' : 'bg-blue-500')}`} />
            {app.status}
          </span>
        </div>
      )
    },
    {
      header: "Actions",
      className: "justify-end pr-8 text-right",
      render: (app) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => navigate(`/admin/applications/${app.id}`)}
            // REMOVED: uppercase, tracking-widest, bg-[#0F172A], rounded-[1.25rem]
            // ADDED: text-sm, font-medium, rounded-lg, bg-slate-900
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors active:scale-95 flex items-center gap-2"
          >
            <Eye size={14} />
            View
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Application Review" 
        subtitle="Track and review student applications"
        count={filteredApps.length}
      />

      <AdminFilterBar 
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by name, ID or program..."
        filterOptions={["All", "Pending", "Reviewing", "Needs Changes", "Approved"]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <AdminTable 
        columns={columns}
        data={filteredApps}
        isLoading={loading}
        emptyState={
          !loading && (
             <div className="flex flex-col items-center max-w-sm mx-auto py-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <FileText size={32} className="text-slate-300" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 mb-1">No applications found</h4>
              <p className="text-sm text-slate-500 mb-6 text-center">
                We couldn't find any applications matching your search criteria.
              </p>
              <button 
                onClick={() => {setSearchTerm(""); setStatusFilter("All");}}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors"
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