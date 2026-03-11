// src/pages/dashboard/MyApplications.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, ChevronDown, GraduationCap, ChevronUp, CheckCircle2, Clock, Circle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { useApplications } from "../../../hooks/useApplications";
import StatusBadge from "../../../components/shared/StatusBadge";
import { formatDate } from "../../../utils/formatDate";
import { Skeleton } from "../../../components/ui/Skeleton";
import { getApplicationTimeline } from "../../../data/applicationTimelines";

const STATUS_OPTIONS = ["All Statuses", "Pending", "Reviewing", "Needs Changes", "Approved", "Rejected"];
const SORT_OPTIONS   = ["Newest First", "Oldest First"];

const SkeletonRow = () => (
  <tr>
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-3/4" />
      </td>
    ))}
  </tr>
);

export default function MyApplications() {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [sortOrder,    setSortOrder]    = useState("Newest First");
  const [expandedApp,  setExpandedApp]  = useState(null); 

  const { applications, loading, deleteApplication } = useApplications(user?.id);

  // ── Filter & sort ──────────────────────────────────────────────────────────
  const displayed = [...applications]
    .filter((app) =>
      filterStatus === "All Statuses" ? true : app.status === filterStatus
    )
    .sort((a, b) => {
      const diff = new Date(b.submissionDate) - new Date(a.submissionDate);
      return sortOrder === "Newest First" ? diff : -diff;
    });

  // ── Delete Handler ─────────────────────────────────────────────────────────
  const handleDelete = (app) => {
    toast.warning(`Delete application for ${app.programDetails?.universityName}?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          await deleteApplication(app.trackerId);
          toast.success("Application deleted.");
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
      duration: 8000,
    });
  };

  // ── Modern Column Definition ───────────────────────────────────────────────
  // Defining columns here allows us to access component scope (navigate, expandedApp)
  const columns = [
    {
      header: "University & Program",
      className: "px-6 py-4",
      render: (app) => (
        <div>
          <p className="text-sm font-medium text-slate-900">{app.programDetails?.universityName}</p>
          <p className="text-xs text-slate-500 mt-0.5">{app.programDetails?.majorName}</p>
        </div>
      )
    },
    {
      header: "Submission Date",
      className: "px-6 py-4",
      render: (app) => (
        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {formatDate(app.submissionDate)}
        </span>
      )
    },
    {
      header: "Tracker",
      className: "px-6 py-4",
      render: (app) => {
        // Read from trackerStages (camelCase) based on your new DB structure
        const stages = app.trackerStages || [];
        const done = stages.filter(s => s.completed).length;
        
        if (stages.length === 0) return <span className="text-xs text-slate-300">—</span>;

        return (
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(done / stages.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{done}/{stages.length}</span>
          </div>
        );
      }
    },
    {
      header: "Status",
      className: "px-6 py-4",
      render: (app) => <StatusBadge status={app.status} />
    },
    {
      header: "Actions",
      className: "px-6 py-4 text-center",
      render: (app) => {
        const isOpen = expandedApp === app.trackerId;
        return (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => navigate(`/dashboard/applications/${app.trackerId}`)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="View Details">
              <Eye size={16} />
            </button>
            <button onClick={() => navigate(`/dashboard/applications/edit/${app.trackerId}?edit=true`)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Application">
              <Edit size={16} />
            </button>
            <button onClick={() => handleDelete(app)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Application">
              <Trash2 size={16} />
            </button>
            <button onClick={() => setExpandedApp(isOpen ? null : app.trackerId)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title={isOpen ? 'Hide Timeline' : 'View Timeline'}>
              {isOpen ? <ChevronUp size={16} /> : <Clock size={16} />}
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Applications</h1>

        <div className="flex items-center gap-3">
          {/* Status filter */}
          <div className="relative">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            
            {/* Dynamic Headers based on columns array */}
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${col.header === 'Actions' ? 'text-center' : ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading && [...Array(3)].map((_, i) => <SkeletonRow key={i} />)}

              {!loading && displayed.length === 0 && (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="flex flex-col items-center py-16 gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
                        <GraduationCap size={28} className="text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700">
                          {filterStatus === "All Statuses" ? "No applications yet" : `No "${filterStatus}" applications`}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {filterStatus === "All Statuses" ? "Browse programs and submit your first application." : "Try a different status filter."}
                        </p>
                      </div>
                      {filterStatus === "All Statuses" && (
                        <button onClick={() => navigate("/dashboard/programs")} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          Browse Programs
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Dynamic Rows using columns.map() */}
              {!loading && displayed.map((app) => {
                const isOpen = expandedApp === app.trackerId;
                const stages = app.trackerStages || [];
                const timeline = getApplicationTimeline(app.trackerId); // Fallback to mock timeline if needed

                return (
                  <React.Fragment key={app.trackerId}>
                    
                    {/* Main Row */}
                    <tr className={`hover:bg-slate-50/50 transition-colors group ${isOpen ? 'bg-blue-50/30' : ''}`}>
                      {columns.map((col, colIndex) => (
                        <td key={colIndex} className={col.className}>
                          {col.render(app)}
                        </td>
                      ))}
                    </tr>

                    {/* Expandable Timeline Row */}
                    {isOpen && (
                      <tr>
                        <td colSpan={columns.length} className="px-6 pb-5 pt-2 bg-blue-50/20">
                          <div className="border border-blue-100 rounded-xl p-4 bg-white">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Application Timeline</p>
                            
                            {stages.length > 0 && (
                              <div className="flex items-start gap-0 mb-4 flex-wrap">
                                {stages.map((stage, i) => {
                                  const isLast = i === stages.length - 1;
                                  return (
                                    <React.Fragment key={stage.stage}>
                                      <div className="flex flex-col items-center text-center w-24">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${stage.completed ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                          {stage.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                        </div>
                                        <p className={`text-[11px] font-semibold ${stage.completed ? 'text-blue-700' : 'text-slate-400'}`}>{stage.stage}</p>
                                        {stage.date && <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(stage.date)}</p>}
                                      </div>
                                      {!isLast && <div className={`flex-1 h-0.5 mt-3.5 min-w-[16px] ${stage.completed ? 'bg-blue-300' : 'bg-slate-200'}`} />}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            )}

                            {/* Detailed Log */}
                            {timeline.length > 0 ? (
                              <div className="space-y-2 mt-2 border-t border-slate-100 pt-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detailed Log</p>
                                {timeline.map(entry => (
                                  <div key={entry.id} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                    <div className="flex-1">
                                      <span className="text-xs font-semibold text-slate-700">{entry.status1}</span>
                                      {entry.status2 && <span className="text-xs text-slate-400 ml-1.5">→ {entry.status2}</span>}
                                      {entry.note && <p className="text-xs text-slate-500">{entry.note}</p>}
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                      {new Date(entry.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic mt-2">No detailed timeline entries yet.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}